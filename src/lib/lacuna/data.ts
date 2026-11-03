// Server-side loaders for the bundled pilot artifacts (copied from the
// LACUNA-AMR research run of 2026-11-01). Every number shown in the web console
// is loaded from — or recomputed against — these real result files.

import fs from "fs";
import path from "path";
import type { AstRow, DedupInfo, FeatureMatrix, Label } from "./types";
import type { FoldData } from "./types-json";

export type { FoldData };

const DATA_DIR = path.join(process.cwd(), "data", "lacuna");

export const DRUGS = ["ciprofloxacin", "gentamicin", "ceftazidime"] as const;
export type Drug = (typeof DRUGS)[number];

export const RUO_NOTICE = "RESEARCH USE ONLY. Not for clinical decision-making.";

const cache = new Map<string, unknown>();

function cached<T>(key: string, fn: () => T): T {
  if (!cache.has(key)) cache.set(key, fn());
  return cache.get(key) as T;
}

export function readText(rel: string): string {
  return fs.readFileSync(path.join(DATA_DIR, rel), "utf8");
}

export function readJson<T>(rel: string): T {
  return cached(`json:${rel}`, () => JSON.parse(readText(rel)) as T);
}

/** Minimal TSV parser (handles trailing newline, keeps empty cells). */
export function parseTsv(text: string, maxRows = Infinity): { header: string[]; rows: string[][] } {
  const lines = text.split("\n").filter((l) => l.length > 0);
  if (lines.length === 0) return { header: [], rows: [] };
  const header = lines[0].split("\t");
  const rows: string[][] = [];
  for (let i = 1; i < lines.length && rows.length < maxRows; i++) {
    rows.push(lines[i].split("\t"));
  }
  return { header, rows };
}

// ---------------------------------------------------------------------------
// Cohort artifacts
// ---------------------------------------------------------------------------

export interface AstTable {
  header: string[];
  rows: AstRow[];
}

export function loadAstTable(): AstTable {
  return cached("ast", () => {
    const { header, rows } = parseTsv(readText("tables/ast_labels_all.tsv"));
    const idx = (name: string) => header.indexOf(name);
    const iBs = idx("biosample");
    const iDrug = idx("drug");
    const iLabel = idx("label_eucast");
    const parsed: AstRow[] = rows.map((r) => ({
      biosample: r[iBs],
      drug: r[iDrug],
      labelEucast: r[iLabel] as Label,
      nPrimaryRows: parseInt(r[idx("n_primary_rows")] ?? "0", 10) || 0,
      primaryRows: r[idx("primary_rows")] ?? "",
      submitterPhenotypes: r[idx("submitter_phenotypes")] ?? "",
      standards: r[idx("standards")] ?? "",
      year: r[idx("year")] ?? "",
      country: r[idx("country")] ?? "",
      source: r[idx("source")] ?? "",
      bioproject: r[idx("bioproject")] ?? "",
      submitterOrg: r[idx("submitter_org")] ?? "",
    }));
    return { header, rows: parsed };
  });
}

export function loadFeatures(): FeatureMatrix {
  return cached("features", () => {
    const { header, rows } = parseTsv(readText("features.tsv"));
    const features = header.slice(1); // first col = biosample
    const isolates: string[] = [];
    const matrix: Uint8Array[] = [];
    for (const r of rows) {
      isolates.push(r[0]);
      matrix.push(new Uint8Array(r.slice(1).map((v) => (v === "1" ? 1 : 0))));
    }
    return { isolates, features, matrix };
  });
}

export function loadDedup(): DedupInfo[] {
  return cached("dedup", () => {
    const { header, rows } = parseTsv(readText("tables/dedup_report.tsv"));
    const i = (n: string) => header.indexOf(n);
    return rows.map((r) => ({
      biosample: r[i("biosample")],
      dedupCluster: r[i("dedup_cluster")],
      bioproject: r[i("bioproject")],
      action: r[i("action")],
    }));
  });
}

export interface CohortRow {
  biosample: string;
  assembly: string;
  bioproject: string;
  submitterOrg: string;
  dedupCluster: string;
  fineLineage: string;
  coarseLineage: string;
}

/** The frozen 240-isolate cohort table (clusters + lineages + provenance). */
export function loadCohortTable(): CohortRow[] {
  return cached("cohort", () => {
    const { header, rows } = parseTsv(readText("tables/cohort.tsv"));
    const i = (n: string) => header.indexOf(n);
    return rows.map((r) => ({
      biosample: r[i("biosample")],
      assembly: r[i("assembly")],
      bioproject: r[i("bioproject")],
      submitterOrg: r[i("submitter_org")],
      dedupCluster: r[i("dedup_cluster")],
      fineLineage: r[i("fine_lineage")],
      coarseLineage: r[i("coarse_lineage")],
    }));
  });
}

export function loadLineages() {
  return readJson<import("./types-json").Lineages>("lineages.json");
}

export function loadM0Mapping() {
  return readJson<import("./types-json").M0Mapping>("m0_mapping.json");
}

export function loadLabelsSummary() {
  return readJson<import("./types-json").LabelsSummary>("tables/labels_summary.json");
}

export function loadCensus() {
  return readJson<import("./types-json").CensusEligibility>("tables/census_eligibility.json");
}

export function loadBreakpoints() {
  return readJson<import("./types-json").BreakpointsFile>("tables/breakpoints_eucast_v16_1.json");
}

export function loadSplitsManifest() {
  return readJson<import("./types-json").SplitsManifest>("splits/manifest.json");
}

export function loadSplits(drug: Drug) {
  return readJson<import("./types-json").DrugSplits>(`splits/${drug}.json`);
}

export function loadMainResults() {
  return readJson<import("./types-json").MainResults>("evaluation/main_results.json");
}

export function loadHypotheses() {
  return readJson<import("./types-json").Hypotheses>("evaluation/hypotheses.json");
}

export function loadGateFile(gate: string) {
  return readText(`gates/${gate}.md`);
}

export function loadDeviations() {
  return readText("DEVIATIONS.md");
}

export function loadFinalReport() {
  return readText("FINAL_REPORT.md");
}

export function loadModelCard() {
  return readText("MODEL_CARD.md");
}

export function loadReferenceVerification() {
  return parseTsv(readText("reference_verification.tsv"));
}

export function loadSbom() {
  return readJson<import("./types-json").Sbom>("sbom.spdx.json");
}

export function loadClaimsLedger() {
  return parseTsv(readText("claims_ledger.tsv"));
}

export function loadRequirementsLock() {
  return readText("requirements.lock");
}
