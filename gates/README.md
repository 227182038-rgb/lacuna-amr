# Gates — executed evidence and this session's web-layer checks

## Research gates G0–G11 (executed 2026-11-01, re-audited in v0.2.0)

Evidence files with real verdicts live at `data/lacuna/gates/G0.md … G11.md`
(mirrored in `download/lacuna-amr/gates/`). Headline verdicts:

| Gate | Verdict | Note |
|---|---|---|
| G0 env, G1 prior-art/protocol, G2 acquisition, G4 features | PASS | |
| G3 split leakage | **FAIL** (documented, honest) | clonal overlap in sealed S0/S2/S3 — D-019; v0.2.0 ships clone-aware splits |
| G5 fail-closed phase B | **FAIL** (gated, correct behavior) | phase B blocked as designed |
| G6, G7, G8, G9, G10, G11 | PASS | conformal validity, census, reproducibility, SBOM, red-team, parity |

## Web-layer verification gates (v0.4.0, this session)

New checks introduced with the integration/API layer. Evidence written to `gates/evidence/` when run.

| ID | Check | Status |
|---|---|---|
| W1 | `/api/openapi.json` serves a valid OpenAPI 3.1 document covering all `/api/v1/*` routes | to run |
| W2 | `/api/v1/predict` returns 401 without key, 200 with key + scope `read+predict`, charges credits, writes AuditLog | to run |
| W3 | `/api/mcp` answers initialize / tools/list / tools/call (JSON-RPC 2.0); tools/call reuses v1 auth + engine | to run |
| W4 | Inbound webhook `/api/webhooks/vecura`: valid HMAC → 200 + "verified" row; invalid → 401 + "rejected" row | to run |
| W5 | Outbound dispatcher records WebhookEvent rows with real HTTP outcome (delivered/failed), never throws into the main request | to run |
| W6 | All shipped marketing/integration copy passes the banned-claims list (no partnership/clinical/performance claims) | to run |
