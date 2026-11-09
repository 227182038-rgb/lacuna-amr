# DEVIATIONS.md — Web-Console Layer (continuation)

Canonical research/product deviation ledger for D-001…D-029: `data/lacuna/DEVIATIONS.md`
(mirrored at `download/lacuna-amr/protocol/DEVIATIONS.md`).

This file continues the ledger for the **web console + integration layer** (v0.3.0 → v0.4.0).
Rule priority: (1) data/claims integrity → (2) license compliance → (3) reproducibility →
(4) scope completeness → (5) speed/polish. Ambiguities resolve conservatively and get an entry here.

---

D-030 | 2026-11-09 | Deep-research refresh (user instruction: "deepresearch … then initiate with optimized workflow"): AMR-surveillance market re-sized from three 2025/2026 sources (Fortune Business Insights; Research&Markets; Spherical Insights — URLs + retrieval dates in `research/02-market-and-competitors.md` and in-app Market tab), Vecura platform identified (Nanyang Biologics / NYB.AI agentic life-science platform) with integration surface decided as REST+OpenAPI+MCP+webhooks. | R2 (no memory facts) — all figures carry live sources. | Research notes 01–03 in `/research`; market figures surfaced in-app only with citations.

D-031 | 2026-11-09 | Vecura integration built to published patterns only (OpenAPI 3.1, JSON-RPC 2.0 MCP, HMAC-signed webhooks). No Vecura-internal API is claimed, reverse-engineered or emulated; connector labeled "Vecura-ready"; no partnership claim anywhere in copy. | R1/R4 — integrate honestly without claiming an agreement that does not exist. | `research/01-vecura-integration.md`; Integrations console section.

D-032 | 2026-11-09 | Versioned programmatic API `/api/v1/*` enforces API keys (scopes: `read`, `read+predict`) with per-call credit charges (predict 1, audit 5, validate 5, report 1, manifest 0), superseding the v0.3.0 demo boundary in D-029 for the v1 surface; legacy console routes remain session-driven. | Market-readiness requires an enforced, versioned, metered API. | Credit ledger on ApiKey; every metered call records `api:<keyPrefix>` entries in the hash-chained AuditLog.

D-033 | 2026-11-09 | MCP server (`POST /api/mcp`, JSON-RPC 2.0: initialize / tools/list / tools/call) exposes the five scientific capabilities as agent-invocable tools; tool calls that consume credits require the same x-api-key header. | Agentic platforms (Vecura-class) discover and invoke tools via MCP; scientific integrity preserved by routing through the identical engine + auth. | Tool results embed the RUO notice; no capability exists only via MCP.

D-034 | 2026-11-09 | Webhook model: outbound events (audit.completed, predict.completed, validate.completed, report.ready) HMAC-SHA256-signed with a per-workspace secret and best-effort (3 s timeout, delivery recorded as WebhookEvent rows, failure never fails the main request); inbound receiver `/api/webhooks/vecura` verifies signature, records verified/rejected events, and takes no scientific action on them. | Honest demo-grade integration: real signing/verification code, recorded delivery attempts, no silent failures. | Outbound network may be blocked in the sandbox — attempts are recorded with status "failed" and the connector UI shows the real outcome.

D-035 | 2026-11-09 | Pricing/positioning stance unchanged from D-024: tiers remain benchmark-cited positioning, "not a price list"; the 2026-11-09 research adds market-size citations but introduces no invented prices. | R2. | Market tab refresh block with URLs + retrieval dates.

D-036 | 2026-11-09 | Breakpoint posture re-affirmed for the web layer: the console's pilot uses the frozen EUCAST v16.1-derived labels from the research repository (`data/lacuna/`); no EUCAST table is bundled in any release archive (D-021 continues to hold); user-paste audits in the console derive labels from user-supplied thresholds only. | R2/license priority. | No breakpoint table file exists under `src/` or `download/`.

D-037 | 2026-11-09 | Synthetic-data rule: the web console contains no synthetic-isolate dataset; all interactive data comes from the frozen real pilot cohort (EXPLORATORY, N=240) or user-pasted tables. (Supersedes the "synthetic demo dataset" idea sketched in `research/03` — the real pilot cohort makes fabrication unnecessary.) | R1 — never fabricate data when real, licensed, frozen data exists. | Cohort/Provenance sections show ledger hashes.

D-038 | 2026-11-09 | Auth boundary for market-ready demo: the console remains single-workspace (no login); API keys are the programmatic identity. Multi-tenant auth + Stripe billing + production Postgres are Phase-1 roadmap items, not silently skipped — they are stated in the roadmap PDF and in-app. | R4 (scope honesty) over R5. | `download/LACUNA-Market-Readiness-Roadmap.pdf`.

D-039 | 2026-11-09 | Final E2E verification found the console's gate-verdict extractor mis-displaying G3 and G5 as PASS. Root cause: the parser read only lines containing "verdict", but those two gates' verdict lines defer to per-item lines ("Verdict: see per-drug lines above (PASS requires zero isolate/dedup-cluster overlap)" / "… (OK requires |ΔAUROC| ≤ 0.01)"), so the per-drug FAIL headings and "-> CHECK" tolerance breaches in the body were never parsed. Fix in `src/lib/lacuna/gates.ts`: an explicit status word directly after the "Verdict:" label is authoritative (so G11's "PASS (corrected after review of the first FAIL)" stays PASS and G1's rejected-organism DG FAILs stay contextual); deferring verdict lines fall back to scanning per-item failure markers (heading "## <drug>: FAIL", "- PROBLEM:" lines, "-> CHECK" breaches). Re-verified against all 12 gate files: G0–G2 PASS, G3 FAIL, G4 PASS, G5 FAIL, G6 PASS, G7 NOT ATTEMPTED, G8–G11 PASS — identical to FINAL_REPORT.md's gate table. Same bug class as D-019 (summary over-reporting PASS). | R1 (data & claims integrity): the console must never disagree with the evidence files. | Display-layer only; no data, splits, models or results were touched. Gates API + section re-checked live after the fix.
