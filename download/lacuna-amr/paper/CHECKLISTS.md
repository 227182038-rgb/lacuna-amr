# Checklists and statements (submission package)

## DOME checklist (Walsh et al. 2021, doi 10.1038/s41592-021-01205-4 — verified in run)

| DOME item | Status | Pointer |
|---|---|---|
| D: Data sources described; access + splits | Yes | Methods; protocol/PROTOCOL.md §2-4; data/manifest.tsv; results/splits/manifest.json |
| D: Data leakage prevention | Yes | gates/G3.md (assertion tests, sealed hashed test lists) |
| O: Optimisation: objective, tuning, calibration | Yes | Methods; protocol §9 (nested grouped tuning, Platt/isotonic rule) |
| M: Model specifications | Yes | protocol §9 (M0/M1/M2, grids, seeds, class weights); models/MODEL_CARD.md |
| M: Model availability | Yes | src/lacuna, models/pilot_model.json, SBOM |
| E: Evaluation metrics defined a priori | Yes | protocol §10; results/evaluation/ |
| E: Statistical inference | Yes | cluster bootstrap CIs (protocol §10); exploratory status of pilot stated |
| E: Reproducibility | Partial | G8 (subset re-run, deterministic hashes); full-scale rerun documented but not executed in-session (FINAL_REPORT) |
| E: External validation | Not applicable | no independent external dataset processed in-session; stated as limitation |

## TRIPOD+AI checklist (Collins et al. 2024, doi 10.1136/bmj-2023-078378 — verified in run)

Selected items with pointers (full 27-item list at submission; N/A items marked with reason):
- Title/abstract identifies AI prediction model: Yes (title; structured abstract).
- Background/objecive (items 1a-2): Yes (Introduction).
- Data sources (3a): Yes (Methods: NCBI BioSample/Assembly).
- Participants/handling (4a-5): Yes (cohort construction; QC; de-duplication; attrition Figure 1).
- Outcome definitions (6a-b): Yes (EUCAST v16.1 derivation; censored-interval semantics; counts).
- Predictors (7a-b): Yes (AMRFinderPlus elements/mutations; versions).
- Sample size (8): Exploratory pilot; DG thresholds and session cap documented (protocol §2-3).
- Missing data (9): Yes (indeterminate censored MICs; platform-missing sensitivity analysis).
- Model development (10a-13b): Yes (M0-M2; nested grouped tuning; calibration rule; seeds).
- Model performance (15-16): Yes (AUROC/AUPRC/CA/VME/ME/Brier/ECE + CIs; calibration Figure 3).
- Model updating (14): N/A — no updating attempted (pilot).
- Interpretability (not a TRIPOD+AI item but DOME-related): catalogue rule M0 provides element-level explanations.
- Uncertainty: conformal sets + abstention; coverage by split (H3).
- Limitations (19-20): Yes (explicit section).
- Availability (22, 24-25): Yes (Data and Code Availability; release bundle).
- Fairness/bias considerations (TRIPOD+AI additions): sampling bias across countries/BioProjects stated (Limitations item 2).
- Ethics (26-27): Yes (ethics statement; competing interests; AI-assistance statement).

## FAIR for research software statement (FAIR4RS; Barker et al. 2022, doi 10.1038/s41597-022-01710-x — verified in run)

- Findable: versioned release (0.1.0), CITATION.cff, codemeta.json, SBOM (sbom.spdx.json), descriptive README.
- Accessible: Apache-2.0 code in the release bundle; all data inputs accessible via recorded NCBI accessions; no restricted dependencies.
- Interoperable: standard TSV/JSON schemas documented (docs/schemas.md); SPDX SBOM; provenance ledger with SHA-256 per artifact.
- Reusable: frozen protocol, license audit, NOTICE, tests with real fixtures, seeded deterministic pipeline, Snakemake workflow + stage scripts, CHANGELOG, model card.

## Pre-registration statement

The analysis was pre-registered in `protocol/PROTOCOL.md` (frozen 2026-11-01T08:52:27Z, SHA-256
recorded in `protocol/PROTOCOL.sha256`) before any cohort label value was extracted or model
trained. Deviations are time-stamped in `protocol/DEVIATIONS.md` (D-001-D-017). An OSF-ready copy
of the pre-registration is `paper/PREREGISTRATION.md`.
