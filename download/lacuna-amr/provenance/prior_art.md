# PRIOR ART — LACUNA-AMR

All items below were retrieved and verified live during this run (2026-11-01, UTC).
Raw snapshots and hashes: `provenance/ledger.tsv`, `provenance/reference_verification.tsv`,
`provenance/snapshots/`, `provenance/prior_art_searches/`. Quotes are ≤15 words; claims are paraphrased.

## 1. Verified references (Crossref + doi.org + PubMed resolution)

| ID | Reference | Venue / type | First author, year | DOI | PMID | Verdict |
|----|-----------|--------------|--------------------|-----|------|---------|
| R01 | AMRFinderPlus and the Reference Gene Catalog… | Sci Rep, journal | Feldgarden, 2021 | 10.1038/s41598-021-91456-0 | 34135355 | VERIFIED |
| R02 | Biased sampling driven by bacterial population structure confounds ML AMR prediction | PLoS Biol, journal | Yu, 2025 | 10.1371/journal.pbio.3003539 | 41401143 | VERIFIED |
| R03 | Learning From Limited Data: Towards Best Practice Techniques for AMR Prediction from WGS Data | Front Cell Infect Microbiol, journal | Lüftinger, 2021 | 10.3389/fcimb.2021.610348 | 33659219 | VERIFIED (brief gave no first author) |
| R04 | A systematic analysis of machine learning pipelines for robust AMR prediction (relabels NCBI AST with CLSI breakpoints) | preprint (posted-content) | Aselstyne, 2026 | 10.64898/2026.06.28.734076 | none (preprint) | VERIFIED as PREPRINT |
| R05 | Phylogeny-weighted conformal prediction for genomic antibiotic susceptibility testing: four failures of a natural idea | NeurIPS 2026 workshop poster (ICBINB: Failure Modes of AI in Biology), Dec 11 2026 | Anojulu & Puttagunta (workshop poster, not peer-reviewed) | n/a (OpenReview forum RBZSoNdztV) | n/a | VERIFIED as workshop poster; abstract retrieved from neurips.cc listing page |
| R06 | Confidence-based prediction of antibiotic resistance at the patient level | mBio, journal | Inda-Díaz, 2026 | 10.1128/mbio.03431-25 | 41575464 | VERIFIED (patient-level, non-genomic per brief; title/venue/year confirmed) |
| R07 | GWAS of K. pneumoniae identifying determinants | Front Microbiol, journal | Pei, 2022 | 10.3389/fmicb.2022.997769 | 36386631 | VERIFIED |
| R08 | Multi-approach methods to predict cryptic carbapenem resistance mechanisms in K. pneumoniae | Front Microbiol, journal | Cornacchia, 2023 | 10.3389/fmicb.2023.1242693 | 37700864 | VERIFIED |
| R09 | Impact of CLSI and EUCAST breakpoint discrepancies | Clin Microbiol Infect, journal | Cusack, 2019 | 10.1016/j.cmi.2019.03.007 | 30910717 | VERIFIED |
| R10 | DOME: recommendations for supervised ML validation | Nat Methods, journal | Walsh, 2021 | 10.1038/s41592-021-01205-4 | 34316068 | VERIFIED |
| R11 | TRIPOD+AI statement | BMJ, journal | Collins, 2024 | 10.1136/bmj-2023-078378 | 38626948 | VERIFIED |
| R12 | pyseer: a comprehensive tool for microbial pangenome-wide association studies | Bioinformatics, journal | Lees, 2018 | 10.1093/bioinformatics/bty539 | 30535304 | VERIFIED |
| R13 | A fast and agnostic method for bacterial GWAS (unitigs) | PLOS Genet, journal | Jaillard, 2018 | 10.1371/journal.pgen.1007758 | 30419019 | VERIFIED |
| R14 | Introducing the FAIR Principles for research software | Sci Data, journal | Barker, 2022 | 10.1038/s41597-022-01710-x | 36241754 | VERIFIED (found by search; not in brief) |

Additional verified items:
- PMID 42653162 (Int J Mol Sci, 2026): antibiotic-specific genotype–phenotype concordance and cross-database interoperability in public databases — directly relevant prior art for label quality / explained fraction (title retrieved via PubMed esummary).
- PMID 26142410 (J Antimicrob Chemother, 2015): WGS accurately predicts AMR in E. coli — early E. coli WGS-AST work.
- PMID 41346025 (J Comput Biol, 2026): conformal prediction with knowledge graphs for AMR detection (MALDI-TOF context) — nearest conformal-AMR work found.
- PMID 34867917 / 32318038 (Front Microbiol): systematic evaluations of WGS-based AMR prediction (Campylobacter / Salmonella).
- ISO 20776-2:2021 Edition 2 (published 2021-12; abstract retrieved via web gateway from iso.org/standard/79377.html; direct curl blocked by bot protection). The 2007 edition is withdrawn. Scope: performance evaluation of AST devices against reference broth microdilution. Note: CA/VME/ME terminology is from CLSI M52 (paid standard, not retrieved); we use these as descriptive metrics only, with definitions stated in the manuscript and no regulatory pass/fail claims.

## 2. Official source statements captured verbatim-source (paraphrased here)

