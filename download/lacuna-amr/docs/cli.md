# CLI reference

Every command runs fully offline (a socket guard blocks network use unless
`--allow-network` is passed — no command needs it) and prints the research-use
notice with its output. Run `lacuna <command> --help` for all flags.

## Global

    lacuna [--version] [--allow-network] [--quiet] <command> ...

## Input schemas (documented, validated fail-closed)

- **AST table** (TSV): `biosample, drug, sign, measurement, unit, method, platform, standard, submitter_phenotype, year, country, bioproject`
- **Breakpoints** (TSV, user-supplied — EUCAST/CLSI values are never bundled):
  `drug, organism_group, S_le_mg_L, R_gt_mg_L, source, version`
- **Labels** (TSV): either pre-derived (`biosample, drug, label_eucast` or a
  column given by `--label-column`) or a raw AST table plus `--breakpoints`
- **Feature matrix** (TSV): `biosample` column + `gene:…`/`mut:…` columns
  (AMRFinderPlus presence/absence; or derive from reports via `--amrfinder`)
- **Cohort** (TSV): `biosample, bioproject, submitter_org, dedup_cluster, coarse_lineage`
- **Splits** (JSON): `{"S0": {"rep0": [[...]...x5], "rep1": ...}, "S1": {…}, "S2": {…}|null, "S3": {…}}`

## Commands

### audit-dataset — label heterogeneity + data-gate verdicts

    lacuna audit-dataset --ast AST.tsv --breakpoints BP.tsv \
        [--drugs d1 d2] [--min-isolates 800 --min-R 100 --min-S 100 --min-bioprojects 5] \
        [--out audit.json]

Reports per drug: methods/platforms/standards/phenotype/sign distributions,
row classes (primary_rule / excluded_platform / not_quantitative), EUCAST-derived
label counts under the user's breakpoint table, and PASS/FAIL verdicts against
the data-gate thresholds actually used (defaults are the full-scale protocol
gates — relax them explicitly for smaller client datasets).

### train — fit per-drug models into a model artefact

    lacuna train --features features.tsv --labels LABELS.tsv --cohort cohort.tsv \
        [--breakpoints BP.tsv | --label-column label_eucast] \
        [--m0-mapping m0_mapping.json | --amrfinder reports...] \
        [--drugs d1 d2] [--models M0 M1 M2] [--seed 20261101] \
        [--calibration-fraction 0.2] --out model.json

M0 is the catalogue rule (no training); M1/M2 are tuned by inner grouped CV on
the training side of a lineage-disjoint calibration carve-out, calibrated
(sigmoid below 200/class in calibration, else isotonic), thresholded at the
Youden index, and Mondrian/marginal conformal quantiles are stored per drug.
The artefact (`lacuna-model/1`) is JSON with SHA-256 payload integrity and
sklearn/numpy version guards.

### predict — determinants + calibrated probability + conformal set

    lacuna predict --model model.json [--features features.tsv | --amrfinder reports...] \
        [--isolate SAMN001 ...] [--model-type M1] [--out predictions.tsv] \
        [--allow-version-mismatch]

Output TSV columns: `biosample, drug, determinants, m0_call, model_type, p_S,
p_R, call, conformal_set (S/R/S+R/ABSTAIN), threshold`. Comment lines carry the
RUO notice and the artefact payload hash.

### validate — lineage-aware S0-S3 evaluation with cluster-bootstrap CIs

    lacuna validate --model model.json --features features.tsv --labels LABELS.tsv \
        [--splits results/splits | --cohort cohort.tsv] \
        [--drugs d1] [--models M0 M1] [--boot 200] [--seed 20261101] \
        [--out validation.json] [--predictions ...] [--summary ...]

Without `--splits`, protocol splits are auto-generated from the artefact's
stored metadata — **S0 folds are clone-aware** (whole dedup clusters are
assigned to folds, so clonal clusters cannot straddle train/test). With sealed
splits, the evaluation audits them instead of assuming them: `split_audit_problems`
reports any isolate/dedup-cluster overlap (this is how the pilot's G3 clonal
overlap was found and corrected — D-019/D-020). Test labels are opened exactly
once, for scoring.

### report — self-contained audit report

    lacuna report --inputs audit.json model.json predictions.tsv validation.json \
        [--title "..."] [--format html|md] --out report.html

No JavaScript, no external assets, no URLs: a single portable file with
auto-detected sections and the licence inventory.

### manifest — provenance + SBOM

    lacuna manifest --paths F1 F2 ... [--base .] --out manifest.tsv [--sbom sbom.spdx.json]

SHA-256 per file; the SPDX 2.3 SBOM is generated from the *installed*
environment (programmatic, no hand-typed versions).

### license-check — licence-compliance guards

    lacuna license-check [--root DIR]

Fails closed if a forbidden distribution (CARD/RGI) is importable, or if a
breakpoint-table-looking file ships inside the package; prints the full
third-party licence inventory.

## Exit codes

0 success · 2 input/schema/licence/artefact error (message on stderr).
