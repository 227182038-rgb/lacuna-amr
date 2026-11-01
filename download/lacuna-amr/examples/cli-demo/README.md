# CLI demo — `lacuna` v0.2.0 on the real pilot cohort

Every file in this directory was produced by the released CLI, fully offline,
on the **real** E. coli pilot cohort already in this repository (240 isolates,
11 BioProjects; AMRFinderPlus 4.2.7 features; EUCAST v16.1-derived labels).
Nothing here is synthetic. All outputs are **research use only** and
pilot-scale (EXPLORATORY) — no clinical claims.

## Commands (run from the repository root, package installed or `PYTHONPATH=src`)

```bash
# 1. Derive the flat raw AST table (real captured rows) used by the demo
python3 workflow/scripts/make_ast_table.py            # -> data/ast_table.tsv

# 2. Audit the labelled dataset (label heterogeneity + data-gate verdicts)
python -m lacuna audit-dataset --ast data/ast_table.tsv \
    --breakpoints examples/cli-demo/breakpoints.tsv --out examples/cli-demo/audit.json

# 3. Train the model artefact (M0 catalogue + M1 logistic + M2 boosting,
#    lineage-disjoint calibration, Mondrian conformal quantiles)
python -m lacuna train --features results/features.tsv \
    --labels results/tables/ast_labels_all.tsv --cohort data/cohort.tsv \
    --m0-mapping results/m0_mapping.json \
    --drugs ciprofloxacin gentamicin ceftazidime \
    --models M0 M1 M2 --seed 20261101 --out examples/cli-demo/model.json

# 4. Predict for the whole cohort (determinants, calibrated probabilities,
#    thresholded call, Mondrian conformal set)
python -m lacuna predict --model examples/cli-demo/model.json \
    --features results/features.tsv --out examples/cli-demo/predictions.tsv

# 5a. Validate against the SEALED research splits (audit, not assumption):
#     reports the clonal-cluster overlap those splits contain (gate G3 finding)
python -m lacuna validate --model examples/cli-demo/model.json \
    --features results/features.tsv --labels results/tables/ast_labels_all.tsv \
    --splits results/splits --drugs ciprofloxacin gentamicin ceftazidime \
    --models M0 M1 --boot 200 --out examples/cli-demo/validation_sealed.json

# 5b. Validate with v0.2.0 AUTO splits (clone-aware S0: whole dedup clusters
#     are assigned to folds)
python -m lacuna validate --model examples/cli-demo/model.json \
    --features results/features.tsv --labels results/tables/ast_labels_all.tsv \
    --drugs ciprofloxacin --models M0 M1 M2 --boot 200 \
    --out examples/cli-demo/validation_auto.json

# 6. Licence guards + provenance manifest + SPDX SBOM
python -m lacuna license-check
python -m lacuna manifest --paths <files> --base . \
    --out examples/cli-demo/manifest.tsv --sbom examples/cli-demo/sbom.spdx.json

# 7. Self-contained HTML report bundling the above
python -m lacuna report --inputs <outputs> --out examples/cli-demo/report.html
```

## What this demo run shows (computed, not asserted)

- **Exact reproduction.** `validation_sealed.json` reproduces the frozen
  research evaluation fold-for-fold: S0 M1 mean AUROC 0.980 (ciprofloxacin),
  0.9154 (gentamicin), 0.6526 (ceftazidime) — identical to
  `results/evaluation/main_results.json`.
- **The audit measures rather than assumes.** On the sealed pilot splits the
  audit reports clonal-cluster overlap across train/test in the
  isolate-stratified S0 folds and in S2/S3 (gate G3, FAIL — 15/18/15 problems;
  see D-019/D-020 and the manuscript's corrected statement).
- **v0.2.0 fixes it going forward.** With auto-generated splits, S0 assigns
  whole dedup clusters to folds: zero S0 leakage problems, S0 Mondrian
  coverage near-nominal (M1 0.906, M2 0.916 vs 0.90 target). S3 overlap
  remains and is reported: clones genuinely span origins in this cohort, which
  is the shift being measured.
- **Honest data gates.** `audit.json` verdicts are FAIL against the
  full-scale thresholds (e.g. meropenem 6 R / 292 labelled) — pass/fail
  follows the thresholds actually used, never a rubber stamp.
- **Degenerate models are visible, not hidden.** M2 at ceftazidime scale
  (n=59) collapses to a near-constant predictor (S0 AUROC 0.5, wide S+R
  conformal sets) — consistent with the research run and with gate G5's
  seed-sensitivity finding.

## Files

| File | Content |
|---|---|
| `breakpoints.tsv` | User-supplied EUCAST v16.1 breakpoint TSV (documented schema) |
| `audit.json` | Label heterogeneity + derived-label counts + data-gate verdicts |
| `model.json` | Model artefact (`lacuna-model/1`): per-drug M0 mappings, M1/M2 pickles (SHA-256-checksummed), thresholds, conformal quantiles, lineage metadata |
| `predictions.tsv` | 720 rows: 240 isolates x 3 drugs, determinants + probabilities + calls + conformal sets |
| `validation_sealed.json` / `*_predictions.tsv` / `*_summary.txt` | S0-S3 evaluation on the sealed research splits |
| `validation_auto.json` / ... | Same, on v0.2.0 clone-aware auto splits |
| `manifest.tsv`, `sbom.spdx.json` | SHA-256 provenance + SPDX 2.3 SBOM |
| `report.html` | Self-contained HTML audit report (no external assets, no JS) |
