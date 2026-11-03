// Smoke test for the lacuna web engine — trains M1/M2 on the real cohort and
// prints headline metrics; run with `bunx tsx scripts/lacuna-smoke.ts` (or bun).
import { auditAstRows, DEFAULT_THRESHOLDS } from "../src/lib/lacuna/audit";
import { loadAstTable, loadFeatures, loadMainResults, DRUGS } from "../src/lib/lacuna/data";
import { engineSummary, predict } from "../src/lib/lacuna/engine";
import { auditSplits } from "../src/lib/lacuna/splits-audit";
import { auroc } from "../src/lib/lacuna/models";

const ast = loadAstTable();
console.log("AST rows:", ast.rows.length);

const audit = auditAstRows(ast.rows, DEFAULT_THRESHOLDS, { source: "cohort", version: "0.2.0" });
for (const d of audit.drugs) {
  console.log(`audit ${d.drug}: n=${d.nLabelledSR} S=${d.nS} R=${d.nR} verdict=${d.verdict}`);
}

const fm = loadFeatures();
console.log("features:", fm.isolates.length, "isolates ×", fm.features.length, "genes");

const recorded = loadMainResults();
for (const drug of DRUGS) {
  const sum = engineSummary(drug);
  const eng = (await import("../src/lib/lacuna/engine")).getDrugEngine(drug);
  // recompute S0-ish AUROC over all labelled rows using calibrated probs
  const rowsByIso = new Map(ast.rows.filter((r) => r.drug === drug).map((r) => [r.biosample, r]));
  const ys: number[] = [];
  const ps: number[] = [];
  const isoIndex = new Map(fm.isolates.map((iso, i) => [iso, i]));
  for (const iso of eng.labelledIsolates) {
    const r = rowsByIso.get(iso)!;
    ys.push(r.labelEucast === "R" ? 1 : 0);
    const row = fm.matrix[isoIndex.get(iso)!];
    // p from m1 via predict-like path
    const out = predict({ drug, isolate: iso, modelType: "M1" });
    if (!("error" in out)) ps.push(out.pR);
  }
  const aurocM1 = auroc(ys, ps);
  const recordedS0 = recorded[drug]?.S0?.[0]?.M1?.metrics?.AUROC;
  console.log(
    `${drug}: engine n=${sum.nLabelled} M1 trainAUROC=${eng.m1 ? "" : ""}${aurocM1.toFixed(3)} (in-sample-cal) vs recorded S0 M1 AUROC=${recordedS0?.toFixed(3) ?? "?"} | threshold=${eng.m1.threshold.toFixed(3)} quantiles={marg:${eng.m1.quantiles.marginal.toFixed(3)}, R:${eng.m1.quantiles.mondrian["1"].toFixed(3)}, S:${eng.m1.quantiles.mondrian["0"].toFixed(3)}}`
  );
  const p = predict({ drug, isolate: eng.labelledIsolates[0], modelType: "M1" });
  if (!("error" in p)) console.log(`  sample predict ${p.isolate}: pR=${p.pR.toFixed(3)} call=${p.call} set=${p.conformalSetMondrian} m0=${p.m0Call} determinants=${p.determinants.length}`);
}

for (const drug of DRUGS) {
  const res = auditSplits(drug);
  console.log(`split-audit ${drug}: checks=${res.nSplitsChecked} isolateOverlap=${res.isolateOverlaps} clusterOverlapProblems=${res.problems.length} verdict=${res.verdict}`);
}
