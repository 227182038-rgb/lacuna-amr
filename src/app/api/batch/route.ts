import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { authenticateKey } from "@/lib/lacuna/api-auth";
import { DRUGS, loadAstTable, loadCohortTable, RUO_NOTICE } from "@/lib/lacuna/data";
import { predict } from "@/lib/lacuna/engine";
import { resolveOrgContext } from "@/lib/lacuna/org-context";
import { withMetrics } from "@/lib/lacuna/observability";

export const dynamic = "force-dynamic";

const CHUNK = 20; // isolates scored per poll (see DEVIATIONS.md D-26)

const createSchema = z.object({
  drug: z.string(),
  modelType: z.enum(["M0", "M1", "M2"]).default("M1"),
  n: z.number().int().min(10).max(240).default(60),
  label: z.string().min(1).max(120).default("Batch run"),
});

/** Deterministic batch selection: labelled cohort isolates, sorted by accession. */
function selectIsolates(drug: string, n: number): string[] {
  const cohort = loadCohortTable();
  const ast = loadAstTable();
  const labelByIso = new Map<string, string>();
  for (const r of ast.rows) {
    if (r.drug === drug && (r.labelEucast === "S" || r.labelEucast === "R")) labelByIso.set(r.biosample, r.labelEucast);
  }
  return cohort
    .map((c) => c.biosample)
    .filter((b) => labelByIso.has(b))
    .sort()
    .slice(0, n);
}

interface BatchResultRow {
  isolate: string;
  pR: number;
  call: "S" | "R";
  m0Call: "S" | "R";
  conformalSet: string;
  determinants: number;
  label: string | null; // EUCAST label where available
}

interface BatchSummary {
  n: number;
  calls: { S: number; R: number };
  conformalSets: Record<string, number>;
  meanPR: number;
  nLabelled: number;
  agreementWithLabel: number | null;
  setCoverageVsLabel: number | null; // fraction of labelled units whose EUCAST label is inside the conformal set
  m0ModelAgreement: number | null;
}

function summarize(rows: BatchResultRow[], modelType: string): BatchSummary {
  const calls = { S: 0, R: 0 };
  const conformalSets: Record<string, number> = {};
  let pRSum = 0;
  let nLabelled = 0;
  let agree = 0;
  let covered = 0;
  let m0Agree = 0;
  for (const r of rows) {
    calls[r.call]++;
    conformalSets[r.conformalSet] = (conformalSets[r.conformalSet] ?? 0) + 1;
    pRSum += r.pR;
    if (r.label) {
      nLabelled++;
      if (r.call === r.label) agree++;
      const set = r.conformalSet;
      if (set === "S+R" || set === r.label) covered++;
    }
    if (r.m0Call === r.call) m0Agree++;
  }
  return {
    n: rows.length,
    calls,
    conformalSets,
    meanPR: rows.length ? pRSum / rows.length : 0,
    nLabelled,
    agreementWithLabel: nLabelled ? agree / nLabelled : null,
    setCoverageVsLabel: nLabelled ? covered / nLabelled : null,
    m0ModelAgreement: modelType === "M0" ? null : rows.length ? m0Agree / rows.length : null,
  };
}

