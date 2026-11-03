// Market research module — every figure below is externally sourced and
// cited (retrieved 2026-11-04). Nothing on this page is invented: per project
// integrity rule R1/R2, market numbers may only appear with a citation, and
// pricing is presented only as positioning against published benchmark ranges.

export interface MarketSource {
  id: string;
  title: string;
  detail: string;
  url: string;
  retrieved: string; // ISO date
}

export const MARKET_SOURCES: MarketSource[] = [
  {
    id: "GVR-2026",
    title: "Grand View Research — Antimicrobial Resistance Diagnostics Market Report, 2033",
    detail:
      "Market size US$3.4B (2025) → US$3.5B (2026) → US$4.7B (2033), CAGR 4.1% (2026–2033). Hospitals led end-use with 58.2% of 2025 revenue; North America 37.1% regional share; Asia-Pacific fastest-growing. Cites CDC (~2.8M US AMR cases/year) and the US Pharmacopeial Convention (~700k global deaths/year, projected 10M/year by 2050).",
    url: "https://www.grandviewresearch.com/industry-analysis/antimicrobial-resistance-diagnostics-market-report",
    retrieved: "2026-11-04",
  },
  {
    id: "Bosetti-2025",
    title: "Bosetti, Grant & Catho (2025) — Computerized decision support for antimicrobial prescribing: what every antibiotic steward should know",
    detail:
      "Narrative review (Antimicrob Steward Healthc Epidemiol 5(1):e210, doi:10.1017/ash.2025.10091, PMC12451809): CDSS effectiveness is hindered by alert fatigue, poor fit with existing workflows and lack of transparency in recommendations; calls for user-focused development with clear reasoning.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12451809",
    retrieved: "2026-11-04",
  },
  {
    id: "Florensa-2022",
    title: "Florensa et al. (2022) — ResFinder: open online identification of AMR genes and phenotype prediction",
    detail:
      "Microb Genom 8(1):000748, doi:10.1099/mgen.0.000748: 820,803 ResFinder analyses were run from 61,776 IP addresses in 171 countries between 2012 and 28 Sep 2021 — evidence of massive global demand for zero-install web AMR tools, especially in low- and middle-income countries.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8914360",
    retrieved: "2026-11-04",
  },
  {
    id: "HL7-FHIR",
    title: "HL7 Terminology — ObservationInterpretationSusceptibility value set (v3-ObservationInterpretation)",
    detail:
      "The HL7 FHIR standard defines interpretation codes for antimicrobial susceptibility test results (S = susceptible, R = resistant, I = intermediate), and FHIR R4 is the exchange standard for laboratory observations into EHR systems.",
    url: "https://terminology.hl7.org/1.0.0/ValueSet-v3-ObservationInterpretationSusceptibility.html",
    retrieved: "2026-11-04",
  },
  {
    id: "WHO-GLASS",
    title: "WHO — Global Antimicrobial Resistance and Use Surveillance System (GLASS)",
    detail:
      "WHO GLASS aggregates national AMR surveillance data; participating countries must submit quality-assured AST data (WHO GLASS reports; Fleming Fund programmes central output is helping countries register and provide quality data to GLASS, 2025).",
    url: "https://www.who.int/publications/b/53877",
    retrieved: "2026-11-04",
  },
  {
    id: "PRICE-2025",
    title: "Published pricing benchmarks for clinical-genomics compute and SaaS",
    detail:
      "Cloud HPC analysis: ~US$3–7/sample (whole-exome) and ~US$0.50–2/sample (targeted panels) in 2025 (Dataintelo, Cloud HPC for Bioinformatics Market). Clinical-genomics platform subscriptions: basic plans ~US$1,000–2,000/yr, common SaaS plans ~US$5,000–25,000/yr (University of Utah CBI cloud-based analysis overview).",
    url: "https://www.basepairtech.com/blog/saas-bioinformatics-cloud-pricing",
    retrieved: "2026-11-04",
  },
];

export interface DemandSignal {
  id: string;
  signal: string;
  evidence: string;
  sourceId: string; // MARKET_SOURCES id
  lacunaAnswer: string;
  shipped: boolean; // available in this console today
}

