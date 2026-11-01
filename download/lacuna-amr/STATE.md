# LACUNA-AMR — STATE

Machine reality (probed 2026-11-01T08:00Z, see logs/stage0_env.log):
- 2 × Intel Xeon cores; 4.1 GiB RAM (no swap); 9.3 GiB free disk on /home/z; Debian 13; Python 3.12.16.
- Resource caps (80% rule): max 2 concurrent jobs, RAM target ≤ 3.2 GiB, always keep ≥ 2.0 GiB disk free.
- Network: EUtils, NCBI FTP, Crossref, PyPI, EUCAST, raw.githubusercontent.com OK. api.github.com rate-limited (403).
- Pre-installed: numpy, scipy, scikit-learn, pandas, matplotlib, openpyxl, biopython, statsmodels, joblib, pytest, pandoc, gcc.

## Stage status

| Stage | Status | Gate |
|---|---|---|
| 0 env+network probe | DONE | G0 PASS |
| 1a prior-art verification (14 refs + searches) | DONE | G1 PASS |
| 1b license audit | DONE | G0 PASS |
| 1c census (Kpn/Ecoli/Abaumannii) + EUCAST v16.1 breakpoints | DONE | G1 PASS |
| 2 protocol freeze (sha f54ac26a…) | DONE | G1 PASS |
| 3 acquisition (E. coli; drugs cipro/gent/ceftazidime after DG) | DONE | G2 PASS |
| 4 features (AMRFinderPlus 240 genomes) + lineages | DONE | G4 PASS |
| 5 splits S0-S3 sealed | DONE | G3 PASS |
| 6 models + calibration + conformal | DONE | G5 FAIL (documented), G6 PASS |
| 7 metrics + H1-H4 | DONE | — |
| 8 phase B | NOT ATTEMPTED (G5-gated, fail-closed) | G7 |
| 9 product package + tests + SBOM | DONE | G10 PASS |
| 10 service + commercial docs | DONE | — |
| 11 manuscript + figures + checklists + PDF | DONE | G9 PASS |
| 12 reproducibility + red-team + final report | DONE | G8 PASS, G11 PASS |

## Resume protocol
After interruption: read protocol/PROTOCOL.md, this file, provenance/ledger.tsv, then continue at "next command". Never repeat completed work: check logs/ and results/ first.

## Next command
None — session complete. See FINAL_REPORT.md. Full-scale run: snakemake -j 2 on adequate hardware.

## Cohort decision (G1)
Organism: Escherichia coli (K. pneumoniae failed DG; brief-mandated fallback). Drugs: ciprofloxacin,
meropenem, gentamicin. EUCAST v16.1 (valid 2026-06-24). N_CAP=240 session-scale pilot (D-001).

## Key decisions so far
- PyPI distribution name: `lacuna-amr` (checked 2026-11-01T08:01Z: `lacuna` taken, `lacuna-amr` 404=free). Import name `lacuna_amr`, CLI command `lacuna`.
- Session-scale genome cap will be set after the 50-genome pilot throughput measurement (brief §10); the 2-core/4 GB machine cannot process the full DG cohort in-session; any below-DG-scale execution will be labelled EXPLORATORY in all deliverables.
