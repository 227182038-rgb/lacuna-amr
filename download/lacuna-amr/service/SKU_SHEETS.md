# SERVICE LAYER — SKUs, SOPs, sample report, contract template

All services are research-use-only audit services. Client data is processed locally on the client's
or our infrastructure, never shared, and deleted per the retention rules below. Turnaround
estimates derive from measured per-isolate costs on the pilot machine (2 cores/4 GB:
AMRFinderPlus ~15 s/genome effective wall-clock with 2 workers; sketching and model steps are
smaller). Numbers referenced: `results/evaluation/*.json`, `FINAL_REPORT.md` §measured costs.

---

## S1 — Dataset Audit

**Inputs**: client isolate collection (assemblies or accessions), AST table (documented schema),
user-supplied breakpoint table.
**Outputs**: label-heterogeneity report (standards/platforms/methods/phenotype vocabulary,
censored-MIC counts), clonality report (sketch distance distribution, cluster sizes, de-duplication
plan), lineage-phenotype confounding diagnostics (lineage × label mutual information, per-lineage R
fractions), explained/unexplained fraction per drug (M0 catalogue), recommended evaluation protocol
(S0–S3 with feasibility flags).
**SOP** (summary): checksum all inputs → `lacuna audit-dataset` → clonality pipeline (sourmash
sketch + cluster) → `lacuna validate` dry-run diagnostics → analyst review → PDF/HTML report
(via `lacuna report`) with every number traced to a results file.
**QA checks**: fixture regression tests pass; G2-style independent label recomputation on a 25-isolate
sample; split-leakage assertions (G3-style) must pass before any metric is reported.
**Turnaround estimate**: t ≈ N × c_audit + a hours, with c_audit ≈ 0.01 analyst-hours/isolate plus
compute at ~15–30 s/isolate (single 2-core machine) — measured, see FINAL_REPORT; calibrate per
machine before quoting.
**Limitations text**: public-data-derived labels only as reference; results describe the client's
data as submitted; no clinical claims; RUO.
**Data handling**: local processing only; retention 30 days after delivery then deletion; contract
below.

## S2 — Validation Audit

**Inputs**: developer's genome-based AMR model (callable), their labelled dataset, breakpoint table.
**Outputs**: independent re-evaluation under S0/S1/S2/S3 splits (lineage/time/site holdouts),
AUROC/AUPRC/CA/VME/ME with cluster-bootstrap CIs, calibration (Brier/ECE/reliability), conformal
coverage diagnostics (per-unit R-class coverage, shortfall units), risk-coverage curves; written
report.
**SOP**: freeze protocol addendum for the audit → seal test lists (hashed) → run model in
container on our machine → metrics + CIs → report. G3-style leakage assertions mandatory.
**QA**: seed-reproduction check (two seeds, report |Δ|); assertions on test isolation.
**Limitations**: audit reflects the submitted model and data only; small datasets yield wide CIs
(pilot experience: seed-sensitivity at n≈59 — see gates/G5.md); no regulatory pass/fail statements.

## S3 — Unexplained-Resistance Triage (phase B dependent)

**Status**: BLOCKED in the pilot (gate G5 FAIL; phase B not attempted — see gates/G7.md).
**Planned inputs/outputs** (per protocol §12): association testing (pyseer LMM) on client's
resistant isolates with permutation calibration; candidates delivered as *computational
hypotheses* labelled "previously reported (PMIDs)" or "no prior report found by these queries on
date D"; never "novel" or "mechanism".
**SOP**: only after an internal G5-equivalent passes on the client's data.
**Limitations**: no wet-lab instructions; no clinical claims; surveillance-hypothesis framing only.

---

## Sample report (S1) — real public held-out data

Source: the pilot cohort (public NCBI E. coli isolates; every number traceable to
`results/` files). Reproduced from the G10 run (logs/g10.log):

- Gentamicin rows (n=75, primary-rule sample): testing standards CLSI 58 / EUCAST 17; platform
  Sensititre 67 / missing 8; submitter phenotypes include "not defined" (26); EUCAST-v16.1-derived
  labels S 59 / R 16.
- Ciprofloxacin rows (n=60): CLSI 42 / EUCAST 18; Sensititre 49 / missing 11; derived S 55 / R 5.
- Meropenem rows (n=42): CLSI 22 / EUCAST 20; derived S 42 (no resistant isolates in sample —
  meropenem R is rare; see manuscript Methods).
- Ceftazidime rows (n=23): EUCAST 19 / CLSI 4; derived S 13 / R 10.
- Cohort-level diagnostics (240-isolate pilot): coarse-lineage R-class conformal coverage under
  S1 holdouts fell to 0.29–0.44 for specific lineages vs 0.86–1.00 under S0 on the same isolates
  (results/evaluation/hypotheses.json, H3) — the headline risk an S1 audit quantifies for clients.
- Attrition and full statistics: `results/tables/`, `paper/figures/fig1_attrition.pdf`.

## Contract template (FOR LAWYER REVIEW — not legal advice)

[PARTY A: service provider] [PARTY B: client] [DATE]
1. Scope: research-use-only audit services as described in the applicable SKU sheet, performed on
   the data listed in Annex A.
2. Data: B retains ownership; A processes locally, uses the data solely for the service, and
   deletes all client data [30] days after delivery unless B requests earlier deletion in writing.
   A does not transfer client data to third parties. A may retain derived aggregate statistics that
   do not identify B or isolate-level records.
3. Outputs: reports and result files delivered under RUO terms; no clinical, regulatory or warranty
   claims; A's total liability capped at [AMOUNT].
4. Compliance: each party is responsible for its own compliance with applicable data-protection
   law; B confirms the data may be processed for this purpose.
5. Term/termination; governing law [JURISDICTION]; signature blocks.
[REVIEWED BY COUNSEL: ____________ DATE: ______]
