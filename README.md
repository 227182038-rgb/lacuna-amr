# LACUNA·AMR (v0.5.0)
> **The Independent Audit & Trust Layer for Genomic Antimicrobial Resistance (AMR) Prediction**  
> *Open-Core (Apache-2.0) · Research Use Only (RUO) · Agentic-Platform Native (Vecura / MCP Ready)*

---

## 🌟 Executive Summary

**LACUNA·AMR** is an open-core trust and audit platform designed to certify genome-based antimicrobial resistance (AMR) prediction models and datasets. 

Rather than functioning as another black-box predictor, LACUNA provides the **independent validation, leakage detection, and uncertainty calibration layer** necessary before genomic AI predictions can be trusted in research, surveillance, or drug-discovery pipelines.

### Key Capabilities
* **Clonal & Split Leakage Auditing:** Benchmarks datasets across 4 split topologies (S0 random, S1 lineage hold-out, S2 forward-time, S3 site hold-out) with Sourmash $k=31$ sketch-distance clonal de-duplication ($\le 3$ isolates per cluster $\times$ BioProject).
* **Conformal Prediction Sets:** Replaces overconfident binary point predictions with Mondrian and marginal conformal prediction sets targeting a verified **90% coverage rate** ($S$, $R$, $S+R$, or $ABSTAIN$).
* **Model Context Protocol (MCP) Server:** Exposes core audit and prediction capabilities as callable tools over JSON-RPC 2.0 (`/api/mcp`) so AI agent platforms (like **Vecura**) can autonomously audit datasets and score resistance.
* **Bring-Your-Own Breakpoints:** Dynamic label interpretation using user-supplied EUCAST/CLSI tables; zero bundled tables to eliminate regulatory and copyright liabilities.
* **Tamper-Proof Audit Trail:** Append-only, SHA-256 hash-chained event ledger inspired by **21 CFR Part 11**.
* **Healthcare Interoperability:** Native export to **HL7 FHIR R4 Observation bundles** (`v3-ObservationInterpretation`) and WHO GLASS-compatible surveillance tables.

---

## 🏗️ Repository Architecture

This repository contains the complete full-stack web console, programmatic API, MCP tool server, and the standalone Python research engine:

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── mcp/route.ts              # JSON-RPC 2.0 Model Context Protocol (MCP) Server
│   │   │   ├── openapi.json/route.ts     # OpenAPI 3.1 specification
│   │   │   ├── v1/                       # Versioned REST API (predict, audit, validate, report)
│   │   │   ├── webhooks/vecura/route.ts  # HMAC-SHA256 verified inbound webhook receiver
│   │   │   └── integrations/vecura/      # Vecura connector configuration & dispatcher
│   │   ├── page.tsx                      # Single-page Next.js 16 interactive audit console
│   │   └── layout.tsx
│   ├── components/lacuna/                # 17 interactive console section views
│   └── lib/lacuna/                       # Deterministic TypeScript audit & conformal engine
├── prisma/
│   └── schema.prisma                     # 17 Prisma models (Multi-tenant auth, Billing, Audit trail)
├── download/
│   ├── lacuna-amr/                       # Complete standalone Python package (Apache-2.0, CLI + tests)
│   └── LACUNA-Market-Readiness-Roadmap.pdf # Comprehensive product & market readiness roadmap
├── research/
│   ├── 01-vecura-integration.md          # Architecture & value loop for Vecura platform integration
│   ├── 02-market-and-competitors.md      # $6.6B+ market sizing, competitor analysis & whitespace
│   └── 03-product-decisions.md           # Binding product decisions & build workflow
├── protocol/
│   └── DEVIATIONS.md                     # Time-stamped scientific deviation ledger (D-001..D-048)
├── gates/                                # Pre-registered scientific gates (G0–G11) & evidence
├── deploy/                               # Docker Compose, Caddyfile, and PostgreSQL 17 migration runbook
└── package.json                          # Dependencies & build scripts (Next.js 16, React 19)
```

---

## 🔌 Vecura Platform Integration

LACUNA is architected to seamlessly embed into **Vecura 2.0 (Nanyang Biologics / NYB.AI)** discovery agent workflows:

1. **MCP Tool Server (`POST /api/mcp`):**
   - Supports standard MCP protocols: `initialize`, `tools/list`, and `tools/call`.
   - Exposes 5 core tools: `audit_dataset`, `predict_resistance`, `validate_splits`, `generate_report`, `get_manifest`.
   - Enforces API key authentication and credit tracking.
2. **OpenAPI 3.1 Contract (`GET /api/openapi.json`):**
   - Machine-readable specification for instant tool registration in agent orchestrators.
3. **Bi-directional Webhooks:**
   - Inbound receiver (`/api/webhooks/vecura`) verifies `sha256=<HMAC>` signatures.
   - Outbound dispatcher sends signed status events (`audit.completed`, `report.ready`) back into Vecura workflow states.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** $\ge 20$ or **Bun** $\ge 1.1$
- (Optional) **Python** $\ge 3.11$ for running the standalone `download/lacuna-amr` CLI

### 2. Installation & Setup
```bash
# Install dependencies
bun install
# or: npm install

# Initialize database schema (SQLite dev DB)
bun run db:push
# or: npx prisma db push
```

### 3. Run the Development Server
```bash
bun run dev
# or: npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to access the interactive audit console.

### 4. Running the Standalone Python Package
```bash
cd download/lacuna-amr
pip install -e .

# Run CLI commands
lacuna audit-dataset --help
lacuna predict --help
lacuna validate --help
```

---

## 🔒 License & Regulatory Posture

* **Code License:** Apache-2.0.
* **Feature Determinants:** Public domain (NCBI AMRFinderPlus).
* **Clinical Boundary:** **Research Use Only (RUO).** Not for clinical diagnosis or treatment decisions.
