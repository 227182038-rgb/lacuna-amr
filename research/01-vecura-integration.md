# Research Note 01 — Vecura Platform & Integration Architecture

*Date: 2026-11-09 · Access dates for all URLs: 2026-11-09 · Rule: no memory-facts; claims below carry sources or are marked ASSUMPTION.*

## 1. What Vecura is (verified)

| Attribute | Finding | Source |
|---|---|---|
| Company | Vecura — AI platform for life-science discovery, by **Nanyang Biologics (NYB.AI)**, Singapore; private; partnerships incl. Equinix, HPE, NVIDIA | gosset.ai/companies/vecura; nyb.group/ai-first-discovery-platform |
| Product | Agentic-AI platform connecting **scientific models, biological data, molecular analysis tools, GPU compute** into single workflows | Vecura site; LinkedIn @vecuraplatform |
| Vecura 2.0 (2026-06-01) | "moves beyond tool access toward **workflow execution**"; agentic layer defines and runs multi-step research workflows | NYB.AI launch coverage |
| Integration model | Users can "**connect external APIs with pre-integrated models and tools**", "**bring their own models**", refine stages based on outputs | Vecura "How Vecura Works" page |
| Target users | Life-science research teams; earlier-stage R&D; partnering/licensing | gosset.ai preview |

**Conclusion:** Vecura is an *agentic orchestration platform*, not a data warehouse. Third parties plug in as **callable tools/services inside agent workflows**. The natural integration surface for LACUNA is therefore: (1) a documented public REST API, (2) an **MCP (Model Context Protocol) tool server** so Vecura agents can discover and invoke LACUNA natively, (3) **webhooks** to push results back into Vecura workflow state.

## 2. Integration architecture (decision)

```
Vecura agent workflow
  └─ step: "audit AMR dataset / predict resistance with guarantees"
       ├─ discovery: LACUNA MCP server (tools: audit_dataset, predict_conformal,
       │             validate_model, compliance_report, manifest)
       ├─ transport: HTTPS REST  /api/v1/*  (OpenAPI 3.1 spec served at /api/openapi.json)
       ├─ auth:     bearer API key issued per organization in LACUNA web console
       └─ callbacks: webhook events (audit.completed, report.ready) → Vecura workflow state
```

**LACUNA side (what we build):**
1. `GET /api/openapi.json` — machine-readable contract for Vecura tool registration.
2. MCP server (stdio + HTTP transport) exposing the 5 core capabilities as tools with JSON schemas.
3. `/api/v1/integrations/vecura` — connector config: endpoint URL, API key, event subscriptions, sync status, last webhook delivery, replay.
4. Webhook receiver `/api/v1/webhooks/vecura` — accepts Vecura workflow events (dataset.ready, workflow.started) with HMAC signature verification.
5. "Vecura sync" panel in the web console: test connection, map workflow outputs → LACUNA audit runs, export audit reports back.

**Value loop for Vecura users (drug-discovery context):** when a Vecura workflow evaluates natural-product hits or targets, LACUNA contributes the *resistance-lens*: audit of the AMR datasets feeding target/compound evaluation, conformal (guaranteed-coverage) resistance predictions, and identification of conserved vs. divergent determinants across resistant lineages — so downstream prioritization is not built on leaky or overconfident data. *(Framing of the value loop is our design; Vecura's exact workflow semantics are not public — ASSUMPTION, documented in DEVIATIONS.md.)*

## 3. Honesty guardrails (integrity rule R1)

- We do **not** claim a formal Vecura partnership. Integration is built to *published patterns* (REST + OpenAPI + MCP + webhooks) and labeled "Vecura-ready connector" until joint testing.
- No Vecura-internal API details are claimed or emulated; the connector is generic over any OpenAPI/MCP-capable agent platform, with Vecura-specific presets.
