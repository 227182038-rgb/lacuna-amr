# Model card — LACUNA-AMR pilot models

**Intended use**: research auditing of genome-based AMR prediction on public E. coli isolate
data; evaluation of optimism, calibration and conformal coverage under lineage/time/site shift.
**Out-of-scope use**: clinical decision-making, regulatory submissions, non-E. coli organisms
(pipeline is generic but was piloted on E. coli only), prediction on non-NCBI-style assemblies.

## Data
Cohort: N=240 E. coli isolates (session-scale, phenotype-blind seeded sample of public NCBI
BioSample records with linked assemblies; see results/lineages.json and data/cohort.tsv).
Labels: EUCAST v16.1 Enterobacterales breakpoints (user-supplied-table semantics); intermediate
and breakpoint-straddling censored MICs excluded (counts in results/tables/labels_summary_all.json).

## Splits and metrics (pilot-scale, EXPLORATORY)
- ciprofloxacin: n_R=17, n_S=... see results; M1 S0 mean AUROC=0.98
- gentamicin: n_R=34, n_S=... see results; M1 S0 mean AUROC=0.915
- ceftazidime: n_R=26, n_S=... see results; M1 S0 mean AUROC=0.653

## Known failure modes (measured, pilot scale)
- Conformal R-class coverage collapses for some held-out lineages/sites (e.g. gentamicin S1 'OTHER'
  unit, ciprofloxacin S1 lineage 8) despite near-nominal S0 coverage — see results/evaluation/
  hypotheses.json (H3) and paper Figure 3.
- Seed sensitivity: AUROC reproduction across seeds exceeded the frozen 0.01 tolerance for
  gentamicin (|d|=0.014) and ceftazidime (|d|=0.084) — gates/G5.md (FAIL).
- Censored MICs at breakpoints ('>4', '<=2') are frequent in public AST records and are excluded
  from primary analysis.

## Limitations
Pilot scale only (N=240; R counts 17-34 per drug); DG thresholds of the protocol NOT met at pilot
scale; no wet-lab validation; retrospective breakpoint re-interpretation yields analysis labels,
not historical clinical calls.

**RUO statement**: research use only; no clinical claims.

Generated 2026-11-01T11:32:40+00:00 from
results/evaluation/*.json by workflow/scripts/gen_model_card.py.