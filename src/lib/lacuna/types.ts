// LACUNA-AMR web console — shared domain types
// Mirrors the `lacuna` CLI domain (Apache-2.0, research use only).

export type Label = "S" | "R" | "I" | "INDETERMINATE_CENSORED";

export interface AstRow {
  biosample: string;
  drug: string;
  labelEucast: Label;
  nPrimaryRows: number;
  primaryRows: string;
  submitterPhenotypes: string;
  standards: string;
  year: string;
  country: string;
  source: string;
  bioproject: string;
  submitterOrg: string;
}

export interface FeatureMatrix {
  isolates: string[];
  features: string[];
  /** rows = isolates (index-aligned), cols = features */
  matrix: Uint8Array[];
}

export interface DedupInfo {
  biosample: string;
  dedupCluster: string;
  bioproject: string;
  action: string;
}

export interface DrugAuditResult {
  drug: string;
  nRows: number;
  nIsolates: number;
  nBioprojects: number;
  standards: Record<string, number>;
  submitterPhenotypes: Record<string, number>;
  labels: Record<string, number>;
  nLabelledSR: number;
  nR: number;
  nS: number;
  nI: number;
  nCensored: number;
  dgChecks: {
    key: "min_isolates" | "min_R" | "min_S" | "min_bioprojects";
    label: string;
    value: number;
    threshold: number;
    pass: boolean;
  }[];
  verdict: "PASS" | "FAIL";
}

export interface AuditOutput {
  tool: string;
  version: string;
  notice: string;
  source: string;
  nRows: number;
  thresholds: { minIsolates: number; minR: number; minS: number; minBioprojects: number };
  drugs: DrugAuditResult[];
  overallVerdict: "PASS" | "FAIL";
}

export interface ConformalQuantiles {
  marginal: number;
  mondrian: { "0": number; "1": number };
  alpha: number;
}

export interface FittedModel {
  modelType: "M1" | "M2";
  features: string[];
  nTrain: number;
  nCal: number;
  nCalR: number;
  nCalS: number;
  threshold: number;
  quantiles: ConformalQuantiles;
  trainAuroc: number | null;
  calAuroc: number | null;
  internals:
    | { kind: "logreg"; weights: number[]; bias: number; mean: number[]; scale: number[] }
    | { kind: "gbm"; stumps: { feature: number; threshold: number; leftVal: number; rightVal: number }[]; base: number; lr: number };
  calibrator: { a: number; b: number };
}

export interface DrugEngine {
  drug: string;
  labelCounts: { S: number; R: number; I: number; censored: number };
  m0Features: string[];
  features: string[];
  m1: FittedModel;
  m2: FittedModel;
  labelledIsolates: string[];
  trainIsolates: string[];
  calIsolates: string[];
}

export interface PredictionOutput {
  drug: string;
  isolate: string | null;
  determinants: string[];
  m0Call: "S" | "R";
  modelType: "M0" | "M1" | "M2";
  pS: number;
  pR: number;
  call: "S" | "R";
  conformalSetMondrian: "S" | "R" | "S+R" | "ABSTAIN";
  conformalSetMarginal: "S" | "R" | "S+R" | "ABSTAIN";
  threshold: number;
  quantiles: ConformalQuantiles;
  ruoNotice: string;
}
