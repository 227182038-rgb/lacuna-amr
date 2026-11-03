# PROTOCOL — LACUNA-AMR (PRE-REGISTRATION)

Status: FROZEN. Freeze time: recorded in `protocol/PROTOCOL.sha256` at hashing.
Hash chain: SHA-256 of this file is recorded in `protocol/PROTOCOL.sha256` and in `provenance/ledger.tsv`.
Any change after freeze goes to `protocol/DEVIATIONS.md` with reason and UTC time (rule R6).
This protocol is written BEFORE any cohort label (MIC value or S/R call) of any study isolate is
extracted, and BEFORE any model is trained. Numeric thresholds marked **[design choice]** are the
commissioner's/my design choices, not literature-derived.

## 1. Objectives

Build and evaluate a transparent, license-clean toolkit that audits genome-based AMR prediction on
public data, measuring (H1) cross-validation optimism under lineage/time/site shifts, (H2) the
effect of label provenance (submitter labels vs breakpoint-derived labels), (H3) conformal coverage
under shift, (H4) the unexplained-resistant fraction by drug, and (H5) masked-determinant
rediscovery (phase B). The project does not claim to solve these problems; it measures where a
reference pipeline works and where it fails.

## 2. Organism and drugs (census-driven, DG applied)

Census (2026-11-01, EUtils db=biosample, `results/tables/census*.tsv/json`; pools = all BioSamples
matching `antibiogram[filter] AND "<organism>"[Organism]`; eligibility fractions from systematic
samples of 250 records each, field-presence only):

| organism | pool | ciprofloxacin | meropenem | colistin | gentamicin | ceftazidime |
|---|---|---|---|---|---|---|
| K. pneumoniae | 2518 | ~524 | ~685 | ~554 | ~735 | ~604 |
| E. coli | 11126 | ~5786 | ~4406 | ~712 | ~7076 | ~3160 |
| A. baumannii | 1275 | ~388 | ~367 | ~398 | ~362 | ~332 |

(values = estimated number of pool records with a quantitative mg/L MIC on a non-automated,
non-gradient platform = "primary-rule" candidates; upper bounds before QC/dedup/assembly-linking.)

DG thresholds **[design choice]**: ≥800 primary-rule isolates with quantitative MIC; ≥100 R and
≥100 S under the frozen breakpoint after QC and dedup; ≥8 coarse lineages with ≥25 isolates each;
≥5 BioProjects. Drug order: ciprofloxacin, meropenem, colistin; reserves: gentamicin, ceftazidime.

Outcome: K. pneumoniae FAILS DG for all five drugs at census level (all < 800). Per the fallback
rule (brief §4.1), the census was repeated for Escherichia coli: ciprofloxacin, meropenem and
gentamicin PASS census-level DG; colistin FAILS (~712). A. baumannii FAILS all.
**Primary organism: Escherichia coli. Drugs: ciprofloxacin, meropenem, gentamicin.**
Final DG is re-evaluated after acquisition, QC and dedup (stage 3) on the acquired cohort and on
the full-pool scale; both outcomes are reported.

## 3. Session-scale execution cap **[design choice + environment constraint]**

Target hardware in the brief (8 cores/16 GB/300 GB) is unavailable: actual machine 2 cores, 4.1 GB
RAM, ~9.9 GB disk (see `logs/stage0_env.log`). Execution rules:
- A 50-genome pilot measures per-isolate wall-clock and memory (AMRFinderPlus + sketching).
- In-session cap: **N_CAP = 240 isolates** (target; adjusted only downward by measured throughput
  and disk), selected by seeded shuffle (seed 20261101) of the qualifying primary-rule candidate
  list, blind to phenotype beyond the presence of a qualifying MIC row for the target drug.
- All analyses at N_CAP scale are labelled **EXPLORATORY (session-scale pilot)** in every
  deliverable; the confirmatory full-scale run is specified by this protocol and its runbook but is
  not executed in this session. DG is expected to FAIL at N_CAP scale; this is a documented
  outcome, not a protocol violation.
- Cohort construction: for each drug independently, the analysis set = capped isolates having a
  qualifying quantitative MIC row for that drug. Isolates may contribute to more than one drug set.

## 4. Data sources and acquisition

- AST: NCBI BioSample records with antibiogram tables (E-utilities, ≤3 requests/s, UA string
  identifies the project). Raw XML snapshots + SHA-256 retained per batch.
