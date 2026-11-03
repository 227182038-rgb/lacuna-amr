import { NextResponse } from "next/server";
import {
  DRUGS,
  loadAstTable,
  loadBreakpoints,
  loadCohortTable,
  loadFeatures,
  loadLineages,
  loadMainResults,
  RUO_NOTICE,
} from "@/lib/lacuna/data";
import { loadGates } from "@/lib/lacuna/gates";

export const dynamic = "force-dynamic";

export async function GET() {
  const ast = loadAstTable();
  const cohort = loadCohortTable();
  const features = loadFeatures();
  const lineages = loadLineages();
  const gates = loadGates();
  const main = loadMainResults();
  const breakpoints = loadBreakpoints();

  // Label counts per drug from the AST table (all downloaded isolates)
  const labelCounts: Record<string, Record<string, number>> = {};
  for (const drug of new Set(ast.rows.map((r) => r.drug))) {
    labelCounts[drug] = { S: 0, R: 0, I: 0, INDETERMINATE_CENSORED: 0 };
  }
  for (const r of ast.rows) {
    if (!(r.drug in labelCounts)) labelCounts[r.drug] = { S: 0, R: 0, I: 0, INDETERMINATE_CENSORED: 0 };
    labelCounts[r.drug][r.labelEucast] = (labelCounts[r.drug][r.labelEucast] ?? 0) + 1;
  }

  // Analysis sets: cohort isolates present in features with S/R label
  const fmIsolates = new Set(features.isolates);
  const analysisSets: Record<string, { n: number; nR: number; nS: number }> = {};
  for (const drug of DRUGS) {
    let n = 0;
    let nR = 0;
    for (const r of ast.rows) {
      if (r.drug !== drug || !fmIsolates.has(r.biosample)) continue;
      if (r.labelEucast === "S") n++;
      else if (r.labelEucast === "R") {
        n++;
        nR++;
      }
    }
    analysisSets[drug] = { n, nR, nS: n - nR };
  }

  const bioprojects = new Set(cohort.map((c) => c.bioproject));
  const clusters = new Set(cohort.map((c) => c.dedupCluster));
  const coarseLineages = new Set(cohort.map((c) => c.coarseLineage));

  const gateTally = { PASS: 0, FAIL: 0, "NOT ATTEMPTED": 0 } as Record<string, number>;
  for (const g of gates) gateTally[g.verdict] = (gateTally[g.verdict] ?? 0) + 1;

  const headline = DRUGS.map((drug) => {
    // mean AUROC across the 10 S0 folds (2 reps × 5 folds), as recorded in the summary
    const folds = main[drug]?.S0 ?? [];
    const aurocs: number[] = [];
    let ci: [number, number] | null = null;
    for (const fold of folds) {
      const a = fold?.M1?.metrics?.AUROC;
      if (typeof a === "number" && Number.isFinite(a)) aurocs.push(a);
      const foldCi = fold?.M1?.ci95?.AUROC;
      if (foldCi) {
        ci = ci ? [Math.min(ci[0], foldCi[0]), Math.max(ci[1], foldCi[1])] : [foldCi[0], foldCi[1]];
      }
    }
    const aurocM1 = aurocs.length ? aurocs.reduce((a, b) => a + b, 0) / aurocs.length : null;
    return {
      drug,
      aurocM1,
      aurocCi: ci,
      nR: analysisSets[drug].nR,
      n: analysisSets[drug].n,
    };
  });

  return NextResponse.json({
    project: {
      name: "LACUNA-AMR",
      tagline: "Audited genome-based antimicrobial-resistance prediction",
      version: "0.2.0",
      license: "Apache-2.0 (code); AMRFinderPlus public domain; EUCAST tables user-supplied, never bundled",
      runDate: "2026-11-01",
      notice: RUO_NOTICE,
      pilotScale: true,
      organism: "Escherichia coli",
      drugs: DRUGS,
    },
    attrition: [
      { stage: "Antibiogram BioSamples in pool", n: 11126 },
      { stage: "Qualifying (primary-rule MIC, phenotype-blind order)", n: 651 },
      { stage: "Assembly-linked", n: 633 },
      { stage: "Downloaded (session cap)", n: 450 },
      { stage: "Stats QC pass", n: 450 },
      { stage: "After clonal de-duplication (≤3 per cluster × BioProject)", n: 338 },
      { stage: "Frozen cohort (11 BioProjects)", n: 240 },
    ],
    labelCounts,
    analysisSets,
    cohort: {
      n: cohort.length,
      nBioprojects: bioprojects.size,
      nDedupClusters: clusters.size,
      nCoarseLineages: coarseLineages.size,
      distanceMetric: lineages.metric,
      thresholds: lineages.thresholds,
      distanceStats: lineages.distance_stats,
      coarseSizes: lineages.coarse_sizes,
      nDropped: lineages.n_dropped,
      frozenBeforePhenotypeJoin: lineages.frozen_before_phenotype_join,
    },
    features: { nIsolates: features.isolates.length, nGenes: features.features.length },
    gates: { tally: gateTally, entries: gates.map((g) => ({ id: g.id, verdict: g.verdict, title: g.title })) },
    headline,
    breakpoints: {
      version: breakpoints.version,
      sourceUrl: breakpoints.source_url,
      sourceSha256: breakpoints.source_sha256,
      citation: breakpoints.citation_statement,
      organismScope: breakpoints.organism_scope,
      rows: Object.fromEntries(
        DRUGS.map((d) => [
          d,
          {
            rowLabel: breakpoints.breakpoints[d]?.row_label,
            sLe: breakpoints.breakpoints[d]?.S_le_mg_L,
            rGt: breakpoints.breakpoints[d]?.R_gt_mg_L,
          },
        ])
      ),
    },
  });
}
