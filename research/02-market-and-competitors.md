# Research Note 02 — Market, Competitors, Whitespace, Monetization

*Date: 2026-11-09 · URLs accessed 2026-11-09 · Claims carry sources or ASSUMPTION tags.*

## 1. Market size & drivers (verified)

| Metric | Value | Source |
|---|---|---|
| AMR surveillance market, 2025 | **USD 6.56–6.67 B** (3 estimates agree) | Fortune Business Insights (6.67B → 12.18B by 2034, CAGR 6.92%); Spherical Insights (6.56B → 11.17B by 2035, CAGR 5.47%); third estimate 6.64B → 11.32B by 2035 |
| 2026 → 2034 | ≈ USD 7.0–7.1B → 9.3–12.2B | Fortune BI; Research&Markets (5.9B in 2026 → 9.3B by 2034, CAGR 5.8%) |
| WHO GLASS scale | 100+ participating countries/territories; 2025 report analyzed **>23M confirmed infections** | who.int/initiatives/glass; icars-global.org/glass-report-2025; PMC11953028 |
| Key gap | "major gaps in laboratory capacity and bloodstream infection surveillance"; persistent **data quality/comparability** problems | ScienceDirect Africa AMR landscape 2026; GLASS evaluations |

**Driver synthesis:** surveillance budgets are growing ~6%/yr while data quality remains the #1 reported bottleneck — a tooling gap between "instruments" (bioMérieux, BD, Thermo Fisher dominate AST hardware/software) and "trustable analytics".

## 2. Competitive landscape (verified capabilities)

| Player | What it is | What it does NOT do (= our whitespace) |
|---|---|---|
| ResFinder / ABRicate (DTU et al.) | WGS AMR *gene detection*; best balanced accuracy 0.80 in 2026 systematic comparison | No dataset-quality audit, no leakage quantification, no uncertainty guarantees |
| Mykrobe (Day Zero) | Offline species ID + resistance prediction (started M. tuberculosis) | Point predictions; no conformal guarantees; no buy-side dataset due diligence |
| DeepARG | Deep-learning AMR gene classification | Black-box; no publication-compliance tooling |
| AMRFinderPlus (NCBI) | Public-domain AMR determinant detection | Detection only; no ML validation layer |
| bioMérieux / BD / Thermo Fisher | AST instruments + lab software ecosystems | Closed ecosystems; no open audit of *external* datasets/models; not research-transparent |
| CARD/RGI | Curated database + tool — **excluded from LACUNA** (license incompatible with Apache-2.0 core) | — |

**Whitespace (nobody occupies):** *independent, license-clean audit & trust layer for AMR prediction datasets and models* — buy-side due diligence (hospitals, PH agencies, pharma buying/licensing datasets), pre-publication validation (DOME/TRIPOD+AI), and guaranteed-uncertainty prediction (conformal, 0.90 coverage).

## 3. Buyer personas & willingness to pay (ASSUMPTION — validate in Phase 1 pilots)

1. **Public-health agencies / reference labs** (GLASS participants) — need data-quality evidence before acting on surveillance data. Budget: program funds.
2. **Pharma / biotech AMR programs** (incl. Vecura-type discovery teams) — need resistance-lens + dataset due diligence before licensing data or prioritizing targets.
3. **Academic ML groups** — need leakage audits + checklists to pass review; price-sensitive → freemium funnel.
4. **Diagnostics companies** — need validation evidence packs pre-submission (RUO → IVD path).

## 4. Monetization design (decision; pricing numbers are internal ASSUMPTIONS to A/B test)

- **Freemium SaaS tiers:** Explorer (free: 3 audits/mo, watermarked reports, community support) · Professional ($149/mo per seat: unlimited audits, API 10k calls/mo, unwatermarked PDF, email support) · Enterprise (custom: SSO, dedicated tenancy, SLA, on-prem runner, audit-export).
- **3 service SKUs (human-expert-in-the-loop):** Dataset Audit Report from $2,400 · Validation Audit from $4,800 · Unexplained-Resistance Classification from $3,600 (each scoped per drug/species).
- **API metering** for platform integrations (Vecura-style workflow usage): included quota + overage per 1k calls.
- **Never sold:** clinical interpretive use (RUO-only until regulatory clearance; see Note 03).

## 5. Regulatory boundary conditions (verified)

- EU AI Act: high-risk obligations apply **Aug 2026** (new products) / **Aug 2027** (existing CE-marked); AI SaMD regulated as medical device under MDR with AI Act complementary (Muylle et al. 2024). → Launch strictly **Research Use Only (RUO)**; no diagnostic claims; user-supplied breakpoints only; documented pathway to MDR/IVD if clinical claims are ever made.
- US: clinical decision support exemptions are narrow; RUO labeling is the conservative launch posture (decision, consistent with rule-priority #1 integrity).
