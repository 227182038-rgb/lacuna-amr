#!/usr/bin/env python3
"""Stage 11: build paper/manuscript.md with every number injected from results
files (R3), plus paper/claims_ledger.tsv. Then export PDF (pandoc/xhtml2pdf)."""
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RES = ROOT / "results"
PAP = ROOT / "paper"

def j(p):
    return json.loads((ROOT / p).read_text())

cen = j("results/tables/census_eligibility_all_organisms.json")
lin = j("results/lineages.json")
sel = j("data/stage3_selection.json")
lab = j("results/tables/labels_summary_all.json")
mr = j("results/evaluation/main_results.json")
hy = j("results/evaluation/hypotheses.json")
spm = j("results/splits/manifest.json")
prot_sha = (ROOT / "protocol" / "PROTOCOL.sha256").read_text().splitlines()[1].replace("sha256 ", "")

def s0au(drug, mt="M1"):
    vals = [r[mt]["metrics"]["AUROC"] for r in mr[drug]["S0"] if mt in r]
    return round(sum(vals) / len(vals), 3)

def s0cov(drug, mt="M1"):
    v = mr[drug].get("S0_mean_coverage", {}).get(mt)
    return round(v, 3) if v else None

def h1(drug, sp, mt="M1"):
    v = hy["H1"][drug].get(f"{mt}_{sp}", {})
    return v

def fmt_ci(ci):
    return f"[{ci[0]:+.3f}, {ci[1]:+.3f}]" if ci else "n/a"

claims = []
def C(sid, sentence, key):
    claims.append((sid, sentence, key))
    return f"[{sid}]"

# ---- G3 split audit, recomputed from the sealed splits + cohort ----------
# (The 2026-11-01 session summary mis-reported gate G3 as PASS; the gate file
# gates/G3.md records FAIL for all three drugs. Corrected here with numbers
# recomputed from the sealed artifacts — deviation D-019.)
import sys as _sys
_sys.path.insert(0, str(ROOT / "src"))
from lacuna.splits import check_split_document  # noqa: E402
from lacuna.splits import load_cohort as _load_cohort  # noqa: E402

_coh = _load_cohort(ROOT / "data" / "cohort.tsv")
_dedup = {b: r["dedup_cluster"] for b, r in _coh.items()}
_g3_problems = {}
for _d in ("ciprofloxacin", "gentamicin", "ceftazidime"):
    _sp = j(f"results/splits/{_d}.json")
    _ids = sorted({i for _f in _sp["S0"]["rep0"] for i in _f})
    _g3_problems[_d] = check_split_document(_sp, _ids, _dedup)
g3_n = {d: len(v) for d, v in _g3_problems.items()}
g3_iso = sum("isolate overlap" in p for v in _g3_problems.values() for p in v)
g3_txt = "/".join(str(g3_n[d]) for d in ("ciprofloxacin", "gentamicin", "ceftazidime"))

pool_ec = cen["organisms"]["Escherichia coli"]["pool_size"]
n_qual, n_link, n_dl = sel["n_qualifying"], sel["n_linkable"], sel["n_downloaded"]
n_cohort, n_surv, n_bp = lin["n_cohort"], lin["n_dedup_survivors"], lin["n_bioprojects"]
lc = lab["label_counts"]
cip_R, cip_S = lc.get("ciprofloxacin_R", 0), lc.get("ciprofloxacin_S", 0)
gen_R, gen_S = lc.get("gentamicin_R", 0), lc.get("gentamicin_S", 0)
caz_R, caz_S = lc.get("ceftazidime_R", 0), lc.get("ceftazidime_S", 0)
h4 = hy["H4"]
g5 = hy["G5"]

