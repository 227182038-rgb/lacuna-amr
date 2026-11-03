import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditAstRows, DEFAULT_THRESHOLDS, parseUserAst, type AuditThresholds } from "@/lib/lacuna/audit";
import { loadAstTable, loadCohortTable } from "@/lib/lacuna/data";

export const dynamic = "force-dynamic";

interface AuditBody {
  source?: "cohort" | "paste";
  text?: string;
  cohortOnly?: boolean;
  thresholds?: Partial<AuditThresholds>;
}

export async function POST(req: Request) {
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

  return NextResponse.json({ audit, savedRuns });
}

export async function GET() {
  const runs = await db.auditRun.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
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
