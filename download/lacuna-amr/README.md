# LACUNA-AMR

An open-core, license-clean, locally run toolkit that **audits** genome-based antimicrobial-resistance (AMR) predictions, plus a paid audit-service layer built on it. All outputs are **research use only (RUO)**; no clinical claims.

> Pilot-scale results in this repository were produced on a 2-core/4 GB machine within a single session on a capped, phenotype-blind random cohort (N=240 E. coli isolates from public NCBI records). They are labelled EXPLORATORY throughout. The full-scale run is specified in `protocol/PROTOCOL.md` and its runbook, and is not executed here. See `FINAL_REPORT.md` and `protocol/DEVIATIONS.md`.

## What it does (v0.2.0)

- `lacuna audit-dataset` — label heterogeneity (methods, platforms, standards, submitter phenotypes, censoring), derived-label counts under a user-supplied breakpoint table, and honest PASS/FAIL data-gate verdicts against the thresholds actually used.
- `lacuna train` — fits the catalogue rule (M0), calibrated logistic (M1) and gradient-boosted (M2) models per drug with lineage-disjoint calibration, Mondrian conformal quantiles, and stores everything in a checksummed, version-guarded model artefact.
- `lacuna predict` — per isolate and drug: AMR determinants (AMRFinderPlus features), catalogue call (M0), calibrated probabilities and thresholded call (M1/M2), and Mondrian split-conformal prediction sets (S / R / S+R / abstain). RUO notice in every output.
- `lacuna validate` — lineage-aware S0-S3 evaluation (random, leave-lineage-out, forward-time, leave-site-out) with cluster-bootstrap 95% CIs, conformal coverage per split, and a split-leakage audit that measures rather than assumes. Auto-generated S0 folds are clone-aware (whole dedup clusters assigned to folds); sealed splits are audited, never silently trusted.
- `lacuna report` — self-contained HTML/Markdown report (no JS, no external assets) from audit/artefact/prediction/validation outputs.
- `lacuna manifest` — SHA-256 provenance manifest; `--sbom` emits an SPDX 2.3 SBOM built from the installed environment.
- `lacuna license-check` — licence guards (no CARD/RGI in the environment, no breakpoint tables bundled in the package) plus the full third-party licence inventory.

A complete command-by-command run on the real pilot cohort lives in [`examples/cli-demo/`](examples/cli-demo/README.md) — including the exact fold-for-fold reproduction of the frozen research evaluation.

Every command runs fully offline: a socket guard blocks network use by default (`--allow-network` to disable; no command needs it).

## Install

```bash
python -m venv .venv && . .venv/bin/activate
pip install .            # package + CLI
pip install .[test]      # + pytest
pytest                   # runs tests using real verbatim NCBI record fixtures
```

AMRFinderPlus (public domain, NCBI) is an external dependency for feature generation: install it separately and run it with a frozen database version; `lacuna` consumes its TSV output (or a pre-built feature matrix). Model artefacts record the sklearn/numpy versions they were built with and refuse to load under a different environment unless you explicitly pass `--allow-version-mismatch`.

## Inputs (documented schemas)

1. Assemblies you already hold (never redistributed by this project).
2. An AST table (TSV): `biosample, drug, sign, measurement, unit, method, platform, standard, submitter_phenotype, year, country, bioproject`.
3. A user-supplied breakpoint table (TSV): `drug, organism_group, S_le_mg_L, R_gt_mg_L, source, version`. EUCAST tables are copyrighted by EUCAST (free reuse with citation, no resale) — you supply your own copy; nothing is bundled.

## License posture

Apache-2.0 for this code (see `NOTICE` and `provenance/license_audit.tsv` for the third-party inventory). Excluded by license: CARD/RGI data (commercial license required), CLSI M100 values (paid standard). NCBI assemblies/AST records: NCBI places no restrictions on use or distribution of its data; per-record submitter provenance is retained; raw third-party assemblies are never redistributed.

## Reproduce the research pipeline

See `workflow/` (stage scripts + Snakefile), `protocol/PROTOCOL.md` (frozen pre-registration), `provenance/ledger.tsv` (every retrieved artifact with SHA-256), `results/` (all numbers), `paper/` (manuscript, figures, checklists, claims ledger).

## Citation

See `CITATION.cff`. The AMR determinant detection underlying the features is AMRFinderPlus (Feldgarden et al. 2021, doi:10.1038/s41598-021-91456-0) — cite it and report its software and database versions in any derived work.
