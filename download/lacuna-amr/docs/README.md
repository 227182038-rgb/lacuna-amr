# LACUNA-AMR

An open-core, license-clean, locally run toolkit that **audits** genome-based antimicrobial-resistance (AMR) predictions, plus a paid audit-service layer built on it. All outputs are **research use only (RUO)**; no clinical claims.

> Pilot-scale results in this repository were produced on a 2-core/4 GB machine within a single session on a capped, phenotype-blind random cohort (N=240 E. coli isolates from public NCBI records). They are labelled EXPLORATORY throughout. The full-scale run is specified in `protocol/PROTOCOL.md` and its runbook, and is not executed here. See `FINAL_REPORT.md` and `protocol/DEVIATIONS.md`.

## What it does

- `lacuna audit-dataset` — label heterogeneity (methods, platforms, standards, submitter phenotypes), derived-label counts under a user-supplied breakpoint table, recommended evaluation protocol.
- `lacuna predict` — AMR determinants (AMRFinderPlus features), catalogue rule (M0), calibrated probabilities, Mondrian split-conformal prediction sets (R/S/abstain), explained/unexplained flags, nearest-training-genome distance, RUO notice.
- `lacuna validate` — re-run lineage-aware validation (S0/S1-style) on a client's labelled set, locally.
- `lacuna report` — HTML report from result files.
- `lacuna manifest` — code/data provenance manifest (SHA-256).

## Install

```bash
python -m venv .venv && . .venv/bin/activate
pip install .            # package + CLI
pip install .[test]      # + pytest
pytest                   # runs tests using real verbatim NCBI record fixtures
```

AMRFinderPlus (public domain, NCBI) is an external dependency for feature generation: install it separately and run it with a frozen database version; `lacuna` consumes its TSV output. No network access is used at run time; `lacuna` never sends data anywhere.

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