- **NCBI BioSample antibiogram docs** (https://www.ncbi.nlm.nih.gov/biosample/docs/antibiogram, retrieved 2026-11-01): antibiogram data are submitted by data depositors as tables on BioSample records; the data are subject to content validation, including antibiotic names. Mandatory fields include antibiotic, resistance phenotype, measurement sign, measurement, measurement unit, laboratory typing method and testing standard. The docs recognise MIC synonyms (broth dilution, broth microdilution, macrodilution, microdilution, minimal inhibitory concentration), agar dilution and disk diffusion as laboratory typing methods, and BSAC/CLSI/DIN/EUCAST/NARMS/NCCLS/SFM/SIR/WRG as testing standards.
- **NCBI policies page** (https://www.ncbi.nlm.nih.gov/home/about/policies/): NCBI states it places no restrictions on use or distribution of the data it holds; submitters may assert their own rights (sentences captured in `provenance/licenses/ncbi_policy_excerpt.txt`).
- **EUCAST v16.1 breakpoint tables** (xlsx downloaded, sha256 in ledger; "Version 16.1, valid from 2026-06-24"; citation statement captured from the Content sheet): K. pneumoniae/E. coli breakpoints are in the generic Enterobacterales rows — ciprofloxacin S≤0.25/R>0.5; meropenem S≤2/R>8; colistin S≤2/R>2 (bracketed, footnote 3); gentamicin S≤2/R>2 (bracketed); ceftazidime S≤1/R>4. Note 2 states that colistin MIC determination should be performed with broth microdilution (captured in full: `results/tables/eucast_enterobacterales_notes_I140.txt`).
- **AMRFinderPlus** (github.com/ncbi/amr): public-domain notice (US Government work, NCBI). Software v4.2.7, database v2026-08-07.1 (frozen this run). `--organism Escherichia` is a valid option for point-mutation detection (confirmed from `--list_organisms` output, `.tools/amrfinder_organisms.txt`). Wiki "Interpreting results — Genotype vs. Phenotype" cautions that gene presence does not equal phenotypic resistance and that AMRFinderPlus does not predict phenotype (captured: `provenance/snapshots/amrfinder_interpreting.html`).
- **CARD/RGI** (card.mcmaster.ca/about): commercial use of the Materials is offered only under a written license and user fee; the ontology is CC BY 4.0 (sentences captured: `provenance/licenses/card_license_excerpt.txt`). Consequence: CARD data and RGI are EXCLUDED from the product path, benchmarks and services.
- **CLSI M100**: paid copyrighted standard (clsi.org page fetch bot-blocked; status documented from the standards-store listing). No CLSI values are embedded anywhere in this project.

## 3. Prior-art search log (retrieved 2026-11-01, exact queries in `provenance/prior_art_searches/`)

| Question | Query family (PubMed, sort=relevance) | Count | Relevant findings |
|---|---|---|---|
| Conformal prediction × AMR | conformal prediction[TIAB] AND (antimicrobial OR antibiotic resistance)[TIAB] | 3 | KG-conformal MALDI-TOF AMR (PMID 41346025); patient-level CP (R06, PMID 41575464); XAI prioritisation workflow (PMID 42943754) |
| Conformal × clade/lineage/phylogeny | conformal[TIAB] AND (clade OR lineage OR phylogen*)[TIAB] | 1 | unrelated single-cell paper (SCOPE) |
| Conformal × Enterobacterales/Klebsiella/Escherichia | conformal[TIAB] AND (Enterobacterales OR Enterobacteri* OR Klebsiella OR Escherichia)[TIAB] | 2 | no lineage-shift coverage evaluation |
| Lineage-holdout AMR terms | leave-one-clade-out OR leave-lineage-out OR lineage holdout AND resistance/antimicrobial | 0 | no hits by these terms |
| Relabelled AST breakpoints | susceptibility testing/antibiogram AND breakpoint AND (re-interpret/relabel/reannotate/recategorize) | 1 | unrelated (P. aeruginosa inhaled tobramycin breakpoints); the relabelling prior art found is R04 (preprint) |
| Genotype–phenotype concordance in public databases | genotype-phenotype AND concordance AND (public database/NCBI/surveillance) AND resistance | 31 | top hit PMID 42653162 (IJMS 2026) directly on point |
| Unexplained/cryptic resistance × Klebsiella | unexplained/cryptic resistance OR genotype-phenotype mismatch AND Klebsiella | 3 | R08 (PMID 37700864) + two molecular epidemiology studies (PMIDs 33781999, 40879378) |
| ML AMR benchmark WGS | machine learning AND AMR AND whole-genome AND benchmark/systematic evaluation | 1 | large-scale species/drug-class mechanisms paper |

**Search-based conclusions (stated as search findings, not absolute claims):**
1. By the queries above, run on 2026-11-01, we found **no published conformal-prediction coverage evaluation under lineage/time/site shift for genome-based AMR prediction in Enterobacterales**. The nearest works are: the NeurIPS 2026 ICBINB workshop poster (R05), which reports coverage failures over 491 (drug, clade) holdouts on 10,227 M. tuberculosis genomes; a patient-level non-genomic conformal study (R06); and a knowledge-graph conformal AMR detector (PMID 41346025). Our H3 evaluation in E. coli is therefore not yet covered by published work as found by these searches, but we do NOT claim it is "novel" or "first" — only that our searches found no equivalent.
2. We found **no benchmark that masks known determinants and measures rediscovery** for AMR pipelines (searches: GWAS rediscovery/masking terms returned no direct hits; K. pneumoniae GWAS exist (R07, R08) but do not report masked-determinant rediscovery). Again reported as a search finding only.
3. Relabelling of NCBI AST labels with current breakpoints as a study design is present in a 2026 preprint (R04); Cusack 2019 (R09) documents CLSI/EUCAST discrepancies.

## 4. Framing rules for all deliverables

- No result may be described as "novel", "first", "state-of-the-art" or "outperforms" (language audit in stage 12 enforces this).
- Claims about gaps must cite this file's search log with date and query text.
- All quantitative comparisons are within-study, like-for-like, with CIs.