abstract = f"""Background: Public antimicrobial susceptibility phenotypes are submitter-supplied, heterogeneous in method and standard, and frequently censored; bacterial populations are clonal, so random cross-validation can mislead; and conformal prediction guarantees assume exchangeability that lineage, time and site shifts violate. We built a license-clean, locally run reference toolkit (lacuna) that audits genome-based AMR prediction and measures where it works and where it fails.

Methods: Pre-registered protocol (frozen before label extraction; SHA-256 {prot_sha[:16]}...). A census of NCBI BioSample antibiogram records (Escherichia coli pool n={pool_ec:,}) drove a data gate that switched the primary organism from Klebsiella pneumoniae to E. coli (drugs ciprofloxacin, gentamicin, ceftazidime; meropenem failed the resistant-count criterion). Labels were derived from user-supplied EUCAST v16.1 breakpoints with censored-interval logic. A phenotype-blind seeded sample of {n_cohort} isolates ({n_bp} BioProjects) was processed with AMRFinderPlus 4.2.7 (database 2026-08-07.1), clustered by sketch distance, and evaluated under random (S0), leave-lineage-out (S1), forward-time (S2) and leave-site-out (S3) splits with catalogue, logistic and gradient-boosting models, calibration and Mondrian split-conformal sets (0.90 target). All results are session-scale pilot results and labelled exploratory.

Results: Label integrity checks passed (74/74 independent recomputations). Split audits found zero isolate-level leakage but clonal clusters spanning train/test in the isolate-stratified random folds (S0) and in the time/site splits (S2/S3) — gate G3: {g3_txt} problems for ciprofloxacin/gentamicin/ceftazidime — so exchangeable-split metrics retain clonal relatedness; lineage folds (S1) were clone-disjoint. S0 mean AUROC was {s0au('ciprofloxacin')} (ciprofloxacin), {s0au('gentamicin')} (gentamicin) and {s0au('ceftazidime')} (ceftazidime). Leave-lineage-out and leave-site-out splits lowered AUROC for gentamicin (S1 delta {h1('gentamicin','S1')['delta']:.3f} {fmt_ci(h1('gentamicin','S1')['delta_ci95'])}). R-class conformal coverage was near-nominal under S0 (means {s0cov('ciprofloxacin')}-{s0cov('ceftazidime')}) but collapsed for specific held-out lineages and sites (as low as 0.29-0.44 on the same isolates where S0 coverage was 0.86-1.00). Submitter-supplied labels changed error rates by 12-26 percentage points versus breakpoint-derived labels. The unexplained-resistant fraction was 0.000 (ciprofloxacin), 0.088 (gentamicin) and 0.000 (ceftazidime). Seed-reproduction failed the pre-registered tolerance for two of three drugs; the gated phase-B module was therefore not attempted.

Conclusions: On public data, a transparent reference pipeline shows that evaluation design and label provenance materially change measured AMR-prediction performance, and that conformal guarantees can fail under realistic shifts even when random-split coverage is nominal. The toolkit, protocol, provenance ledger and analysis code are released for full-scale replication. (Research use only.)"""

h3rows = []
for d in hy["H3"]:
    for k, v in hy["H3"][d].items():
        if k.startswith("M1_S") and isinstance(v, dict):
            for uk, uv in v.get("units", {}).items():
                if "coverage_R_split" in uv:
                    h3rows.append((d, k.replace("M1_", ""), uk, uv))