export const DEMAND_SIGNALS: DemandSignal[] = [
  {
    id: "transparency",
    signal: "Transparency gap in resistance-prediction decision support",
    evidence:
      "2025 narrative review of antimicrobial CDSS: adoption is hindered by lack of transparency in recommendations; reviewers call for clear reasoning behind every output.",
    sourceId: "Bosetti-2025",
    lacunaAnswer:
      "Every prediction ships a determinant list, a calibrated p(R), a threshold and a conformal prediction set with a measured 90% coverage target — plus a hash-chained audit trail of who ran what.",
    shipped: true,
  },
  {
    id: "web-access",
    signal: "Massive global demand for zero-install web AMR tools",
    evidence:
      "ResFinder logged 820,803 analyses from 61,776 IP addresses across 171 countries (2012–2021), driven especially by low- and middle-income-country laboratories.",
    sourceId: "Florensa-2022",
    lacunaAnswer:
      "This console replicates the zero-install access model — full engine, cohort and audit tooling in the browser — while adding the compliance and batch features free public tools lack.",
    shipped: true,
  },
  {
    id: "batch",
    signal: "High-throughput batch scoring for routine laboratories",
    evidence:
      "Hospitals are the dominant end-use segment (58.2% of 2025 AMR-diagnostics revenue) and process isolates in bulk; stewardship programmes evaluate collections, not single isolates.",
    sourceId: "GVR-2026",
    lacunaAnswer:
      "Batch scoring queue: submit up to the full 240-isolate pilot cohort per drug, staged processing with live progress, aggregate QA summary and CSV download.",
    shipped: true,
  },
  {
    id: "interop",
    signal: "EHR/LIMS interoperability for AST results",
    evidence:
      "HL7 FHIR standardises laboratory observation exchange and defines the susceptibility interpretation codes (S/R/I) used by EHR systems; poor workflow fit is a documented CDSS barrier.",
    sourceId: "HL7-FHIR",
    lacunaAnswer:
      "One-click FHIR R4 Bundle export of stored predictions as Observation resources with v3-ObservationInterpretation codes and explicit research-use-only flags.",
    shipped: true,
  },
  {
    id: "surveillance",
    signal: "Surveillance reporting burden (national + WHO GLASS)",
    evidence:
      "WHO GLASS requires countries to submit quality-assured AST data; Fleming Fund programmes focus on helping countries register for and provide quality data to GLASS.",
    sourceId: "WHO-GLASS",
    lacunaAnswer:
      "GLASS-style aggregate export: resistance proportions with Wilson 95% CIs by drug and by country/BioProject, computed live from the real pilot AST table.",
    shipped: true,
  },
  {
    id: "compliance",
    signal: "Audit-trail and record-keeping expectations",
    evidence:
      "Hospital-dominated demand plus regulated-laboratory practice (e.g. 21 CFR Part 11 electronic records, EU IVDR documentation) make immutable audit trails a procurement prerequisite rather than a nice-to-have.",
    sourceId: "GVR-2026",
    lacunaAnswer:
      "Every console action lands in an append-only, hash-chained audit log (sha256 over the previous hash), verifiable in one click; exportable as CSV for QA files.",
    shipped: true,
  },
  {
    id: "pricing",
    signal: "Predictable, benchmark-aligned pricing models",
    evidence:
      "Published 2025 benchmarks: US$0.50–7 per-sample cloud analysis and US$1k–25k/yr platform subscriptions are the accepted norms in clinical genomics SaaS.",
    sourceId: "PRICE-2025",
    lacunaAnswer:
      "Three tiers — free open core, Lab subscription, Enterprise per-engagement — positioned explicitly against those published ranges (see Services tab); no invented prices.",
    shipped: true,
  },
];

export interface PlanTier {
  id: string;
  name: string;
  positioning: string; // benchmark-cited positioning, NOT a price
  benchmark: string;
  includes: string[];
  bestFor: string;
  accent: "emerald" | "amber" | "zinc";
}

export const PLAN_TIERS: PlanTier[] = [
  {
    id: "community",
    name: "Community (open core)",
    positioning: "Free, forever",
    benchmark: "Apache-2.0 open core — the entire scientific engine is public",
    includes: [
      "lacuna Python package + CLI (all 5 subcommands)",
      "Full pilot artifacts: cohort, splits, models, evaluation",
      "This web console (self-hostable)",
      "SBOM, model card, DOME + TRIPOD+AI reports",
    ],
    bestFor: "Researchers, public-health labs, low-resource settings",
    accent: "zinc",
  },
  {
    id: "lab",
    name: "Lab subscription",
    positioning: "Aligned to the US$5,000–25,000/yr clinical-genomics SaaS benchmark band",
    benchmark: "Published platform-subscription range (Univ. of Utah CBI overview, 2025)",
    includes: [
      "Hosted console with batch scoring queue",
      "S1 Dataset-Audit and S2 Validation-Audit service credits",
      "FHIR R4 + GLASS-style exports, audit-trail exports",
      "API keys with per-sample credits for LIMS integration",
    ],
    bestFor: "Hospital labs, diagnostic developers, stewardship programmes",
    accent: "emerald",
  },
  {
    id: "enterprise",
    name: "Enterprise / per-engagement",
    positioning: "Per-audit pricing on the US$0.50–7/sample compute benchmark + analyst time",
    benchmark: "Published per-sample cloud-analysis range (Dataintelo, 2025)",
    includes: [
      "Custom organism/drug engagements under the audited SOP",
      "Dedicated runs on your infrastructure (data never leaves)",
      "Regulatory documentation package (IVDR/FDA RUO dossier support)",
      "S3 unexplained-resistance triage roadmap access (still G5-gated)",
    ],
    bestFor: "Diagnostics companies, CROs, national reference laboratories",
    accent: "amber",
  },
];

export function marketSummary() {
  return {
    retrievedOn: "2026-11-04",
    integrityNote:
      "All market figures on this page are externally cited; pricing is positioning against published benchmark ranges, not a price list. Commercial terms require legal review (commercial/ in the research repository).",
    sources: MARKET_SOURCES,
    signals: DEMAND_SIGNALS,
    plans: PLAN_TIERS,
  };
}
