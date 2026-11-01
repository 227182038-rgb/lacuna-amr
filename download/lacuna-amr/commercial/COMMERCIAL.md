# COMMERCIAL DOCUMENTS — LACUNA-AMR

Plain, non-promotional language throughout. Every quantitative claim ties to an evidence row in
`paper/claims_ledger.tsv` (result-key column). No invented customers, quotes, market sizes or
prices.

## 1. Product one-pager — lacuna (open-core toolkit)

**What it is**: an Apache-2.0 Python package + CLI that audits genome-based AMR predictions:
label-heterogeneity auditing, clonal de-duplication, lineage/time/site-aware evaluation,
calibrated probabilities and Mondrian split-conformal prediction sets with abstention.
**What it is not**: a clinical decision tool, a resistance-gene database, or a hosted service.
**Evidence rows**: install/CLI/tests (gates/G10.md); label semantics (tests; gates/G2.md);
conformal coverage behaviour (results/evaluation/hypotheses.json → claims L1–L4).
**Licensing**: Apache-2.0 code; AMRFinderPlus public domain (external); EUCAST tables
user-supplied; CARD/RGI and CLSI excluded (provenance/license_audit.tsv).

## 2. Service one-pager — audit services

Three SKUs (see service/SKU_SHEETS.md for inputs/outputs/SOPs/QA/limitations):
S1 Dataset Audit; S2 Validation Audit; S3 Unexplained-Resistance Triage (currently blocked, see
gates/G7.md). Core value proposition, stated plainly: independent, license-clean measurement of
where a genome-based AMR model works and where its guarantees fail, on the client's own data,
locally. **Evidence rows**: the pilot demonstrates every S1/S2 output on real public data
(FINAL_REPORT.md).

## 3. Competitor / substitute table (built only from retrieved sources)

| Tool / approach | License (as retrieved) | What it does | Relation to lacuna |
|---|---|---|---|
| AMRFinderPlus (github.com/ncbi/amr) | public domain (US Gov) | determinant detection; does not predict phenotype (wiki note captured) | upstream feature engine we audit on top of |
| CARD/RGI (card.mcmaster.ca/about) | commercial license + fee (ontology CC BY 4.0) | determinant database + tool | excluded from our product path on license grounds |
| pyseer (github.com/mgalardini/pyseer) | Apache-2.0 | bacterial GWAS (LMM) | planned phase B engine (blocked in pilot) |
| EUCAST breakpoint tables (eucast.org) | copyright EUCAST; free reuse with citation, no resale | reference breakpoints | user-supplied input; never bundled |
| CLSI M100 (clsi.org) | paid standard | reference breakpoints/AST methods | excluded entirely |
| Published relabelling pipeline (Aselstyne 2026, preprint, doi 10.64898/2026.06.28.734076) | preprint (research use) | relabels NCBI AST with CLSI breakpoints | closest public prior work to our label pipeline; we add audit tooling + conformal diagnostics |
| ML AMR predictors in literature (e.g., Yu 2025 PLoS Biol doi 10.1371/journal.pbio.3003539) | research papers | prediction models | the class of artefacts S2 audits |

(No market-size or customer claims: none retrieved.)

## 4. Customer-discovery plan (no invented customers)

Segments to interview: (a) AMR-software developers building predictors who need independent
evaluation; (b) public-health/surveillance labs with isolate collections and AST records; (c)
diagnostic companies exploring genomics-based AST who need evaluation evidence pre-submission.
Hypotheses to test (falsifiable, stated as beliefs to check, not facts):
- H-a: developers cannot cheaply measure lineage-shift robustness of their models today.
- H-b: surveillance labs value label-heterogeneity audits of their historical AST before ML use.
- H-c: evaluation evidence is needed earlier than regulatory engagement, creating demand for S2.
Interview script skeleton: role → current workflow → how they evaluate AMR models today → what
failed last time → willingness-to-pay probes (time saved vs analyst-hours). Success metric:
≥[X] interviews per segment with ≥[Y]% confirming the bottleneck (targets set after first 5
interviews; no invented numbers).

## 5. Pricing logic (formula only; margins blank by design)

cost(service) = N × (c_compute + c_analyst) + fixed_setup
- c_compute per isolate = machine-minutes × rate; measured on the pilot machine:
  AMRFinderPlus ≈ 15.1 s/genome effective (2 workers, 2 cores; logs), sketching <1 s/genome,
  modelling minutes per dataset (results/evaluation runtimes).
- c_analyst per isolate ≈ [BLANK — measure in first 3 engagements].
- price = cost / (1 − target_margin), target_margin = [BLANK — founder decision].
No prices are published here; no revenue claims.

## 6. Open-core vs dual-licensing options (trade-offs; not legal advice)

- Pure open-core (Apache-2.0 toolkit, paid services): simplest compliance story; strongest
  reproducibility/marketing for academic buyers; risk: service revenue only, no per-seat moat.
- Dual-licensing (AGPL/commercial): protects against hosted competitors; friction with
  pharma/diagnostic legal teams; requires license audit of every dependency (already done:
  provenance/license_audit.tsv).
- Recommendation to evaluate after first 10 customer conversations; no decision recorded here.