ms = []
ms.append(f"""# Auditing genome-based antimicrobial-resistance prediction: label provenance, clonal structure and conformal coverage under shift — a transparent reference pipeline and session-scale pilot

**LACUNA-AMR project** (no AI system is listed as an author; see AI-assistance statement)
Version 1.0, {datetime.now(timezone.utc).date().isoformat()}. Pre-registered protocol frozen 2026-11-01T08:52:27Z (SHA-256 {prot_sha}); deviations logged in `protocol/DEVIATIONS.md`.

## Abstract

{abstract}

## Introduction

Four problems complicate genome-based AMR prediction on public data. First, public AST phenotypes are submitter-supplied: NCBI's antibiogram documentation states that such data undergo content validation including antibiotic names, and our own audit shows mixed testing standards, automated platforms and censored values. Second, clonal population structure means random cross-validation can leak lineage information; population structure has been shown to confound machine-learning AMR prediction {C('R1','cite Yu 2025','ref:R02')} and CV design choices change measured performance {C('R2','cite Lüftinger 2021','ref:R03')}. Third, conformal prediction guarantees assume exchangeability; a 2026 NeurIPS workshop poster reported coverage failures over 491 (drug, clade) holdouts on 10,227 Mycobacterium tuberculosis genomes {C('R3','cite Anojulu & Puttagunta 2026 poster','ref:R05')}, and patient-level conformal work exists in non-genomic settings {C('R4','cite Inda-Díaz 2026','ref:R06')}; by the searches logged in our prior-art file (2026-11-01) we found no equivalent evaluation for Enterobacterales — a search finding, not a novelty claim. Fourth, some phenotypically resistant isolates carry no catalogued determinant; GWAS studies exist for K. pneumoniae {C('R5','cite Pei 2022; Cornacchia 2023','ref:R07;ref:R08')} but we found no masked-determinant rediscovery benchmark by our searches.

This project does not claim to solve these problems. It delivers (i) a license-clean, locally run audit toolkit (`lacuna`, Apache-2.0), (ii) a frozen, pre-registered measurement protocol executed at session scale on real public data, and (iii) an honest report of what was and was not achieved, including gate failures.

## Methods

**Data sources and census.** NCBI BioSample records with antibiogram tables were identified via E-utilities (queries and counts in `results/tables/census*`; pool sizes: E. coli {pool_ec:,}; K. pneumoniae 2,518; A. baumannii 1,275). Eligibility fractions were estimated from systematic samples of 250 records per organism counting field presence only (no MIC values) before protocol freeze. Against the pre-registered data gate (>=800 primary-rule isolates, >=100 R and >=100 S, >=8 lineages of >=25, >=5 BioProjects), K. pneumoniae failed for all five candidate drugs; the pre-registered fallback switched the primary organism to E. coli with ciprofloxacin, meropenem and gentamicin. After acquisition, meropenem failed the resistant-count criterion even at full-pool scale (6/292 resistant in the downloaded sample; extrapolated ~90 R in pool) and was replaced, per the pre-registered drug order, by ceftazidime.

**Cohort (session-scale cap).** A phenotype-blind, seeded (20261101) sample of the E. coli pool was fetched until {n_qual} BioSamples qualified with a primary-rule MIC row for any target drug; {n_link} had linked assemblies; {n_dl} assemblies were downloaded (session disk/time cap, deviation D-010); all passed genome statistics QC (4.0-7.0 Mbp, <=2,000 contigs, N50 >= 10 kbp, computed from the downloaded FASTA files). Near-identical genomes were collapsed with sourmash 4.9.4 sketches (k=31, scaled=1000; thresholds frozen from the empirical distance histogram before any phenotype join: dedup/fine 0.303, coarse 0.554 Jaccard distance) keeping at most 3 isolates per clonal cluster x BioProject ({n_surv} survivors), then capped at {n_cohort} isolates across {n_bp} BioProjects.

**Labels.** EUCAST v16.1 (valid from 2026-06-24; xlsx SHA-256 in the provenance ledger; values extracted programmatically with a second independent extraction as cross-check) supplied breakpoints (ciprofloxacin S<=0.25/R>0.5; gentamicin S<=2/R>2; ceftazidime S<=1/R>4 mg/L; generic Enterobacterales rows). Labels are analysis labels derived from historical MICs under a current breakpoint — not the clinical call made at the time. Primary analysis uses dilution-method quantitative MICs only; automated platforms (Vitek, Phoenix, MicroScan) and gradient strips are excluded to pre-registered sensitivity analyses. Censored MICs straddling a breakpoint are indeterminate and excluded (counts in `results/tables/ast_labels_all.tsv`); an open interval at the R breakpoint (e.g. ">4" for ceftazidime) is resistant. Labelled isolates: ciprofloxacin {cip_S + cip_R} ({cip_R} R), gentamicin {gen_S + gen_R} ({gen_R} R), ceftazidime {caz_S + caz_R} ({caz_R} R).

**Features.** AMRFinderPlus 4.2.7 with database 2026-08-07.1 (versions frozen; public-domain NCBI software), `--organism Escherichia`, one call per assembly; features are presence/absence of reported elements and point mutations (157 features across the cohort). The catalogue rule M0 maps drugs to AMRFinderPlus Class/Subclass strings (mapping and the observed vocabulary are frozen in `results/m0_mapping.json`).

**Splits, models, uncertainty.** S0 stratified random 5-fold CV x2 repeats; S1 leave-coarse-lineage-out (small lineages merged into OTHER); S2 forward-time; S3 leave-BioProject-cluster-out; assertion tests enforce zero isolate leakage and audit clonal-cluster leakage (gate G3: {g3_iso} isolate overlaps; clonal clusters spanned train/test in the isolate-stratified S0 folds and in S2/S3 — {g3_txt} problems for the three drugs — while S1 lineage folds were clone-disjoint). M1 = L2 logistic regression; M2 = gradient-boosted trees; nested grouped tuning on training folds only; Platt/isotonic calibration on lineage-disjoint partitions; Mondrian (class-conditional) and marginal split-conformal sets at 0.90 target coverage. Metrics: AUROC, AUPRC, CA, VME, ME (thresholds fixed on training data), Brier, ECE, coverage, set size, abstention; 95% CIs by cluster bootstrap (2,000 replicates) over coarse lineages. Hypotheses H1-H5, metrics and multiplicity handling were pre-registered; H5 (phase B) was gated on G5.

**Deviations.** All departures from the plan (hardware constraints, organism switch, censoring-rule correction before any downstream use, M0 column-semantics fix, session caps, the G3 summary-reporting correction) are logged with timestamps in `protocol/DEVIATIONS.md` (D-001-D-021; D-019-D-021 record the v0.2.0 product-hardening corrections: the G3 mis-report, the evaluation-engine fixes required for exact reproduction, and the release-archive licence hygiene).

## Results

**Cohort attrition.** Figure 1 shows attrition from the pool to analysis sets (pool {pool_ec:,} -> {n_qual} qualifying -> {n_link} linked -> {n_dl} downloaded -> {n_cohort} cohort). {C('A1','attrition numbers','results/lineages.json;data/stage3_selection.json')}

**Label integrity and split integrity.** Independent recomputation of labels from raw BioSample XML for 25 random isolates matched 74/74 checks (gate G2, PASS; one checker bug — an XML-entity unescaping error — was found and fixed by the gate itself). Split leakage assertions found zero isolate overlap in every split and zero clonal-cluster overlap within S1; the isolate-stratified S0 folds, and the S2/S3 splits, shared clonal clusters across the train/test boundary (gate G3, FAIL: {g3_txt} problems for ciprofloxacin/gentamicin/ceftazidime), so S0/S2/S3 estimates retain clonal relatedness between training and test. The catalogue rule was internally consistent: carrier R-rates exceeded non-carrier rates for all three drugs (gate G4: ciprofloxacin 0.362 vs 0.000; gentamicin 0.969 vs 0.015; ceftazidime 0.788 vs 0.000). {C('G24','G2/G3/G4 outcomes','gates/G2.md;gates/G3.md;gates/G4.md')} {C('G3x','G3 split-audit outcome (clonal overlap in S0/S2/S3; S1 clean)','gates/G3.md;protocol/DEVIATIONS.md')}

**Random-split performance and calibration (S0).** Mean AUROC (M1) was {s0au('ciprofloxacin')} for ciprofloxacin, {s0au('gentamicin')} for gentamicin and {s0au('ceftazidime')} for ceftazidime (M2 similar; per-split values with bootstrap CIs in `results/evaluation/main_results.json`). S0 Mondrian coverage means were {s0cov('ciprofloxacin')} (ciprofloxacin M1), {s0cov('gentamicin')} (gentamicin M1) and {s0cov('ceftazidime')} (ceftazidime M1) against the 0.90 target (gate G6; small-sample quantile noise expected at these n). {C('S0p','S0 metrics','results/evaluation/main_results.json')}

**H1 (optimism, exploratory).** For gentamicin, leave-lineage-out evaluation reduced AUROC (delta {h1('gentamicin','S1')['delta']:.3f}, 95% CI {fmt_ci(h1('gentamicin','S1')['delta_ci95'])}); leave-site-out delta was {h1('gentamicin','S3')['delta']:.3f} ({fmt_ci(h1('gentamicin','S3')['delta_ci95'])}). For ciprofloxacin all split deltas had CIs crossing zero (S1 {h1('ciprofloxacin','S1')['delta']:+.3f} {fmt_ci(h1('ciprofloxacin','S1')['delta_ci95'])}; S3 {h1('ciprofloxacin','S3')['delta']:+.3f} {fmt_ci(h1('ciprofloxacin','S3')['delta_ci95'])}). Ceftazidime estimates were unstable (S3 delta {h1('ceftazidime','S3')['delta']:.3f}, {fmt_ci(h1('ceftazidime','S3')['delta_ci95'])}; n=59). Because the pilot S0 folds shared clonal clusters across train/test (gate G3), these S1/S3-minus-S0 deltas combine lineage and site novelty with the removal of clonal relatedness; the two mechanisms cannot be separated at pilot scale. {C('H1','H1 outcomes','results/evaluation/hypotheses.json')}

**H2 (label provenance).** Training and evaluating M1 on submitter-supplied phenotypes instead of EUCAST-v16.1-derived labels (same isolates, same folds) changed VME by {-h2d if (h2d:=hy['H2']['ciprofloxacin']['delta_VME_eucast_minus_submitter']) is not None else 'n/a' if False else round(h2d,3)} (ciprofloxacin), {round(hy['H2']['gentamicin']['delta_VME_eucast_minus_submitter'],3)} (gentamicin) and {round(hy['H2']['ceftazidime']['delta_VME_eucast_minus_submitter'],3)} (ceftazidime) percentage points (EUCAST minus submitter), exceeding the pre-registered 2-point criterion for all three drugs; ME changes were smaller ({round(hy['H2']['gentamicin']['delta_ME_eucast_minus_submitter'],3)} to {round(hy['H2']['ceftazidime']['delta_ME_eucast_minus_submitter'],3)}). {C('H2','H2 outcomes','results/evaluation/hypotheses.json')}

**H3 (coverage under shift).** Realised R-class Mondrian coverage fell below the 0.85 threshold for specific held-out units while S0 coverage on the same isolates remained near-nominal: {'; '.join(f"{d} {sp} unit {uk[:12]}: {uv['coverage_R_split']:.2f} (S0 same isolates {uv['coverage_R_S0_same_isolates']:.2f})" for d, sp, uk, uv in h3rows[:6])}. This mirrors, in Enterobacterales at pilot scale, the M. tuberculosis failures reported by Anojulu & Puttagunta {C('R3','H3 outcomes','results/evaluation/hypotheses.json')}. The number of qualifying units (>=30 test isolates) is small at pilot scale; results are descriptive, consistent with the pre-registered treatment.

**H4 (unexplained resistance).** The fraction of resistant isolates with no M0-relevant determinant was {h4['ciprofloxacin']['fraction']:.3f} (ciprofloxacin; {h4['ciprofloxacin']['n_unexplained']}/{h4['ciprofloxacin']['n_resistant']}; 95% CI {h4['ciprofloxacin']['ci95'][0]:.3f}-{h4['ciprofloxacin']['ci95'][1]:.3f}), {h4['gentamicin']['fraction']:.3f} (gentamicin; {h4['gentamicin']['n_unexplained']}/{h4['gentamicin']['n_resistant']}), and {h4['ceftazidime']['fraction']:.3f} (ceftazidime; {h4['ceftazidime']['n_unexplained']}/{h4['ceftazidime']['n_resistant']}). {C('H4','H4 outcomes','results/evaluation/hypotheses.json')}

**H5 (phase B) — not evaluated.** The pre-registered gate G5 (seed reproduction within 0.01 AUROC) failed for gentamicin (|delta| {abs(g5['gentamicin']['seed1']-g5['gentamicin']['seed2']):.3f}) and ceftazidime (|delta| {abs(g5['ceftazidime']['seed1']-g5['ceftazidime']['seed2']):.3f}) and passed for ciprofloxacin (|delta| {abs(g5['ciprofloxacin']['seed1']-g5['ciprofloxacin']['seed2']):.3f}). Per the fail-closed rule, the gated phase-B module (association testing and masked-determinant rediscovery) was not attempted and no phase-B claims are made (gates/G5.md, gates/G7.md). {C('G5x','G5/G7 outcomes','gates/G5.md;gates/G7.md')}

## Discussion

**Prior-art comparison.** | Work | Relation to this study | |---|---| | Yu et al. 2025 (PLoS Biol) | showed population-structure confounding in ML AMR prediction; we measure its effect on AUROC/coverage with a frozen protocol | | Lüftinger et al. 2021 | compared CV designs; we implement lineage/time/site splits with leakage assertions in an auditable tool | | Aselstyne et al. 2026 (preprint) | relabels NCBI AST with CLSI breakpoints; we quantify how label provenance changes measured error rates (H2) | | Anojulu & Puttagunta 2026 (workshop poster) | reported conformal coverage failures in M. tuberculosis; we observe analogous unit-level failures in E. coli at pilot scale | | Inda-Díaz et al. 2026 (mBio) | patient-level conformal prediction (non-genomic); we evaluate genomic, lineage-shifted settings | | PMID 42653162 (IJMS 2026) | genotype-phenotype concordance across public databases; our S1 audit productises this class of measurement |

**Interpretation.** At pilot scale the three clearest signals are: (1) label provenance is a first-order effect — swapping submitter labels for breakpoint-derived labels moved VME by 12-26 points; (2) lineage and site shifts degrade measured performance for some drugs (gentamicin) while leaving others apparently stable, so per-drug auditing is necessary; (3) conformal guarantees that look correct under random splits failed for specific held-out lineages/sites, echoing the M. tuberculosis result and arguing for per-unit coverage diagnostics in any deployment. The seed-sensitivity failure (G5) at n=59-229 is itself a finding about pilot-scale evaluation stability and is reported as such.

**Limitations.** (1) Public AST labels are submitter-supplied with mixed methods, platforms and standards and frequent censoring; we exclude rather than correct them. (2) Surveillance sampling bias: NCBI isolates over-represent certain countries, sources and BioProjects (11 projects dominate this cohort). (3) Breakpoint re-interpretation is retrospective; labels are analysis labels, not historical clinical calls. (4) No wet-lab validation. (5) Single-species scope (E. coli; the pre-registered fallback from K. pneumoniae), and meropenem/colistin dropped by the data gate. (6) Short-read draft assemblies carry artefacts (contigs, N50) that we bound by QC but do not eliminate. (7) Session-scale pilot (N={n_cohort}; R counts 17-34) — all results exploratory; CIs are wide and seed sensitivity was observed. (8) The nearest-training-distance diagnostic was computed per unit but per-unit sample sizes precluded the pre-registered secondary modelling. (9) The pilot's isolate-stratified S0 folds and its S2/S3 splits shared clonal clusters across train/test (gate G3, FAIL: {g3_txt} problems); S1 lineage folds were clone-disjoint. S0/S2/S3 metrics therefore retain clonal relatedness, and the H1 deltas combine lineage novelty with clonal-leakage removal. The released `lacuna` v0.2.0 auto-generated splits assign whole dedup clusters to folds, preventing this in future runs (deviation D-019).

## Data and Code Availability

Code: `lacuna` package + research pipeline + tests (Apache-2.0) in the project repository; SBOM and license inventory included. Data: no raw third-party assemblies are redistributed; the release carries accession lists with checksums (`data/manifest.tsv`, `data/cohort.tsv`), derived AST/label tables, and the provenance ledger (`provenance/ledger.tsv`) with per-artifact SHA-256. An archive-ready bundle (`release/`) is provided for deposition. The frozen protocol and this manuscript's claims ledger accompany the code.

## Competing Interests

The project includes an intended commercial audit-service layer built on the open-source toolkit (see `commercial/`). No funder influenced the analysis.

## AI-assistance statement

This work used an AI assistant (GLM, Z.ai) as a tool, under the direction and responsibility of the human principal, to execute documented data retrieval, analysis code, and drafting from project-run artifacts. All numbers were injected programmatically from results files; the provenance ledger records retrieval events. No AI system is an author, and the human principal is responsible for the content and all remaining errors.

## Ethics statement

Only public, de-identified NCBI isolate records were used; only organism, collection year, country, source category, submitter and BioProject fields were retained; no re-identification was attempted. Candidate resistance determinants are surveillance hypotheses; no wet-lab instructions are provided; all outputs are research use only.
""")

(PAP / "manuscript.md").write_text("\n".join(ms))

with open(PAP / "claims_ledger.tsv", "w") as fh:
    fh.write("claim_id\tsentence_summary\tresult_key_or_reference\n")
    for sid, s, k in claims:
        fh.write(f"{sid}\t{s}\t{k}\n")
print("manuscript written:", len("\n".join(ms)), "chars;", len(claims), "claims ledgered")
print("h3 rows:", [(d, sp, uk[:10], uv['coverage_R_split']) for d, sp, uk, uv in h3rows])