- Genomes: the NCBI assembly linked to each BioSample, preferring RefSeq (GCF_) over GenBank
  (GCA_); no re-assembly, no raw reads. Link resolution via E-utilities; every unresolved link is
  logged with the reason. No raw assemblies are redistributed; accession lists and checksums only.
- Optional cross-check source (BV-BRC) only if terms permit; de-duplicate by BioSample accession.
  Not used in this session unless its terms are retrieved and recorded first.

## 5. Labels

- Breakpoint source: EUCAST clinical breakpoint tables **v16.1, valid from 2026-06-24**
  (xlsx sha256 `ee5709eb...f6bab73`, recorded in full in the ledger; extraction with exact source
  cells and independent second-extraction cross-check: `results/tables/breakpoints_eucast_v16_1.json`).
  E. coli uses the generic Enterobacterales rows: ciprofloxacin S≤0.25 / R>0.5 mg/L; meropenem
  S≤2 / R>8 mg/L; gentamicin S≤2 / R>2 mg/L (bracketed value 2, footnote 3).
- Primary label rule: quantitative mg/L measurement present; laboratory typing method (or platform)
  consistent with a dilution method; automated platforms (Vitek, Phoenix, MicroScan) and gradient
  strips excluded to sensitivity analyses. Platform-missing records with a dilution-family method
  are included in primary and flagged `platform_unspecified` (pre-registered sensitivity analysis
  S-a1 excludes them).
- Censoring: a censored MIC (sign <, ≤, >, ≥) straddling a breakpoint makes the record
  INDETERMINATE (excluded; counted and reported). Sign `=` is uncensored.
- S = MIC ≤ S-breakpoint; R = MIC > R-breakpoint; the intermediate zone (above S, at or below R)
  is excluded from the primary analysis; sensitivity analysis S-a2 defines non-susceptible = I + R.
- Submitter-supplied phenotype strings are retained verbatim for the H2 ablation.
- Statement carried in all deliverables: re-interpreting historical MICs with the current (v16.1)
  breakpoint yields an ANALYSIS LABEL, not the clinical call made at the time of testing.
- Colistin broth-microdilution-only rule: recorded (EUCAST note 2 captured) and retained for
  completeness; colistin is not in the final drug set after DG.

## 6. Genome QC and de-duplication

- Fields from NCBI assembly records (names discovered from the actual esummary output at run time;
  expected: assembly length, contig count, N50, taxonomy check). Thresholds are frozen from the
  acquired assemblies' EMPIRICAL DISTRIBUTIONS before any phenotype join, by this rule
  **[design choice]**: exclude an assembly if total length < 4.0 Mbp or > 7.0 Mbp, contigs > 2000,
  or N50 < 10 kbp; then exclude length outliers beyond median ± 4×MAD if any exist at that point.
- De-duplication: sourmash (BSD-3; version pinned at install) sketches, k=31, scaled=1000,
  nucleotide. Pairwise distance matrix. Clonal-cluster threshold chosen from the empirical distance
  histogram (first local minimum / valley of the within-species distribution) BEFORE any phenotype
  join; if no clear valley exists, threshold = 0.01 mutations/bp **[design choice]**. At most 3
  isolates per (clonal cluster × BioProject) in the primary set, chosen by seeded (20261101)
  selection. Sensitivity analysis on the uncollapsed set.

## 7. Features and lineages

- AMRFinderPlus 4.2.7, database 2026-08-07.1 (frozen at session start; versions in ledger), run
  per assembly: `amrfinder --nucleotide <fna> --organism Escherichia --threads 2 --database
  <frozen DB>` with default identity/coverage (curated thresholds where defined). Output columns
  retained: contig id, start/stop, strand, gene symbol, sequence name, Element type/Subtype,
  Class, Subclass, Method, Target length, reference length, coverage, identity.
- Feature matrix: presence/absence per distinct (Element symbol or mutation) plus Subclass string
  features retained for M0 mapping. No feature is added after results are seen (R6).
- M0 catalogue rule (drug → Subclass/element keyword mapping, built ONLY from AMRFinderPlus's own
  output fields): ciprofloxacin → Subclass contains "fluoroquinolone" OR known E. coli
  fluoroquinolone point mutations (as reported by AMRFinderPlus organism mode); meropenem →
  Subclass contains "carbapenem" or "cephalosporin" (AMRFinderPlus labels some carbapenemases as
  cephalosporin-class; keyword list from observed Subclass values, documented in results and
  frozen at first use); gentamicin → Subclass contains "aminoglycoside". Unmappable elements are
  flagged and reported. The full mapping table is written to results before evaluation and frozen.
