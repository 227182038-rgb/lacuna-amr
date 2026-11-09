import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { DRUGS, loadHypotheses, loadMainResults, loadSplitsManifest, RUO_NOTICE, type FoldData } from "@/lib/lacuna/data";
import { auditSplits } from "@/lib/lacuna/splits-audit";
import { resolveOrgContext } from "@/lib/lacuna/org-context";
import { withMetrics } from "@/lib/lacuna/observability";

export const dynamic = "force-dynamic";

function modelRow(fold: FoldData | undefined, model: "M0" | "M1" | "M2") {
  const res = fold?.[model];
  const m: Record<string, number> = res?.metrics ?? {};
  return {
    auroc: m.AUROC ?? null,
    aurocCi: res?.ci95?.AUROC ?? null,
    brier: m.Brier ?? null,
    ca: m.CA ?? null,
    vme: m.VME ?? null,
    me: m.ME ?? null,
    nR: m.n_R ?? null,
    nS: m.n_S ?? null,
    coverage: res?.conformal_mondrian?.coverage_overall ?? null,
    coverageR: res?.conformal_mondrian?.coverage_R ?? null,
    coverageS: res?.conformal_mondrian?.coverage_S ?? null,
    meanSetSize: res?.conformal_mondrian?.mean_set_size ?? null,
  };
}

async function GET_impl() {
  const main = loadMainResults();
  const hyp = loadHypotheses();
  const manifest = loadSplitsManifest();

  const results: {
    drug: string;
    split: string;
    variant: string;
    model: string;
    auroc: number | null;
    aurocCi: [number, number] | null;
    brier: number | null;
    ca: number | null;
    vme: number | null;
    me: number | null;
    nR: number | null;
    nS: number | null;
    coverage: number | null;
    coverageR: number | null;
    coverageS: number | null;
    meanSetSize: number | null;
  }[] = [];

  const s0MeanCoverage: Record<string, Record<string, number>> = {};

  for (const drug of DRUGS) {
    const bySplit = main[drug] ?? {};
    const s0Cov = bySplit["S0_mean_coverage"];
    if (s0Cov) s0MeanCoverage[drug] = s0Cov;

    // S0: 10 folds → mean AUROC per model; CI shown as range across folds
    const s0 = bySplit["S0"];
    if (Array.isArray(s0)) {
      for (const model of ["M0", "M1", "M2"] as const) {
        const rows = s0.map((f) => modelRow(f, model));
        const aurocs = rows.map((r) => r.auroc).filter((v): v is number => v !== null);
        const cis = rows.map((r) => r.aurocCi).filter((v): v is [number, number] => v !== null);
        const covs = rows.map((r) => r.coverage).filter((v): v is number => v !== null);
        results.push({
          drug,
          split: "S0",
          variant: "10-fold mean",
          model,
          auroc: aurocs.length ? aurocs.reduce((a, b) => a + b, 0) / aurocs.length : null,
          aurocCi: cis.length ? [Math.min(...cis.map((c) => c[0])), Math.max(...cis.map((c) => c[1]))] : null,
          brier: null,
          ca: null,
          vme: null,
          me: null,
          nR: null,
          nS: null,
          coverage: covs.length ? covs.reduce((a, b) => a + b, 0) / covs.length : null,
          coverageR: null,
          coverageS: null,
          meanSetSize: null,
        });
      }
    }

    // S1 / S3: per-group folds
    for (const split of ["S1", "S3"] as const) {
      const groups = bySplit[split];
      if (groups && typeof groups === "object") {
        for (const [group, fold] of Object.entries(groups)) {
          for (const model of ["M0", "M1", "M2"] as const) {
            results.push({ drug, split, variant: group, model, ...modelRow(fold, model) });
          }
        }
      }
    }

    // S2: forward_time fold or null (infeasible)
    const s2 = bySplit["S2"];
    if (s2 && typeof s2 === "object" && s2["forward_time"]) {
      for (const model of ["M0", "M1", "M2"] as const) {
        results.push({ drug, split: "S2", variant: "forward time", model, ...modelRow(s2["forward_time"], model) });
      }
    }
  }

  return NextResponse.json({
    notice: RUO_NOTICE,
    splitsManifest: manifest,
    results,
    s0MeanCoverage,
    hypotheses: hyp,
  });
}

interface ValidateBody {
  drug?: string;
}

/** Re-run the G3-style split-leakage auditor live on the sealed splits. */
async function POST_impl(req: Request) {
  const ctx = await resolveOrgContext(req);

  let body: ValidateBody;
  try {
    body = (await req.json()) as ValidateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const drug = body.drug;
  if (!drug || !DRUGS.includes(drug as (typeof DRUGS)[number])) {
    return NextResponse.json({ error: `drug must be one of: ${DRUGS.join(", ")}` }, { status: 400 });
  }

  const result = auditSplits(drug as (typeof DRUGS)[number]);

  let runId: string | null = null;
  try {
    const rec = await db.validateRun.create({
      data: {
        organizationId: ctx.orgId,
        drug: result.drug,
        problems: result.problems.length,
        verdict: result.verdict,
        results: JSON.stringify(result),
      },
    });
    runId = rec.id;
  } catch {
    // best-effort
  }

  await recordAudit(ctx.actor, "validate.run", {
    runId,
    drug: result.drug,
    problems: result.problems.length,
    verdict: result.verdict,
    workspace: ctx.orgSlug ?? "open",
  });

  return NextResponse.json({ audit: result, runId });
}

export const GET = withMetrics("validate", GET_impl);
export const POST = withMetrics("validate", POST_impl);
