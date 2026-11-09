# Research Note 03 — Product Decisions & Optimized Build Workflow

*Date: 2026-11-09. This note is the binding decision record for the build. Conflicts resolve by rule priority: (1) data-claims integrity → (2) license compliance → (3) reproducibility → (4) scope completeness → (5) speed/polish.*

## 1. Product identity

**LACUNA-AMR — the audit & trust layer for AMR prediction.**
Not another resistance predictor: the independent platform that certifies whether AMR *datasets* and *models* deserve trust, and the only one whose predictions carry **statistically guaranteed uncertainty**.

## 2. Unique problem-solving capacities (differentiation, each mapped to a shipped feature)

| # | Unique capability | Why nobody has it | Shipped as |
|---|---|---|---|
| U1 | **Leakage Audit** — lineage-aware splits S0–S3, clonal dedup (≤3 per clone-cluster×BioProject), *measured* lineage leakage | Competitors ship point metrics; leakage quantification requires the split methodology we implement | `audit-dataset` + Leakage panel |
| U2 | **Conformal Prediction Sets** — Mondrian + marginal, 0.90 coverage with cluster-bootstrap CIs | Off-the-shelf tools output overconfident point predictions | `predict` + Conformal panel |
| U3 | **Bring-your-own breakpoints** (EUCAST/CLSI upload; never bundled) | Vendors lock jurisdictions; bundling creates regulatory + versioning liability | breakpoint uploader + gate engine |
| U4 | **Publication compliance automation** — DOME + TRIPOD+AI checklists + banned-claims text audit | No competitor targets the publication/peer-review bottleneck | `report` |
| U5 | **License-clean Apache-2.0 core** (no CARD/RGI contamination) | Most AMR stacks mix incompatible licenses | open-core packaging |
| U6 | **Agentic-platform native** — MCP server + OpenAPI so AI workflow platforms (Vecura) invoke LACUNA as a tool | Bioinformatics tools are CLI-first, not agent-first | MCP server + `/api/v1/*` |

## 3. Scope decisions for "market-ready complete"

**IN (this build):**
1. Full-stack web platform (Next.js): landing, 5 capability consoles (audit / predict / validate / report / manifest), pricing + 3 SKUs, dashboard (runs, API keys, usage, audit trail), Vecura connector console, API docs page, RUO compliance banners everywhere.
2. Deterministic TypeScript audit engine in-app (gates, splits, conformal, metrics, banned-claims, SBOM/manifest) — demo-safe synthetic dataset, clearly labeled.
3. Public REST API `/api/v1/*` + OpenAPI 3.1 spec + API-key auth + metering.
4. MCP tool server (HTTP) exposing the 5 capabilities; Vecura connector with webhook receiver (HMAC-verified) + event log.
5. Python `lacuna` package (Apache-2.0, ≥3.11): CLI with same 5 subcommands, same gate thresholds, parity fixtures shared with the web engine.
6. Research docs (Notes 01–03), DEVIATIONS.md, gates G0–G11, market-readiness roadmap PDF.

**OUT (documented as next phases in the roadmap PDF, not silently dropped):** real payment processing (Stripe integration stubbed), production Postgres (SQLite dev DB now), real NCBI data ingestion pipeline, Snakemake production workflow, SOC 2 / ISO 13485 certification, peer-reviewed benchmark publication.

## 4. Regulatory & integrity posture (binding)

- Every prediction/audit surface carries an **RUO banner**: "Research Use Only. Not for clinical diagnosis or treatment decisions."
- No EUCAST/CLSI breakpoint tables shipped or cached in the repo — uploaded per-run by the user; gates derive S/R only from the user's table.
- Synthetic demo data is generated deterministically (seeded) and labeled SYNTHETIC in every artifact; it never masquerades as real isolate data.
- Marketing copy passes the same banned-claims audit we ship as a feature (dogfooding rule).
- No claim of a Vecura partnership; the connector is standards-based and labeled "Vecura-ready".

## 5. Optimized build workflow (vertical slices)

```
S1  research + decisions (this note)                      [done]
S2  repo skeleton: protocol/DEVIATIONS.md, gates/G0–G11   [this session]
S3  web platform vertical slice: engine gates+audit → API → UI console
S4  remaining capabilities: predict (conformal), validate, report, manifest
S5  commercial layer: tiers, SKUs, API keys + metering, dashboard, audit trail
S6  integration layer: OpenAPI spec, MCP server, Vecura connector + webhooks
S7  Python core package + parity fixtures
S8  docs (API reference, README) + roadmap PDF + final verification (gates G0–G11 recorded)
```

Rationale: S3 forces one full-stack path through the codebase first (kills integration risk early); S5–S6 monetize and differentiate; S7 preserves the open-core license boundary; S8 produces the investor/partner-ready artifacts.

## 6. KPI targets for "market-ready" (Phase 1 exit criteria, restated in roadmap PDF)

- ≥1 pilot reference lab or AMR research group using the audit console weekly
- API signup → first successful audit call within 15 minutes (self-serve)
- 0 integrity-rule violations in copy/features (banned-claims audit clean)
- Vecura connector: successful end-to-end MCP tool round-trip in joint test
