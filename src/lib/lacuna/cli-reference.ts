// CLI reference text shared by the console report route and the v1/MCP API
// surface (extracted verbatim in v0.4.0 so both stay in sync; the console
// route's response shape is unchanged).

export const CLI_REFERENCE = `# CLI reference (lacuna-amr v0.2.0)

Every command runs fully offline (a socket guard blocks network use unless
\`--allow-network\` is passed) and prints the research-use notice with its output.

## Global

    lacuna [--version] [--allow-network] [--quiet] <command> ...

## Commands

### audit-dataset — label heterogeneity + data-gate verdicts

    lacuna audit-dataset --ast AST.tsv --breakpoints BP.tsv \\
        [--drugs d1 d2] [--min-isolates 800 --min-R 100 --min-S 100 --min-bioprojects 5] \\
        [--out audit.json]

Reports per drug: methods/platforms/standards/phenotype/sign distributions, row
classes, EUCAST-derived label counts under the user's breakpoint table, and
PASS/FAIL verdicts against the data-gate thresholds actually used.

### train — fit per-drug models into a model artefact

    lacuna train --features features.tsv --labels LABELS.tsv --cohort cohort.tsv \\
        [--breakpoints BP.tsv | --label-column label_eucast] \\
        [--m0-mapping m0_mapping.json | --amrfinder reports...] \\
        [--drugs d1 d2] [--models M0 M1 M2] [--seed 20261101] \\
        [--calibration-fraction 0.2] --out model.json

M0 is the catalogue rule (no training); M1/M2 are tuned by inner grouped CV on
the training side of a lineage-disjoint calibration carve-out, calibrated
(sigmoid below 200/class in calibration, else isotonic), thresholded at the
Youden index, and Mondrian/marginal conformal quantiles are stored per drug.
The artefact (\`lacuna-model/1\`) is JSON with SHA-256 payload integrity and
sklearn/numpy version guards.

### predict — determinants + calibrated probability + conformal set

    lacuna predict --model model.json [--features features.tsv | --amrfinder reports...] \\
        [--isolate SAMN001 ...] [--model-type M1] [--out predictions.tsv]

Output TSV columns: \`biosample, drug, determinants, m0_call, model_type, p_S,
p_R, call, conformal_set (S/R/S+R/ABSTAIN), threshold\`.

### validate — S0–S3 engine with cluster-bootstrap CIs

    lacuna validate --features features.tsv --labels LABELS.tsv \\
        --cohort cohort.tsv --splits SPLITS.json [--models M1 M2] \\
        [--n-boot 2000] [--out validation.json]

Runs the full leakage-aware evaluation and audits supplied splits (isolate +
dedup-cluster overlap assertions on every train/test boundary).

### report / manifest / license-check

Self-contained HTML audit report; SBOM + environment manifest; license
compatibility guard for the product path.`;
