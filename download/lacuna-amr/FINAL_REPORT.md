# FINAL REPORT — LACUNA-AMR

Run: 2026-11-01 (single session, UTC). All numbers in this report come from the files cited
beside them. Plain language; no promotional claims.

## What was built

1. **Research pipeline + frozen pre-registration** (`protocol/PROTOCOL.md`, SHA-256 in
   `protocol/PROTOCOL.sha256`, frozen 2026-11-01T08:52:27Z before any cohort label extraction;
   17 time-stamped deviations in `protocol/DEVIATIONS.md`).
2. **Audit toolkit `lacuna`** (Apache-2.0; PyPI-safe name `lacuna-amr`; CLI: audit-dataset,
   train, predict, validate, report, manifest, license-check; v0.2.0 modular package with
   model-artefact integrity guards, offline socket guard, SBOM generation, self-contained HTML
   reports; 57 tests including an end-to-end run on the real pilot cohort; SBOM, model card,
   docs, CI file, lockfile; gate G10 PASS, re-run for v0.2.0).
3. **Session-scale pilot study** on real public NCBI data (E. coli, 240-isolate phenotype-blind
   cohort; EUCAST v16.1 labels; AMRFinderPlus 4.2.7 / DB 2026-08-07.1 features), with hypotheses
   H1-H4 evaluated (H5 gated off), all results exploratory at pilot scale.
4. **Service + commercial layer** (3 SKUs with SOPs/QA/limitations, contract template for lawyer
   review; competitor table, customer-discovery plan, pricing formula with blank margins,
   regulatory memo with explicit UNVERIFIED items, risk register, data-protection checklist).
5. **Manuscript package** (paper/manuscript.md + PDF, 4 figures regenerated from results,
   DOME + TRIPOD+AI checklists, FAIR4RS statement, OSF-ready pre-registration, claims ledger —
   G3 claims corrected and the PDF regenerated after the split-audit finding, D-019).

## Product v0.2.0 — "fully functional application" hardening (same session, evidence in gates/G10.md)

- Modular package (13 modules) with the 0.1 API preserved; new `train` command and artefact
  system (`lacuna-model/1`: checksummed, version-guarded, fail-closed); `predict` now emits
  calibrated probabilities + Mondrian conformal sets from stored models; `validate` runs the
  full S0-S3 engine with cluster-bootstrap CIs and audits supplied splits; offline socket guard
  and licence guards enforced by default; SPDX 2.3 SBOM generated programmatically;
  self-contained HTML reports; 60 tests incl. an end-to-end CLI run on the real cohort.
- **Exact reproduction verified**: `lacuna validate` on the sealed splits reproduces
  results/evaluation/main_results.json fold-for-fold (S0 M1 AUROC identical for all three
  drugs). Two engine defects were found and fixed by that comparison before release (row
  alignment; grouped-CV group-key dtype — D-020).
- **Integrity finding corrected (D-019)**: the summary documents had mis-reported gate G3 as
  PASS; the gate file records clonal-cluster overlap in the isolate-stratified S0 and in S2/S3
  (15/18/15 problems; zero isolate overlap; S1 clean). FINAL_REPORT, STATE, CHECKLISTS and the
  manuscript (+PDF, claims ledger) were corrected; v0.2.0 auto-splits are clone-aware.
