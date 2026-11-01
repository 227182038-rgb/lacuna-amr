# Changelog

All notable changes to this project are documented here. Semantic versioning.

## [0.2.0] — 2026-11-01
### Added
- Modular package layout (`lacuna.breakpoints/ast/features/splits/metrics/conformal/models/
  pipeline/offline/licensing/manifest/report/sbom-free CLI`) with the 0.1 public API preserved.
- `lacuna train`: fits M0/M1/M2 per drug with lineage-disjoint calibration carve-out and Mondrian
  conformal quantiles, and writes a versioned model artefact (`lacuna-model/1`) with SHA-256
  payload integrity, sklearn/numpy version guards (fail-closed; `--allow-version-mismatch`
  escape hatch) and stored lineage/cluster metadata.
- `lacuna predict` now emits calibrated probabilities, Youden-thresholded calls and Mondrian
  conformal sets from the artefact's stored models (previously catalogue-only).
- `lacuna validate`: full S0-S3 evaluation engine with cluster-bootstrap 95% CIs, per-split
  coverage, catalogue sanity, split-leakage audit, auto-generated clone-aware splits when no
  sealed splits are supplied, and human-readable summaries. Reproduces the frozen research
  evaluation fold-for-fold (S0 M1 AUROC lists identical for all three drugs).
- Clone-aware S0: auto-generated random folds assign whole dedup clusters, so clonal clusters
  cannot straddle train/test (the sealed pilot splits did — gate G3, corrected reporting D-019).
- Offline enforcement by default: a socket guard blocks any network use unless `--allow-network`.
- `lacuna license-check`: environment + bundled-artifact licence guards with the full inventory.
- `lacuna manifest --sbom`: SPDX 2.3 SBOM generated from the installed environment.
- Self-contained HTML/Markdown reports (inline CSS, no JS, no external assets) with
  auto-detected sections for audits, artefacts, predictions and validation results.
- `--allow-version-mismatch` on predict/validate; documented schemas enforced fail-closed on
  every input (breakpoints, AST table, labels, features, cohort, splits).
- 52 new tests (60 total): artefact tamper/version guards, offline guard, licence guards,
  conformal coverage simulation, split generation, fail-closed schemas, pipeline alignment
  regression, and an end-to-end CLI integration test on the real pilot cohort.
- `examples/cli-demo/`: full command-by-command demo on the real cohort with all outputs.
### Fixed
- Youden threshold clamped to [0,1] (sklearn can return +inf on degenerate scores).
- Artefact default model prefers M1 (reference model) over M2 when both are trained.
- Evaluation-engine row alignment (sorted matrix rows vs unsorted label vectors) and
  grouped-CV group-key dtype (numeric lineages as ints) — required for exact reproduction
  of the recorded research results (D-020); regression tests added.
- README no longer claims a nearest-training-genome distance output (was never implemented).
### Changed
- Release archives no longer redistribute the EUCAST xlsx or provenance snapshots (licence
  posture; D-021). The working repository retains both with ledger hashes.

## [0.1.0] — 2026-11-01
### Added
- Core library: BioSample antibiogram parsing (verbatim NCBI efetch schema), EUCAST-style label
  derivation with censored-interval semantics, AST row classification (primary-rule vs
  excluded-platform), AMRFinderPlus feature extraction, M0 catalogue mapping, lineage-aware splits
  with leakage assertions, CA/VME/ME metrics, Mondrian + marginal split-conformal sets.
- CLI: `audit-dataset`, `predict`, `validate`, `report`, `manifest`.
- Tests on verbatim real-record fixtures (checksummed fixture manifest).
- Research pipeline scripts (workflow/), frozen protocol, provenance ledger, pilot-scale results
  (EXPLORATORY; see FINAL_REPORT.md), manuscript and service documentation.