- Lineages: average-linkage hierarchical clustering of the sourmash distance matrix at two
  thresholds frozen BEFORE phenotype join: fine (target ~sequence-type-like; rule: empirical
  histogram valley, fallback 0.007 **[design choice]**) and coarse (target ~clonal-group-like;
  rule: valley, fallback 0.02 **[design choice]**) — the actual frozen values are those derived
  from the empirical histogram and recorded in results/lineages.json at freeze time, before any
  phenotype join. Lineages below minimum size (25 isolates) are merged into "OTHER" (never split).
  Sensitivity analysis at ±50% of each threshold.

## 8. Evaluation splits (per drug set)

- S0: stratified random 5-fold CV repeated 2× (optimism baseline).
- S1: leave-coarse-lineage-out grouped CV.
- S2: forward-time split by collection year: test = most recent years with ≥20% of isolates and
  ≥50 R and ≥50 S; declared infeasible if >30% of isolates lack a year.
- S3: leave-BioProject-cluster-out (BioProjects grouped by linked submitter/center where
  available).
- In every split: no isolate and no clonal cluster (§6) on both sides; enforced by assertion tests
  (gate G3). Test lists are hashed before any modelling and opened once per evaluation (R7 log).

## 9. Models

- M0: catalogue rule (§7 mapping); no training.
- M1: L2 logistic regression on the presence/absence matrix; grid C ∈ {0.01, 0.1, 1, 10}
  **[design choice]**; class weights balanced; max_iter 5000.
- M2: gradient-boosted trees (sklearn HistGradientBoostingClassifier); grid: max_depth ∈ {3, 6},
  learning_rate ∈ {0.05, 0.1}, max_iter fixed 300, early stopping off **[design choice]**;
  class weights via sample_weight.
- Tuning: nested grouped (coarse lineage) 3-fold inner CV inside training folds only, score =
  AUROC; seeds: 20261101 and 42 (both reported; tolerance for reproduction 0.01 AUROC **[design
  choice]**).
- Calibration: sigmoid (Platt) if the calibration partition has <200 isolates in either class,
  else isotonic **[design choice]**; fitted on a lineage-disjoint calibration split where possible.
- Conformal: split-conformal on the calibrated scores; Mondrian (class-conditional) and marginal
  variants; target coverage 0.90 (α=0.10) **[design choice]**.

## 10. Metrics

- Discrimination: AUROC, AUPRC (R = positive).
- Threshold metrics at a threshold chosen on training data (Youden index on training predictions,
  frozen before test evaluation): CA, VME = P(predicted S | observed R), ME = P(predicted R |
  observed S), denominators stated.
- Calibration: Brier score, expected calibration error (10 equal-width bins **[design choice]**),
  reliability plots.
- Conformal: empirical coverage overall, per class, per held-out unit; mean prediction-set size;
  abstention rate; fraction of held-out units with class-conditional coverage < 0.85.
- Selective prediction: risk–coverage curves; VME among non-abstained.
- All point estimates with 95% CIs from cluster bootstrap (resample coarse lineages with
  replacement; 2000 replicates, seed 20261101) **[design choice]**.
- Multiplicity: H3 primary family (per split, BH across splits); H1/H2/H4 reported with
  unadjusted CIs and labelled exploratory at pilot scale; no post-hoc threshold changes (R5).

## 11. Pre-registered hypotheses (two-sided; all reported, including nulls)

- H1 (optimism): performance (AUROC, VME, ME) under S1, S2, S3 differs from S0; effect sizes and
  directions with paired cluster-bootstrap CIs (paired at isolate level).
- H2 (labels): on the same isolates, submitter-supplied labels vs EUCAST-v16.1-derived labels
  change VME/ME by ≥2 percentage points **[design choice]** for at least one drug; report either
  way with CIs; cite prior relabelling work honestly (prior_art.md §3.2).
- H3 (coverage under shift): fraction of held-out units (lineages S1, year blocks S2, BioProject
  clusters S3; units with ≥30 test isolates) with realised class-conditional coverage < 0.85 is
  larger under S1/S2/S3 than under S0 on the same isolates. Exploratory: whether dataset-level
  diagnostics (clonality index, lineage-phenotype mutual information, explained fraction, source
  heterogeneity, nearest-training-genome distance) predict per-unit coverage shortfall better than
  AUROC does; whether nearest-training distance works as an abstention score.
