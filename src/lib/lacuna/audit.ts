// `audit-dataset` engine — label heterogeneity + data-gate (DG) verdicts.
// Re-implements the CLI's audit on either the bundled cohort AST table or a
// user-pasted table in the documented schema.

import type { AstRow, AuditOutput, DrugAuditResult } from "./types";

export interface AuditThresholds {
  minIsolates: number;
  minR: number;
  minS: number;
  minBioprojects: number;
}

export const DEFAULT_THRESHOLDS: AuditThresholds = {
  minIsolates: 800,
  minR: 100,
  minS: 100,
  minBioprojects: 5,
};

function tally(values: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) {
    if (!v) continue;
    for (const part of v.split(";")) {
      const k = part.trim();
      if (k) out[k] = (out[k] ?? 0) + 1;
    }
  }
  return out;
}

export function auditAstRows(
  rows: AstRow[],
  thresholds: AuditThresholds,
  meta: { source: string; version: string }
): AuditOutput {
  const drugs = Array.from(new Set(rows.map((r) => r.drug))).sort();
  const perDrug: DrugAuditResult[] = drugs.map((drug) => {
    const dRows = rows.filter((r) => r.drug === drug);
    const labelTally = tally(dRows.map((r) => r.labelEucast));
    const nS = labelTally["S"] ?? 0;
    const nR = labelTally["R"] ?? 0;
    const nI = labelTally["I"] ?? 0;
    const nCensored = labelTally["INDETERMINATE_CENSORED"] ?? 0;
    const bioprojects = new Set(dRows.filter((r) => r.labelEucast === "S" || r.labelEucast === "R").map((r) => r.bioproject));
    const checks: DrugAuditResult["dgChecks"] = [
      { key: "min_isolates", label: "Labelled S/R isolates ≥ 800", value: nS + nR, threshold: thresholds.minIsolates, pass: nS + nR >= thresholds.minIsolates },
      { key: "min_R", label: "Resistant isolates ≥ 100", value: nR, threshold: thresholds.minR, pass: nR >= thresholds.minR },
      { key: "min_S", label: "Susceptible isolates ≥ 100", value: nS, threshold: thresholds.minS, pass: nS >= thresholds.minS },
      { key: "min_bioprojects", label: "Source BioProjects ≥ 5", value: bioprojects.size, threshold: thresholds.minBioprojects, pass: bioprojects.size >= thresholds.minBioprojects },
    ];
    return {
      drug,
      nRows: dRows.length,
      nIsolates: new Set(dRows.map((r) => r.biosample)).size,
      nBioprojects: new Set(dRows.map((r) => r.bioproject)).size,
      standards: tally(dRows.map((r) => r.standards)),
      submitterPhenotypes: tally(dRows.map((r) => r.submitterPhenotypes)),
      labels: labelTally,
      nLabelledSR: nS + nR,
      nR,
      nS,
      nI,
      nCensored,
      dgChecks: checks,
      verdict: checks.every((c) => c.pass) ? "PASS" : "FAIL",
    };
  });

  return {
    tool: "lacuna",
    version: meta.version,
    notice: "RESEARCH USE ONLY. Not for clinical decision-making.",
    source: meta.source,
    nRows: rows.length,
    thresholds,
    drugs: perDrug,
    overallVerdict: perDrug.every((d) => d.verdict === "PASS") ? "PASS" : "FAIL",
  };
}

/** Parse a user-pasted AST table in the documented schema (TSV or CSV). */
export function parseUserAst(text: string): { rows: AstRow[]; errors: string[] } {
  const errors: string[] = [];
  const clean = text.trim();
  if (!clean) return { rows: [], errors: ["Empty input."] };
  const lines = clean.split(/\r?\n/);
  const sep = lines[0].includes("\t") ? "\t" : ",";
  const header = lines[0].split(sep).map((h) => h.trim());
  const need = ["biosample", "drug", "label_eucast"];
  for (const col of need) {
    if (!header.includes(col)) errors.push(`Missing required column "${col}". Expected schema: biosample, drug, label_eucast, bioproject, standards, submitter_phenotypes, year, country, source`);
  }
  if (errors.length) return { rows: [], errors };
  const i = (n: string) => header.indexOf(n);
  const rows: AstRow[] = [];
  for (let li = 1; li < lines.length; li++) {
    const cells = lines[li].split(sep);
    if (cells.length < 3) continue;
    const label = (cells[i("label_eucast")] ?? "").trim().toUpperCase();
    if (label && !["S", "R", "I", "INDETERMINATE_CENSORED"].includes(label)) {
      errors.push(`Line ${li + 1}: label_eucast "${label}" not in {S, R, I, INDETERMINATE_CENSORED}`);
      continue;
    }
    rows.push({
      biosample: (cells[i("biosample")] ?? `ROW_${li}`).trim(),
      drug: (cells[i("drug")] ?? "").trim(),
      labelEucast: label as AstRow["labelEucast"],
      nPrimaryRows: 1,
      primaryRows: "",
      submitterPhenotypes: i("submitter_phenotypes") >= 0 ? cells[i("submitter_phenotypes")] : "",
      standards: i("standards") >= 0 ? cells[i("standards")] : "",
      year: i("year") >= 0 ? cells[i("year")] : "",
      country: i("country") >= 0 ? cells[i("country")] : "",
      source: i("source") >= 0 ? cells[i("source")] : "",
      bioproject: i("bioproject") >= 0 ? cells[i("bioproject")] : "",
      submitterOrg: "",
    });
  }
  if (rows.length === 0 && errors.length === 0) errors.push("No data rows found.");
  return { rows, errors };
}
