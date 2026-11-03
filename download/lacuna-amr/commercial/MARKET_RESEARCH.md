# LACUNA-AMR — Market Research Brief (commercial feature basis)

Date: 2026-11-04 · Status: research-use only · Integrity rule: every figure below
carries its source; nothing is invented. This document is the basis for the web
console's Market tab and for the commercial feature set shipped on 2026-11-04
(see protocol/DEVIATIONS.md D-022…D-029).

## 1. Market size and structure

- Global antimicrobial resistance (AMR) diagnostics market: **US$3.4B in 2025 →
  US$3.5B in 2026 → US$4.7B by 2033 (CAGR 4.1%, 2026–2033)**
  (Grand View Research, AMR Diagnostics Market Report, accessed 2026-11-04).
- **Hospitals are the dominant buyer**: 58.2% of 2025 end-use revenue
  (Grand View Research).
- North America leads regions at 37.1% of 2025 revenue; Asia-Pacific is the
  fastest-growing regional market (Grand View Research).
- Burden context cited in the same report: ~2.8 million AMR infections per year
  in the US (CDC); ~700,000 deaths per year globally, projected to reach
  10 million per year by 2050 (US Pharmacopeial Convention).

## 2. Demand signals → LACUNA features

| # | Signal (cited) | Evidence | LACUNA feature shipped |
|---|----------------|----------|------------------------|
| 1 | Transparency gap in antimicrobial CDSS | Bosetti, Grant & Catho 2025 (Antimicrob Steward Healthc Epidemiol 5(1):e210, doi:10.1017/ash.2025.10091): effectiveness hindered by alert fatigue, poor workflow fit and **lack of transparency**; calls for clear reasoning | Conformal prediction sets (90% coverage target) + determinant lists + calibrated p(R) + hash-chained audit trail on every prediction |
| 2 | Massive demand for zero-install web AMR tools | ResFinder: **820,803 analyses from 61,776 IP addresses in 171 countries** (2012–Sep 2021) (Florensa et al. 2022, Microb Genom 8(1):000748, doi:10.1099/mgen.0.000748), strongest in LMICs | Full web console (engine + cohort + audits in-browser), with compliance/batch features free public tools lack |
| 3 | Hospital batch throughput | Hospitals = 58.2% of end-use (GVR 2026); stewardship evaluates collections, not single isolates | Batch scoring queue with staged processing, aggregate QA and CSV export |
| 4 | EHR/LIMS interoperability | HL7 FHIR defines the AST interpretation value set (v3-ObservationInterpretation: S/R/I) for laboratory observation exchange; poor workflow fit is a documented CDSS barrier (Bosetti 2025) | FHIR R4 Bundle export of predictions (no LOINC codes asserted — see D-027) |
| 5 | Surveillance reporting (national + WHO GLASS) | WHO GLASS requires quality-assured national AST data; Fleming Fund programmes focus on GLASS registration and data quality (WHO 2025) | GLASS-style aggregate export (resistance % + Wilson 95% CI by drug/country) — explicitly not an official GLASS format (D-028) |
| 6 | Audit-trail / record-keeping expectations | Regulated-lab procurement (21 CFR Part 11-style e-records, EU IVDR documentation) makes immutable audit trails a prerequisite | Append-only hash-chained AuditLog with one-click chain verifier + CSV export |
| 7 | Benchmark-aligned pricing | Published 2025 benchmarks: **US$3–7/sample** whole-exome cloud analysis, **US$0.50–2/sample** targeted panels (Dataintelo); clinical-genomics SaaS **US$1k–2k/yr basic, US$5k–25k/yr common** (Univ. of Utah CBI overview) | Three tiers positioned against those bands (Community free / Lab subscription / Enterprise per-engagement) — not a price list (D-024) |

## 3. Competitive position (honest)

- Free public web tools (e.g. ResFinder, Mykrobe) prove demand but do not offer
  compliance audit trails, batch QA summaries, FHIR/GLASS-style exports or
  engagement SOPs. LACUNA's open core keeps that baseline free and adds the
  procurement-grade layer on top.
- Commercial AMR software vendors serve clinical diagnostics (regulated IVD);
  LACUNA does not compete there: everything it ships is research use only, and
  clinical claims are explicitly out of scope (see MODEL_CARD.md, REGULATORY_RISK.md).

## 4. What we deliberately did NOT build

- No price list (legal review pending; benchmarks only).
- No clinical-decision claims, no diagnostic indications.
- No LOINC code assertions in FHIR exports.
- No claim of official WHO GLASS format compliance.
- No background-worker queue (demo console processes batch chunks per poll —
  documented D-026).
- No production API-key enforcement beyond the demonstrated x-api-key batch
  path (D-029).

## 5. Sources

1. Grand View Research — Antimicrobial Resistance Diagnostics Market Report, 2033.
   https://www.grandviewresearch.com/industry-analysis/antimicrobial-resistance-diagnostics-market-report (accessed 2026-11-04)
2. Bosetti D, Grant R, Catho G. Computerized decision support for antimicrobial
   prescribing: what every antibiotic steward should know. Antimicrob Steward
   Healthc Epidemiol. 2025;5(1):e210. doi:10.1017/ash.2025.10091. PMC12451809.
   https://pmc.ncbi.nlm.nih.gov/articles/PMC12451809
3. Florensa AF, Kaas RS, Clausen PTLC, Aytan-Aktug D, Aarestrup FM. ResFinder —
   an open online resource for identification of antimicrobial resistance genes
   in next-generation sequencing data and prediction of phenotypes from
   genotypes. Microb Genom. 2022;8(1):000748. doi:10.1099/mgen.0.000748.
   https://pmc.ncbi.nlm.nih.gov/articles/PMC8914360
4. HL7 Terminology — ObservationInterpretationSusceptibility value set.
   https://terminology.hl7.org/1.0.0/ValueSet-v3-ObservationInterpretationSusceptibility.html
5. WHO — Global Antimicrobial Resistance and Use Surveillance System (GLASS).
   https://www.who.int/publications/b/53877
6. Pricing benchmarks: Dataintelo, Cloud HPC for Bioinformatics Market (2025);
   University of Utah CBI, cloud-based analysis pricing overview;
   Basepair, SaaS bioinformatics cloud pricing models.
