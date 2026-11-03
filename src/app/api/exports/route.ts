import { NextResponse } from "next/server";
import { z } from "zod";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { DRUGS, RUO_NOTICE } from "@/lib/lacuna/data";
import { buildAuditCsv, buildFhirExport, buildGlassRows, buildPredictionsCsv, glassToCsv } from "@/lib/lacuna/exports";

export const dynamic = "force-dynamic";

const exportSchema = z.object({
  format: z.enum(["fhir", "glass", "audit", "predictions"]),
  drug: z.string().optional(),
  runId: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = exportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  }
  const { format, drug, runId } = parsed.data;
  if (drug && !DRUGS.includes(drug as (typeof DRUGS)[number])) {
    return NextResponse.json({ error: `drug must be one of: ${DRUGS.join(", ")}` }, { status: 400 });
  }

  try {
    if (format === "fhir") {
      const out = await buildFhirExport(runId);
      await recordAudit("console", "export.fhir", { n: out.n, runId: runId ?? "latest-50" });
      return NextResponse.json({ ...out, notice: `${RUO_NOTICE} FHIR R4 Bundle with v3-ObservationInterpretation codes; no LOINC codes are asserted.` });
    }
    if (format === "glass") {
      const rows = buildGlassRows(drug);
      const content = glassToCsv(rows);
      await recordAudit("console", "export.glass", { rows: rows.length, drug: drug ?? "all" });
      return NextResponse.json({
        filename: `lacuna-glass-style-${drug ?? "all"}-${new Date().toISOString().slice(0, 10)}.csv`,
        mime: "text/csv",
        content,
        n: rows.length,
        notice: `${RUO_NOTICE} GLASS-style aggregate; not an official WHO GLASS submission format.`,
      });
    }
    if (format === "audit") {
      const out = await buildAuditCsv();
      await recordAudit("console", "export.audit", { n: out.n });
      return NextResponse.json({ ...out, notice: "Complete hash-chained audit trail as CSV." });
    }
    const out = await buildPredictionsCsv(drug);
    await recordAudit("console", "export.predictions", { n: out.n, drug: drug ?? "all" });
    return NextResponse.json({ ...out, notice: RUO_NOTICE });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Export failed." }, { status: 500 });
  }
}