async function GET_impl(req: Request) {
  const ctx = await resolveOrgContext(req);
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    const jobs = await db.batchJob.findMany({ where: { organizationId: ctx.orgId }, orderBy: { createdAt: "desc" }, take: 20 });
    return NextResponse.json({
      jobs: jobs.map((j) => ({
        id: j.id,
        label: j.label,
        drug: j.drug,
        modelType: j.modelType,
        n: j.n,
        done: j.done,
        status: j.status,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
      })),
    });
  }

  const job = await db.batchJob.findUnique({ where: { id } });
  if (!job || job.organizationId !== ctx.orgId) {
    // cross-tenant reads are indistinguishable from missing jobs
    return NextResponse.json({ error: "Batch job not found." }, { status: 404 });
  }

  if (job.status === "queued" || job.status === "running") {
    const isolates: string[] = JSON.parse(job.isolates);
    const results: BatchResultRow[] = JSON.parse(job.results);
    const ast = loadAstTable();
    const labelByIso = new Map<string, string>();
    for (const r of ast.rows) {
      if (r.drug === job.drug && (r.labelEucast === "S" || r.labelEucast === "R")) labelByIso.set(r.biosample, r.labelEucast);
    }

    const start = job.done;
    const end = Math.min(start + CHUNK, job.n);
    for (let i = start; i < end; i++) {
      const iso = isolates[i];
      const out = predict({ drug: job.drug, isolate: iso, modelType: job.modelType as "M0" | "M1" | "M2" });
      if ("error" in out) {
        results.push({ isolate: iso, pR: 0, call: "S", m0Call: "S", conformalSet: "ABSTAIN", determinants: 0, label: labelByIso.get(iso) ?? null });
        continue;
      }
      results.push({
        isolate: iso,
        pR: out.pR,
        call: out.call,
        m0Call: out.m0Call,
        conformalSet: out.conformalSetMondrian,
        determinants: out.determinants.length,
        label: labelByIso.get(iso) ?? null,
      });
      // Traceability: every scored isolate lands in the PredictRun ledger
      try {
        await db.predictRun.create({
          data: {
            organizationId: job.organizationId,
            drug: out.drug,
            isolate: out.isolate,
            modelType: out.modelType,
            m0Call: out.m0Call,
            pR: out.pR,
            call: out.call,
            conformalSet: out.conformalSetMondrian,
            input: JSON.stringify({ batchId: job.id, isolate: iso, modelType: job.modelType }),
            output: JSON.stringify(out),
          },
        });
      } catch {
        // best-effort
      }
    }

    const done = end;
    const status = done >= job.n ? "complete" : "running";
    const summary = status === "complete" ? summarize(results, job.modelType) : null;

    await db.batchJob.update({
      where: { id: job.id },
      data: { done, status, results: JSON.stringify(results), summary: summary ? JSON.stringify(summary) : undefined },
    });

    if (status === "complete") {
      await recordAudit(ctx.actor, "batch.complete", {
        batchId: job.id,
        label: job.label,
        drug: job.drug,
        modelType: job.modelType,
        n: job.n,
        calls: summary!.calls,
        setCoverageVsLabel: summary!.setCoverageVsLabel,
      });
    }

    const withResults = url.searchParams.get("results") === "1";
    return NextResponse.json({
      job: {
        id: job.id,
        label: job.label,
        drug: job.drug,
        modelType: job.modelType,
        n: job.n,
        done,
        status,
      },
      summary,
      results: withResults ? results : results.slice(-5),
      notice: RUO_NOTICE,
    });
  }

  // completed/failed: return stored state
  const results: BatchResultRow[] = JSON.parse(job.results);
  const withResults = url.searchParams.get("results") === "1";
  return NextResponse.json({
    job: { id: job.id, label: job.label, drug: job.drug, modelType: job.modelType, n: job.n, done: job.done, status: job.status },
    summary: job.summary ? JSON.parse(job.summary) : null,
    results: withResults ? results : results.slice(-5),
    notice: RUO_NOTICE,
  });
}

async function POST_impl(req: Request) {
  // Workspace resolution FIRST: a signed-in session attributes the job to the
  // user's active org; an API key attributes it to the key's org; otherwise
  // the open workspace (v0.4.x behavior).
  const ctx = await resolveOrgContext(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  }
  const { drug, modelType, n, label } = parsed.data;
  if (!DRUGS.includes(drug as (typeof DRUGS)[number])) {
    return NextResponse.json({ error: `drug must be one of: ${DRUGS.join(", ")}` }, { status: 400 });
  }

  // API-key path: enforce + charge credits when a key is presented
  const auth = await authenticateKey(req);
  if ("ok" in auth && !auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  let actor = "console";
  if ("ok" in auth && auth.ok) {
    if (n > auth.rec.credits) {
      return NextResponse.json({ error: `Key ${auth.rec.keyPrefix}… has ${auth.rec.credits} credits; batch of ${n} exceeds it.` }, { status: 402 });
    }
    await db.apiKey.update({ where: { id: auth.rec.id }, data: { credits: auth.rec.credits - n, lastUsedAt: new Date() } });
    actor = auth.actor;
  }

  const isolates = selectIsolates(drug, n);
  if (isolates.length === 0) {
    return NextResponse.json({ error: "No labelled isolates available for this drug." }, { status: 400 });
  }

  const job = await db.batchJob.create({
    data: {
      organizationId: ctx.orgId,
      label,
      drug,
      modelType,
      n: isolates.length,
      isolates: JSON.stringify(isolates),
      results: "[]",
      status: "queued",
    },
  });

  await recordAudit(actor, "batch.submit", {
    batchId: job.id,
    label,
    drug,
    modelType,
    n: isolates.length,
    chargedCredits: "ok" in auth && auth.ok ? isolates.length : 0,
  });

  return NextResponse.json({
    job: { id: job.id, label: job.label, drug: job.drug, modelType: job.modelType, n: job.n, done: 0, status: "queued" },
    actor,
    workspace: { id: ctx.orgId, name: ctx.orgName },
    notice: `Queued ${isolates.length} labelled cohort isolates. Processing advances in chunks of ${CHUNK} per poll — progress reflects real engine computation.`,
  });
}

export const GET = withMetrics("batch", GET_impl);
export const POST = withMetrics("batch", POST_impl);
