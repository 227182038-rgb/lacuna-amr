# FINAL REPORT — LACUNA-AMR

Run: 2026-11-01 (single session, UTC). All numbers in this report come from the files cited
beside them. Plain language; no promotional claims.

## What was built

1. **Research pipeline + frozen pre-registration** (`protocol/PROTOCOL.md`, SHA-256 in
   `protocol/PROTOCOL.sha256`, frozen 2026-11-01T08:52:27Z before any cohort label extraction;
   17 time-stamped deviations in `protocol/DEVIATIONS.md`).
2. **Audit toolkit `lacuna`** (Apache-2.0; PyPI-safe name `lacuna-amr`; CLI: audit-dataset,
   predict, validate, report, manifest; tests on verbatim real-record fixtures; SBOM, model card,
   docs, CI file, lockfile; gate G10 PASS).
3. **Session-scale pilot study** on real public NCBI data (E. coli, 240-isolate phenotype-blind
   cohort; EUCAST v16.1 labels; AMRFinderPlus 4.2.7 / DB 2026-08-07.1 features), with hypotheses
   H1-H4 evaluated (H5 gated off), all results exploratory at pilot scale.
4. **Service + commercial layer** (3 SKUs with SOPs/QA/limitations, contract template for lawyer
   review; competitor table, customer-discovery plan, pricing formula with blank margins,
   regulatory memo with explicit UNVERIFIED items, risk register, data-protection checklist).
5. **Manuscript package** (paper/manuscript.md + PDF, 4 figures regenerated from results,
   DOME + TRIPOD+AI checklists, FAIR4RS statement, OSF-ready pre-registration, claims ledger).

## Gate table

| Gate | Verdict | Evidence |
|---|---|---|
| G0 environment + license audit | PASS | gates/G0.md; provenance/license_audit.tsv |
| G1 prior art + census + DG + protocol freeze | PASS | gates/G1.md; provenance/prior_art.md; results/tables/census* |
| G2 label integrity (25 isolates, independent recompute) | PASS (74/74) | gates/G2.md (checker-side XML-entity bug found and fixed by the gate) |
| G3 split integrity | PASS (zero isolate/cluster leakage) | gates/G3.md; results/splits/manifest.json |
| G4 catalogue sanity | PASS (carrier R-rates 0.36/0.97/0.79 vs 0.00/0.02/0.00) | gates/G4.md |
| G5 model integrity (seed reproduction) | **FAIL** (frozen 0.01 tolerance exceeded: gentamicin 0.0139, ceftazidime 0.0838; ciprofloxacin 0.0) | gates/G5.md |
| G6 conformal validity on S0 | PASS (means 0.900-1.000 vs 0.90 target; small-n quantile noise) | gates/G6.md |
| G7 phase B controls | NOT ATTEMPTED (blocked by G5, fail-closed) | gates/G7.md |
| G8 reproducibility (subset re-run) | PASS (labels/features/splits byte-identical; AMRFinderPlus not re-run, documented) | gates/G8.md |
| G9 manuscript verification | PASS (all numbers injected; 5 spot-checks pass) | gates/G9.md |
| G10 product | PASS (fresh venv install, 8/8 tests, real-data example, license inventory) | gates/G10.md |
| G11 red-team | PASS (10 numbers re-derived from raw files; initial checker artifact corrected and documented) | gates/G11.md |

**Documented FAIL consequences (stated in the manuscript):** G5 FAIL means pilot-scale M1/M2
results are seed-sensitive for gentamicin and ceftazidime and are reported as such; phase B
(H5) claims are absent from the manuscript; no confirmatory conclusions are drawn anywhere.

## Data attrition (real numbers)

E. coli pool 11,126 antibiogram BioSamples -> 651 qualifying (primary-rule MIC, seeded
phenotype-blind order) -> 633 assembly-linked -> 450 downloaded (session cap) -> 450 stats-QC
pass -> 338 after clonal de-duplication (<=3 per cluster x BioProject) -> **240 cohort**
(11 BioProjects). Labelled analysis sets: ciprofloxacin 178 (R 17), gentamicin 229 (R 34),
ceftazidime 59 (R 26). Meropenem failed the resistant-count data gate (6 R / 292 labelled among
downloaded; est. ~90 R in full pool < 100); K. pneumoniae failed the pool-size gate for all five
drugs (est. 524-735 < 800); colistin failed for both organisms (deviation D-006).

## Hypothesis outcomes (pilot scale, EXPLORATORY; CIs are cluster-bootstrap 95%)

- **H1 (optimism)**: gentamicin S1 delta AUROC -0.097 [-0.171, -0.016]; S3 -0.075 [-0.132,
  +0.091]; ciprofloxacin all deltas' CIs cross zero; ceftazidime unstable (S3 -0.304 [-0.438,
  +0.245]). (results/evaluation/hypotheses.json)
- **H2 (labels)**: EUCAST-derived vs submitter labels changed VME by -0.261 (ciprofloxacin),
  -0.117 (gentamicin), -0.163 (ceftazidime) — the >=2-point criterion was met for all three
  drugs. ME changes -0.013 to +0.087.
