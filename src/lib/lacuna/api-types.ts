// Client-safe API response types (no server imports).

export type Verdict = "PASS" | "FAIL" | "NOT ATTEMPTED";

export interface OverviewResponse {
  project: {
    name: string;
    tagline: string;
    version: string;
    license: string;
    runDate: string;
    notice: string;
    pilotScale: boolean;
    organism: string;
    drugs: string[];
  };
  attrition: { stage: string; n: number }[];
  labelCounts: Record<string, Record<string, number>>;
  analysisSets: Record<string, { n: number; nR: number; nS: number }>;
  cohort: {
    n: number;
    nBioprojects: number;
    nDedupClusters: number;
    nCoarseLineages: number;
    distanceMetric: string;
    thresholds: { dedup: number; fine: number; coarse: number };
    distanceStats: { median: number; p5: number; p25: number; p75: number };
    coarseSizes: Record<string, number>;
    nDropped: number;
    frozenBeforePhenotypeJoin: boolean;
  };
  features: { nIsolates: number; nGenes: number };
  gates: { tally: Record<string, number>; entries: { id: string; verdict: Verdict; title: string }[] };
  headline: { drug: string; aurocM1: number | null; aurocCi: [number, number] | null; nR: number; n: number }[];
  breakpoints: {
    version: string;
    sourceUrl: string;
    sourceSha256: string;
    citation: string;
    organismScope: string;
    rows: Record<string, { rowLabel?: string; sLe?: string; rGt?: string }>;
  };
}

export interface DgCheck {
  key: string;
  label: string;
  value: number;
  threshold: number;
  pass: boolean;
}

export interface DrugAudit {
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
  dgChecks: DgCheck[];
  verdict: "PASS" | "FAIL";
}

export interface AuditResponse {
  audit: {
    tool: string;
    version: string;
    notice: string;
    source: string;
    nRows: number;
    thresholds: { minIsolates: number; minR: number; minS: number; minBioprojects: number };
    drugs: DrugAudit[];
    overallVerdict: "PASS" | "FAIL";
  };
  savedRuns: { id: string; drug: string; verdict: string }[];
}

export interface AuditRunRecord {
  id: string;
  source: string;
  drug: string;
  verdict: string;
  nLabelled: number;
  summary: string;
  createdAt: string;
}

export interface EngineSummary {
  drug: string;
  labelCounts: { S: number; R: number; I: number; censored: number };
  nFeatures: number;
  m0Features: string[];
  m1: { nTrain: number; nCal: number; nCalR: number; nCalS: number; threshold: number; quantiles: Quantiles; trainAuroc: number | null; calAuroc: number | null };
  m2: { nTrain: number; nCal: number; nCalR: number; nCalS: number; threshold: number; quantiles: Quantiles; trainAuroc: number | null; calAuroc: number | null };
  nLabelled: number;
}

export interface Quantiles {
  marginal: number;
  mondrian: { "0": number; "1": number };
  alpha: number;
}

export interface Prediction {
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
  quantiles: Quantiles;
  ruoNotice: string;
}

export interface IsolateItem {
  biosample: string;
  bioproject: string;
  submitterOrg: string;
  coarseLineage: string;
  dedupCluster: string;
  label: string | null;
  nDeterminants: number;
  m0Determinants: string[];
  determinants?: string[];
}

export interface IsolatesResponse {
  drug: string;
  notice: string;
  total: number;
  returned: number;
  items: IsolateItem[];
}

export interface ResultsRow {
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
}

export interface H1Cell {
  n_common: number;
  AUROC_S0: number;
  AUROC_split: number;
  delta: number;
  delta_ci95: [number, number];
}

export interface ValidateResponse {
  notice: string;
  splitsManifest: { splits: Record<string, Record<string, string | null>>; sha256: Record<string, string>; sealed_utc: string; note: string };
  results: ResultsRow[];
  s0MeanCoverage: Record<string, Record<string, number>>;
  hypotheses: {
    H1: Record<string, Record<string, H1Cell | { n_common: number; note: string }>>;
    [k: string]: unknown;
  };
}

export interface SplitAuditResponse {
  audit: {
    drug: string;
    nSplitsChecked: number;
    isolateOverlaps: number;
    clusterOverlaps: number;
    problems: { split: string; detail: string }[];
    verdict: "PASS" | "FAIL";
    splitDescriptions: Record<string, string>;
  };
  runId: string | null;
}

export interface GatesResponse {
  gates: { id: string; title: string; verdict: Verdict; verdictRaw: string; evidence: string; filePath: string }[];
  deviations: { id: string; utc: string; deviation: string; reason: string; consequence: string }[];
}

export interface ManifestResponse {
  notice: string;
  reproduction: {
    command: string;
    seeds: { primary: number; reproduction: number };
    protocolSha256File: string;
    externalTools: { name: string; version?: string; db?: string; license?: string; role?: string }[];
    excludedTools: { name: string; reason: string }[];
  };
  splits: { sealedUtc: string; sha256: Record<string, string>; note: string };
  breakpointsProvenance: { version: string; sourceUrl: string; sourceSha256: string; citation: string; bundling: string };
  references: { refId: string; doi: string; resolves: string; crossrefOk: string; title: string; firstAuthor: string; year: string; venue: string; verdict: string }[];
  sbom: { spdxVersion: string; name: string; creationInfo?: { created: string; creators: string[] }; packages: { name: string; version?: string; license?: string }[] };
  pythonLock: string[];
  claimsLedger: { claimId: string; summary: string; resultKey: string }[];
}

export interface ServiceResponse {
  id: string;
  status: string;
  notice: string;
}

export interface ServiceRequestRecord {
  id: string;
  sku: string;
  name: string;
  org: string | null;
  isolates: number | null;
  status: string;
  createdAt: string;
}
