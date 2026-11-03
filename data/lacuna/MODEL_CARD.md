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

## v0.2.0 model artefact format (`lacuna-model/1`)

`lacuna train` writes a JSON artefact with:
- per drug: M0 feature mapping; M1/M2 model payloads (base64 pickle, SHA-256-checksummed),
  Youden thresholds (clamped to [0,1]), Mondrian + marginal conformal quantiles, calibration
  bookkeeping (method, calibration-set size, disjoint lineage groups), labelled counts and a
  training-set hash;
- lineage/dedup-cluster/bioproject/org/year metadata (so `validate` can rebuild and audit splits);
- environment fingerprints (sklearn, numpy, lacuna versions, seed) enforced at load time
  (fail-closed; `--allow-version-mismatch` escape hatch);
- a `payload_sha256` over the whole document — any post-training edit invalidates the artefact.

Trust model: the model payload is a pickle — only load artefacts you trained yourself or
otherwise trust; lacuna verifies integrity hashes but cannot make an untrusted pickle safe.
A v0.2.0 example artefact trained on this cohort (seed 20261101, M0+M1+M2) is retained at
`examples/cli-demo/model.json`; the pilot research artefact remains at `models/pilot_model.json`.

Known degenerate behaviour (measured, retained deliberately rather than hidden): M2 at
ceftazidime scale (n=59) collapses to a near-constant predictor (S0 AUROC 0.5), consistent
with the seed-sensitivity recorded by gate G5.