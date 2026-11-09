# LACUNA-AMR — deliverables

- `lacuna-amr/` — the complete research + product repository (Apache-2.0):
  - `src/lacuna/` Python package (audit-dataset / train / predict / validate / report / manifest), `tests/`
  - `protocol/`, `gates/` (G0–G11 evidence), `results/`, `data/` (frozen pilot cohort + tables)
  - `commercial/` — SKU sheets, regulatory memo, **MARKET_RESEARCH.md** (2026-11-04 cited research basis for the commercial layer)
  - `paper/` (manuscript + DOME/TRIPOD+AI checklists), `service/`, `workflow/`, `release/`
- Web console (this session's app): full-stack Next.js + Prisma console at the preview URL —
  13 sections incl. Workflow, Batch, Market, Compliance; open core remains the Python package above.
- Deviations for the commercial web layer: `lacuna-amr/protocol/DEVIATIONS.md` D-022…D-029.

## 2026-11-09 - v0.4.0 integration layer + market-readiness roadmap

- `LACUNA-Market-Readiness-Roadmap.pdf` - the step-by-step path from the verified v0.4.0
  platform to a market-ready AMR trust layer (current state, market positioning with
  cited figures, the Vecura integration plan, five delivery phases with exit criteria,
  KPIs, risk register, and this week's actions). `LACUNA-Roadmap-Cover.html` is the
  editable cover source.
- Web console v0.4.0 (preview URL): new Integrations section, enforced /api/v1 REST
  surface with OpenAPI 3.1 (/api/openapi.json), MCP tool server (/api/mcp),
  HMAC-signed webhooks, API usage metering, and a cited 2026-11-09 market refresh.
- Research notes 01-03 (Vecura integration, market/competitors, product decisions)
  live in the web repository research/ folder; deviations D-030..D-038 in
  protocol/DEVIATIONS.md.