- **H3 (coverage under shift)**: R-class Mondrian coverage fell below 0.85 for specific held-out
  units while S0 on the same isolates stayed 0.86-1.00: ciprofloxacin S1 lineage 8: 0.43 (S0
  0.86); gentamicin S1 OTHER: 0.29 (S0 1.00); gentamicin S3 FDA project: 0.40 (S0 0.95);
  ceftazidime S1 lineage 8: 0.44 (S0 0.88). S0 overall coverage near-nominal (G6).
- **H4 (unexplained resistance)**: fractions with no M0-relevant determinant: ciprofloxacin
  0.000 [0, 0.195] (0/17), gentamicin 0.088 [0.019, 0.237] (3/34), ceftazidime 0.000 [0, 0.132]
  (0/26). CIs overlap; descriptive only.
- **H5 (rediscovery)**: not evaluated (G5 FAIL, fail-closed; phase B specified for full-scale run).

## License audit outcome

Permitted product path: AMRFinderPlus (public domain), pyseer (Apache-2.0), sourmash (BSD-3),
Python stack (BSD/MIT/PSF-family; Biopython dual permissive). Excluded: CARD/RGI (commercial
license + fee), CLSI M100 (paid standard). Reference-only, never bundled: EUCAST tables (free
reuse with citation). NCBI data: NCBI places no restrictions on use/distribution; per-record
submitter provenance retained; no raw third-party assemblies redistributed.
(provenance/license_audit.tsv + captured texts in provenance/licenses/)

## UNVERIFIED items

1. FDA susceptibility-criteria page content (bot-blocked, HTTP 401; only search snippets).
2. CLSI M52 exact acceptance criteria (paid standard) — therefore CA/VME/ME reported as
   descriptive metrics only, no regulatory pass/fail claims.
3. Current venue author guidelines (bot-blocked; D-017) — manuscript uses a conservative generic
   structure and must be reformatted before submission.
4. Market sizes, competitor pricing, customer quotes (none retrieved; none claimed).
5. Regulatory determinations for India (CDSCO), EU (MDR), US (FDA) — questions listed in
   commercial/REGULATORY_RISK.md; everything beyond retrieved pages is UNVERIFIED.

## Deviations

17 logged with timestamps in protocol/DEVIATIONS.md (hardware constraint D-001; PyPI rename
D-002; GitHub API rate-limit D-003; DG interpretation D-004/5; organism switch D-006;
platform-missing rule D-007; incidental raw-XML view D-008; multi-row conflict rule D-009;
download cap D-010; threshold translation D-011/015; label censoring correction D-013 (before
any downstream use); M0 column semantics D-016; venue guidelines D-017).

## Measured per-isolate cost (this machine: 2 cores, 4.1 GB RAM, Debian 13)

- AMRFinderPlus (nucleotide + organism point mutations, DB 2026-08-07.1): 126 s/genome on first
  run (includes warm-up), ~15.1 s/genome effective wall-clock at steady state with 2 parallel
  single-thread workers (240 genomes, 6 chunks, logs/).
- Download: NCBI assembly FASTA ~1.5 MB gz/genome; sourmash sketch+compare: <1 s/genome.
- Evaluation stages (features, splits, models, conformal, bootstraps): minutes per dataset.
These measurements (not guesses) feed the service costing formula (commercial/COMMERCIAL.md §5).

## Reproduction command

From the repository root: `snakemake -j 2` (or run the stage scripts in order:
`workflow/scripts/stage1*.py`, `stage3*.py`, `stage4_amrfinder.sh`, `stage5*.py`,
`stage6_models.py`, `stage7_hypotheses.py`, `make_figures.py`, `build_manuscript.py`).
Tool versions are pinned in the ledger (AMRFinderPlus 4.2.7 + DB 2026-08-07.1, BLAST+ 2.17.0,
HMMER 3.4, sourmash 4.9.4; Python stack in requirements.lock). Seeds: 20261101 (primary),
42 (reproduction). External tool binaries are not redistributed (.tools/ excluded from release).

## What a human must still do before submission or launch

1. Domain-expert review of AST label derivation and EUCAST breakpoint application (especially
   the censored-interval rules and the platform-missing inclusion rule, D-007/D-013).
2. Legal review: licenses (especially submitter-rights posture on GenBank records), the service
   contract template, and the open-core vs dual-licensing decision.
3. Regulatory consultation for India/EU/US using the question list in
   commercial/REGULATORY_RISK.md (all currently UNVERIFIED).
4. Trademark clearance for the product name in target jurisdictions (PyPI/GitHub collision
   checked in-run; trademark registers not searchable from this environment).
5. Security review of the service data-handling checklist (encryption-at-rest and access-control
   gaps are explicitly marked open).
6. Upload the pre-registration (paper/PREREGISTRATION.md) to OSF and archive the release bundle.
7. Retrieve current venue author guidelines and reformat the manuscript; complete the full
   27-item TRIPOD+AI checklist table at submission.
8. Execute the full-scale run (the protocol is written for it: uncapped cohort at DG scale on
   adequate hardware) before any non-pilot claim is made.
