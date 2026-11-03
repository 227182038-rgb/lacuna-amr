# LACUNA-AMR — deliverables

- `lacuna-amr/` — the complete research + product repository (Apache-2.0):
  - `src/lacuna/` Python package (audit-dataset / train / predict / validate / report / manifest), `tests/`
  - `protocol/`, `gates/` (G0–G11 evidence), `results/`, `data/` (frozen pilot cohort + tables)
  - `commercial/` — SKU sheets, regulatory memo, **MARKET_RESEARCH.md** (2026-11-04 cited research basis for the commercial layer)
  - `paper/` (manuscript + DOME/TRIPOD+AI checklists), `service/`, `workflow/`, `release/`
- Web console (this session's app): full-stack Next.js + Prisma console at the preview URL —
  13 sections incl. Workflow, Batch, Market, Compliance; open core remains the Python package above.
- Deviations for the commercial web layer: `lacuna-amr/protocol/DEVIATIONS.md` D-022…D-029.
