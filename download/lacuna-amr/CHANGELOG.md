# Changelog

All notable changes to this project are documented here. Semantic versioning.

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