- H4 (explainability): the fraction of resistant isolates with no M0-relevant element differs
  among the three drugs (point estimates with CIs; expectation ciprofloxacin lowest — an
  expectation, not a claim).
- H5 (rediscovery, phase B): a pre-registered association pipeline recovers masked known
  determinants above a permutation-based null; recall as counts with exact (Clopper-Pearson) CIs;
  no success threshold set.

## 12. Phase B (unexplained-resistance module; gated on G5)

Attempt only after G5 passes; if compute/time is infeasible, document why and keep phase B claims
out of the manuscript. Definitions and steps:
- "Unexplained resistant" = observed R with no M0-relevant element.
- Association: pyseer linear mixed model with population structure from the sourmash distance
  matrix (as kinship via a UPGMA Newick tree built from it); features: AMRFinderPlus-element
  presence/absence (acquired-gene determinants); unitigs only if feasible on this machine
  (2 cores/4 GB) — otherwise the rediscovery benchmark is restricted to acquired-gene determinants
  and this is stated.
- Known determinants as covariates (conditional analysis).
- Significance: pyseer's documented multiple-testing approach (FDR, from its documentation) plus
  permutation of real labels within lineage strata (≥50 permutations, seed 20261101) to calibrate
  false discoveries; genomic inflation factor and QQ plots saved.
- Rediscovery benchmark: for the most prevalent known determinants per drug (top 10 by carrier
  count **[design choice]**): remove their features, re-run, record whether the locus or a linked
  element is recovered (recovery = association at the masked locus or a co-occurring element with
  r > 0.8 linkage **[design choice]**).
- Replication: discover on training lineages, replicate on held-out lineages with a pre-specified
  rule (same-direction effect and FDR-significant in held-out **[design choice]**).
- Annotation: RefSeq/PGAP product names; Swiss-Prot similarity only if its license is verified at
  download. PubMed/Europe PMC queries saved per candidate; each labelled "previously reported
  (PMIDs)" or "no prior report found by these queries on date D". Candidates are computational
  hypotheses, never mechanisms.

## 13. Integrity, licensing, safety

- R1–R10 of the project brief apply in full; see brief (authoritative) and `provenance/ledger.tsv`.
- License posture (from `provenance/license_audit.tsv` + captured texts): AMRFinderPlus public
  domain; pyseer Apache-2.0; sourmash BSD-3; sklearn/numpy/scipy/pandas/matplotlib/openpyxl
  permissive; Biopython permissive custom dual license; CARD/RGI EXCLUDED (commercial license
  required); CLSI M100 EXCLUDED (paid standard); EUCAST tables used as reference input, never
  bundled; product never ships third-party raw assemblies.
- Safety: public de-identified isolates; only organism, collection year, country, source category,
  submitter and BioProject stored; no re-identification; no wet-lab instructions; outputs are
  research use only (RUO); no clinical claims.

## 14. Environment

Python 3.12.16; numpy 2.1.3, scipy 1.14.1, scikit-learn 1.5.2, pandas 2.2.3, matplotlib 3.9.2,
statsmodels 0.14.5, openpyxl 3.1.5, biopython 1.86 (site-packages METADATA hashes in ledger);
AMRFinderPlus 4.2.7 + DB 2026-08-07.1; BLAST+ 2.17.0; HMMER 3.4; sourmash version pinned at
install (recorded in ledger). Deterministic seeds: 20261101 (primary), 42 (reproduction).
CPU ≤ 2 threads; RAM target ≤ 3.2 GB; ≥ 2.0 GB disk headroom maintained.

## 15. Frozen analysis order

1. Acquire capped cohort (§3) → QC + dedup (§6) → final DG evaluation.
2. Gate G2 (label integrity: 25 random isolates recomputed independently from raw XML).
3. Features (§7) → lineages frozen → splits built + sealed (G3).
4. M0 sanity (G4) → M1/M2 + calibration + conformal (G5, G6).
5. Metrics + hypotheses (§10–11) → results files (numbers injected by template scripts only, R3).
6. Phase B (§12) if G5 passes (G7).
7. Product, service documents, manuscript (checklists DOME, TRIPOD+AI; FAIR4RS statement).
8. Reproducibility (G8), verification (G9), product gate (G10), red-team (G11).
