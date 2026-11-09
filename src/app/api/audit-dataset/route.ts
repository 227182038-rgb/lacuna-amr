import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { auditAstRows, DEFAULT_THRESHOLDS, parseUserAst, type AuditThresholds } from "@/lib/lacuna/audit";
import { loadAstTable, loadCohortTable } from "@/lib/lacuna/data";
import { resolveOrgContext } from "@/lib/lacuna/org-context";
import { withMetrics } from "@/lib/lacuna/observability";

export const dynamic = "force-dynamic";

interface AuditBody {
  source?: "cohort" | "paste";
  text?: string;
  cohortOnly?: boolean;
  thresholds?: Partial<AuditThresholds>;
}

async function POST_impl(req: Request) {
  const ctx = await resolveOrgContext(req);

  let body: AuditBody;
  try {
    body = (await req.json()) as AuditBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const thresholds: AuditThresholds = {
    minIsolates: body.thresholds?.minIsolates ?? DEFAULT_THRESHOLDS.minIsolates,
    minR: body.thresholds?.minR ?? DEFAULT_THRESHOLDS.minR,
    minS: body.thresholds?.minS ?? DEFAULT_THRESHOLDS.minS,
    minBioprojects: body.thresholds?.minBioprojects ?? DEFAULT_THRESHOLDS.minBioprojects,
  };

  let rows;
  let sourceLabel: string;
  if (body.source === "paste") {
    const parsed = parseUserAst(body.text ?? "");
    if (parsed.errors.length > 0) {
      return NextResponse.json({ error: parsed.errors.join(" ") }, { status: 400 });
    }
    rows = parsed.rows;
    sourceLabel = "user-pasted AST table";
  } else {
    let astRows = loadAstTable().rows;
    if (body.cohortOnly) {
      const cohort = new Set(loadCohortTable().map((c) => c.biosample));
      astRows = astRows.filter((r) => cohort.has(r.biosample));
    }
    rows = astRows;
    sourceLabel = body.cohortOnly ? "bundled pilot cohort (240 isolates)" : "bundled pilot AST table (all downloaded isolates)";
  }

  const audit = auditAstRows(rows, thresholds, { source: sourceLabel, version: "0.2.0-web" });

  // Persist one row per audited drug for traceability
  const savedRuns: { id: string; drug: string; verdict: string }[] = [];
  for (const d of audit.drugs) {
    try {
      const rec = await db.auditRun.create({
        data: {
          organizationId: ctx.orgId,
          source: body.source === "paste" ? "paste" : body.cohortOnly ? "cohort" : "ast-table",
          drug: d.drug,
          verdict: d.verdict,
          nLabelled: d.nLabelledSR,
          summary: `S=${d.nS} R=${d.nR} I=${d.nI} censored=${d.nCensored} — ${d.verdict}`,
          input: JSON.stringify({ source: sourceLabel, thresholds, nRows: rows.length }),
          results: JSON.stringify(d),
        },
      });
      savedRuns.push({ id: rec.id, drug: d.drug, verdict: d.verdict });
    } catch {
      // DB persistence is best-effort; the audit result is still returned
    }
  }

  await recordAudit(ctx.actor, "audit-dataset.run", {
    source: body.source === "paste" ? "paste" : body.cohortOnly ? "cohort" : "ast-table",
    nDrugs: audit.drugs.length,
    nRows: rows.length,
    verdicts: audit.drugs.map((d) => `${d.drug}:${d.verdict}`).join(" "),
    workspace: ctx.orgSlug ?? "open",
  });

  return NextResponse.json({ audit, savedRuns, workspace: { id: ctx.orgId, name: ctx.orgName } });
}

async function GET_impl(req: Request) {
  const ctx = await resolveOrgContext(req);
  const runs = await db.auditRun.findMany({ where: { organizationId: ctx.orgId }, orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json({
    runs: runs.map((r) => ({
      id: r.id,
      source: r.source,
      drug: r.drug,
      verdict: r.verdict,
      nLabelled: r.nLabelled,
      summary: r.summary,
      createdAt: r.createdAt,
    })),
  });
}

export const POST = withMetrics("audit-dataset", POST_impl);
export const GET = withMetrics("audit-dataset", GET_impl);
