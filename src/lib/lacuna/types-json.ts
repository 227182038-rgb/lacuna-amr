// JSON shapes of the bundled pilot artifacts (structural subset used by the UI).

export interface Lineages {
  metric: string;
  n_genomes: number;
  thresholds: { dedup: number; fine: number; coarse: number };
  threshold_method: string;
  fallbacks: { dedup: number; fine: number; coarse: number };
  distance_stats: { median: number; p5: number; p25: number; p75: number };
  n_clusters: { dedup: number; fine: number; coarse: number };
  coarse_sizes: Record<string, number>;
  n_coarse_ge25: number;
  n_dedup_survivors: number;
  n_dropped: number;
  n_cohort: number;
  n_bioprojects: number;
  frozen_before_phenotype_join: boolean;
}

export interface M0Mapping {
  mapping_keywords: Record<string, string[]>;
  feature_sets: Record<string, string[]>;
  observed_subclasses: string[];
}

export interface LabelsSummary {
  label_counts: Record<string, number>;
  qc: { pass: number };
  n_downloaded: number;
}

export interface CensusEligibility {
  sample_size: number;
  pool_size: number;
  sampling: string;
  records_with_antibiogram_table: number;
  metadata_presence: Record<string, number>;
  per_drug_counts: Record<string, Record<string, number>>;
  platform_distribution: Record<string, number>;
  standard_distribution: Record<string, number>;
  method_distribution: Record<string, number>;
  note: string;
  retrieved_utc: string;
}

export interface BreakpointsFile {
  source_file: string;
  source_sha256: string;
  source_url: string;
  version: string;
  document_title: string;
  citation_statement: string;
  organism_scope: string;
  breakpoints: Record<
    string,
    {
      row_label: string;
      source_cells: { label: string; S_le: string; R_gt: string; notes: string };
      S_le_mg_L: string;
      R_gt_mg_L: string;
      notes: string;
    }
  >;
  cross_check: { method: string; mismatches: string[] };
  retrieved_utc: string;
}

export interface SplitsManifest {
  splits: Record<string, Record<string, string | null>>;
  sha256: Record<string, string>;
  sealed_utc: string;
  note: string;
}

export interface DrugSplits {
  S0: { rep0: string[][]; rep1: string[][] };
  S1: Record<string, string[]>;
  S2: { test_years: number[]; test: string[]; train: string[]; S2_note?: string } | null;
  S3: Record<string, string[]>;
}

export interface ModelResult {
  metrics: {
    AUROC: number;
    AUPRC?: number;
    Brier?: number;
    ECE?: number;
    CA?: number;
    VME?: number;
    ME?: number;
    n_R?: number;
    n_S?: number;
  };
  ci95?: Record<string, [number, number]>;
  conformal_mondrian?: {
    coverage_overall: number;
    coverage_R: number;
    coverage_S: number;
    mean_set_size: number;
    abstention: number;
    VME_nonabstained?: number;
  };
  threshold?: number;
  sets_marginal?: unknown;
}

export interface FoldData {
  M0?: ModelResult;
  M1?: ModelResult;
  M2?: ModelResult;
}

export interface MainResults {
  [drug: string]: {
    S0?: FoldData[];
    S1?: Record<string, FoldData>;
    S2?: Record<string, FoldData> | null;
    S3?: Record<string, FoldData>;
    S0_mean_coverage?: Record<string, number>;
  };
}

export interface Hypotheses {
  H1: Record<string, Record<string, { n_common: number; AUROC_S0: number; AUROC_split: number; delta: number; delta_ci95: [number, number] } | { n_common: number; note: string }>>;
  H2?: Record<string, unknown>;
  H3?: Record<string, unknown>;
  H4?: Record<string, unknown>;
}

export interface Sbom {
  spdxVersion: string;
  name: string;
  packages?: { name: string; versionInfo?: string; licenseConcluded?: string }[];
  creationInfo?: { created: string; creators: string[] };
}
