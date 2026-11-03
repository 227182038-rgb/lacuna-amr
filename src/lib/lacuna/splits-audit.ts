// Split-leakage auditor — re-implements the G3 assertion suite: for every
// train/test boundary in the sealed S0-S3 splits, check isolate overlap and
// dedup-cluster overlap (whole clusters must not span the boundary).

import { loadCohortTable, loadSplits, type Drug } from "./data";

export interface LeakageProblem {
  split: string;
  detail: string;
}

export interface SplitAuditResult {
  drug: string;
  nSplitsChecked: number;
  isolateOverlaps: number;
  clusterOverlaps: number;
  problems: LeakageProblem[];
  verdict: "PASS" | "FAIL";
  splitDescriptions: Record<string, string>;
}

function clusterMap(): Map<string, string> {
  // Full assignment from the frozen cohort table (240 isolates); isolates not
  // in the cohort fall back to the dedup report (dropped isolates).
  const m = new Map<string, string>();
  for (const d of loadCohortTable()) m.set(d.biosample, d.dedupCluster);
  return m;
}

function overlapCount(a: Iterable<string>, b: Set<string>): number {
  let n = 0;
  for (const v of a) if (b.has(v)) n++;
  return n;
}

export function auditSplits(drug: Drug): SplitAuditResult {
  const splits = loadSplits(drug);
  const clusters = clusterMap();
  const problems: LeakageProblem[] = [];
  let isolateOverlaps = 0;
  let clusterOverlaps = 0;
  let nChecks = 0;
  const descriptions: Record<string, string> = {};

  const checkPair = (train: string[], test: string[], label: string) => {
    nChecks++;
    const testSet = new Set(test);
    const isoOverlap = overlapCount(train, testSet);
    if (isoOverlap > 0) {
      isolateOverlaps += isoOverlap;
      problems.push({ split: label, detail: `isolate overlap ${isoOverlap}` });
    }
    const trainClusters = new Set(train.map((b) => clusters.get(b) ?? b));
    const testClusters = new Set(test.map((b) => clusters.get(b) ?? b));
    let clOverlap = 0;
    for (const c of testClusters) if (trainClusters.has(c)) clOverlap++;
    if (clOverlap > 0) {
      clusterOverlaps += clOverlap;
      problems.push({ split: label, detail: `dedup-cluster overlap ${clOverlap}` });
    }
  };

  // S0: 5 folds × 2 reps — within each rep, fold i is test and the other 4 folds of
  // the SAME rep are train (reps are re-partitions of the same isolates)
  (["rep0", "rep1"] as const).forEach((rep) => {
    const repFolds = splits.S0[rep];
    repFolds.forEach((fold, i) => {
      const train = ([] as string[]).concat(...repFolds.filter((_, j) => j !== i));
      checkPair(train, fold, `S0[${rep} fold${i}]`);
    });
  });
  descriptions["S0"] = "5 folds × 2 reps, isolate-stratified";

  // S1: leave-one-lineage-out — group is test, rest train
  const s1Groups = Object.keys(splits.S1);
  for (const g of s1Groups) {
    const test = splits.S1[g];
    const train = ([] as string[]).concat(...s1Groups.filter((k) => k !== g).map((k) => splits.S1[k]));
    checkPair(train, test, `S1[${g}]`);
  }
  descriptions["S1"] = `${s1Groups.length} lineage groups: ${s1Groups.map((g) => `${g}=${splits.S1[g].length}`).join(", ")}`;

  // S2: temporal — test years vs train
  if (splits.S2) {
    checkPair(splits.S2.train, splits.S2.test, "S2");
    descriptions["S2"] = `test years ${JSON.stringify(splits.S2.test_years)} n=${splits.S2.test.length}`;
  } else {
    descriptions["S2"] = "infeasible at pilot scale";
  }

  // S3: leave-one-BioProject-out
  const s3Groups = Object.keys(splits.S3);
  for (const g of s3Groups) {
    const test = splits.S3[g];
    const train = ([] as string[]).concat(...s3Groups.filter((k) => k !== g).map((k) => splits.S3[k]));
    checkPair(train, test, `S3[${g}]`);
  }
  descriptions["S3"] = `${s3Groups.length} groups: ${s3Groups.map((g) => `${g}=${splits.S3[g].length}`).join(", ")}`;

  return {
    drug,
    nSplitsChecked: nChecks,
    isolateOverlaps,
    clusterOverlaps,
    problems,
    verdict: problems.length === 0 ? "PASS" : "FAIL",
    splitDescriptions: descriptions,
  };
}