- **Release hygiene (D-021)**: the 0.2.0 archive no longer redistributes the EUCAST xlsx or
  the raw-XML snapshots (the 0.1.0 archive did redistribute the xlsx, contradicting the
  project's own licence inventory).

## Product v0.3.0 — commercial web layer (2026-11-09)

Full-stack Next.js 16 console (Apache-2.0 open core unchanged): 14 sections — Overview, Workflow,
Cohort, Dataset Audit, Predict, Batch, Validate, Gates, Provenance, Market, Services, Integrations,
Compliance, Report. Deterministic TypeScript engine mirrors the CLI's audit logic on the frozen real
pilot cohort (N=240, EXPLORATORY; no synthetic data — D-037). Batch queue; hash-chained audit trail
(21 CFR Part 11-style, RUO); FHIR R4 / GLASS-style / CSV exports; API keys with scopes + credits;
market research with cited figures; 3 SKUs with service-request flow. Deviations D-022…D-029.

## Product v0.4.0 — integration & API layer (2026-11-09)

- Enforced, versioned, metered REST API `/api/v1/*` (OpenAPI 3.1 at `/api/openapi.json`;
  x-api-key auth; scopes `read` / `read+predict`; credits: predict 1, audit 5, validate 5,
  report 1, manifest 0; every call lands in the hash-chained audit log).
- MCP server `POST /api/mcp` (JSON-RPC 2.0: initialize / tools/list / tools/call; 5 tools;
  same auth + metering) so agentic platforms invoke LACUNA natively.
- Vecura integration (identity verified: agentic-AI life-science platform by Nanyang
  Biologics / NYB.AI, Singapore — research note 01, `research/01-vecura-integration.md`):
  outbound HMAC-SHA256-signed webhooks (predict.completed / audit.completed /
  validate.completed / report.ready; 3 s timeout; every attempt logged), inbound
  HMAC-verified receiver, connector console with test/rotate. Built to published patterns
  only — labeled "Vecura-ready", no partnership claim (D-031). Live reachability probe
  2026-11-09: vecura.com HTTP 307, app.vecura.com HTTP 200 from the deployment sandbox.
- Market-readiness roadmap PDF (`download/LACUNA-Market-Readiness-Roadmap.pdf`): current
  state, cited market positioning, Vecura integration plan, five delivery phases with exit
  criteria, KPIs, risk register. Deviations D-030…D-038.

## Final verification pass (2026-11-09, completion session)

- `bun run lint` — clean (re-run after the D-039 fix).
- Python package: **60/60 tests pass** (`python3 -m pytest tests/ -q` on this repository).
- W-suite re-run: key issuance → metered predict (credits 100→99, RUO notice present);
  webhook HMAC round-trip (bad signature 401 / good signature 200 `{received:true}`);
  outbound deliveries logged honestly (delivered / verified / rejected); banned-claims
  grep finds only the mandated negation ("it is not a partnership claim").
- Browser E2E (headless): all 14 sections render and navigate; live conformal prediction
  on SAMN10620096 (Mondrian set R, calibrated P(resistance)=1.000, 13 AMRFinderPlus
  determinants listed, RUO notice); Integrations developer surface (REST / OpenAPI / MCP
  endpoints + credit-cost table); Market 2026-11-09 refresh block; Compliance hash-chained
  trail. Desktop 1440×900 and mobile 390×844 screenshots verified non-blank; zero page
  errors.
- **Integrity fix D-039**: the console's gate-verdict extractor mis-displayed G3 and G5
  as PASS (their verdict lines defer to per-drug evidence, which the old parser never
  read). Fixed in `src/lib/lacuna/gates.ts`; all 12 verdicts now match the gate table
  above exactly (G3 FAIL, G5 FAIL, G7 NOT ATTEMPTED). Display-layer only; no data,
  splits, models or results were touched.

## Gate table

| Gate | Verdict | Evidence |
|---|---|---|
| G0 environment + license audit | PASS | gates/G0.md; provenance/license_audit.tsv |
| G1 prior art + census + DG + protocol freeze | PASS | gates/G1.md; provenance/prior_art.md; results/tables/census* |
| G2 label integrity (25 isolates, independent recompute) | PASS (74/74) | gates/G2.md (checker-side XML-entity bug found and fixed by the gate) |
| G3 split integrity | **FAIL** (zero isolate overlap; clonal-cluster overlap across train/test in the isolate-stratified S0 folds and in S2/S3 — 15/18/15 problems for ciprofloxacin/gentamicin/ceftazidime; S1 lineage folds clone-disjoint). Initially mis-reported as PASS in this summary; corrected 2026-11-01 (D-019) | gates/G3.md; results/splits/manifest.json |
| G4 catalogue sanity | PASS (carrier R-rates 0.36/0.97/0.79 vs 0.00/0.02/0.00) | gates/G4.md |
| G5 model integrity (seed reproduction) | **FAIL** (frozen 0.01 tolerance exceeded: gentamicin 0.0139, ceftazidime 0.0838; ciprofloxacin 0.0) | gates/G5.md |
| G6 conformal validity on S0 | PASS (means 0.900-1.000 vs 0.90 target; small-n quantile noise) | gates/G6.md |
| G7 phase B controls | NOT ATTEMPTED (blocked by G5, fail-closed) | gates/G7.md |
| G8 reproducibility (subset re-run) | PASS (labels/features/splits byte-identical; AMRFinderPlus not re-run, documented) | gates/G8.md |
| G9 manuscript verification | PASS (all numbers injected; 5 spot-checks pass) | gates/G9.md |
| G10 product | PASS (fresh venv install, 8/8 tests, real-data example, license inventory) | gates/G10.md |
| G11 red-team | PASS (10 numbers re-derived from raw files; initial checker artifact corrected and documented) | gates/G11.md |

**Documented FAIL consequences (stated in the manuscript):** G3 FAIL means the pilot's S0/S2/S3 splits share clonal clusters
across the train/test boundary, so their metrics retain clonal relatedness; S1 lineage folds are clone-disjoint, and the
H1 S1/S3-minus-S0 deltas combine lineage novelty with clonal-leakage removal (not separable at pilot scale). The v0.2.0
toolkit's auto-generated splits assign whole dedup clusters to folds, preventing this in future runs. G5 FAIL means pilot-scale
M1/M2 results are seed-sensitive for gentamicin and ceftazidime and are reported as such; phase B
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
6. Upload the pre-registration (paper/PREREGISTRATION.md) to OSF and archive the release bundle
   (release/lacuna-amr-0.2.0-archive.tar.gz; note D-021: EUCAST xlsx and raw-XML snapshots are
   no longer redistributed in archives — keep the working repository for full provenance).
7. Retrieve current venue author guidelines and reformat the manuscript; complete the full
   27-item TRIPOD+AI checklist table at submission.
8. Execute the full-scale run (the protocol is written for it: uncapped cohort at DG scale on
   adequate hardware) before any non-pilot claim is made.
