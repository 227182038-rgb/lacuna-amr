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

## [0.3.0] — 2026-11-04
### Added (web console commercial layer — research use only)
- Market-research-backed commercial layer in the web console, built from cited demand
  signals (commercial/MARKET_RESEARCH.md; Grand View Research, Bosetti et al. 2025,
  Florensa et al. 2022, HL7 terminology, WHO GLASS, published pricing benchmarks —
  all retrieved 2026-11-04).
- Batch scoring queue (`POST/GET /api/batch`): whole labelled cohort per drug, staged
  chunk processing (20 isolates/poll, real computation per poll — D-026), aggregate QA
  (agreement with EUCAST labels, conformal set coverage, M0-vs-model agreement) and
  per-isolate PredictRun traceability.
- Hash-chained append-only audit trail (`AuditLog`; sha256(seq|prevHash|actor|action|
  detail|ts)) with one-click chain verifier and CSV export; wired into predict,
  audit-dataset, validate, service-request, batch, export and key actions (D-025).
- Interoperability exports: FHIR R4 Bundle of Observations (v3-ObservationInterpretation
  codes, no LOINC asserted — D-027); GLASS-style aggregate CSV with Wilson 95% CIs by
  drug/country (not an official WHO format — D-028); predictions CSV; audit-trail CSV.
- API keys (`/api/keys`): SHA-256-hashed, shown once, x-api-key auth on batch submissions
  with per-isolate credits (100 at issue) — D-029 documents the demo enforcement boundary.
- Console sections: Workflow (12-stage optimized pipeline map with live gate verdicts),
  Batch, Market (cited research + demand→feature matrix + sources), Compliance;
  Services gained benchmark-cited pricing tiers (not a price list — D-024).
### Deviations
- D-022…D-029 (protocol/DEVIATIONS.md): commercial-layer decisions, integrity handling of
  market figures and pricing, audit-chain design, batch processing model, export labelling,
  API-key boundary.
