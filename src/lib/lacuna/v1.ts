// LACUNA-AMR v0.4.0 — versioned API layer (/api/v1/*) shared by the REST
// routes and the MCP server (/api/mcp). This module owns:
//   - key authentication + scope enforcement (requireApiAuth)
//   - per-call credit metering (chargeCredits)
//   - CORS handling for the public programmatic surface
//   - signed outbound webhooks (notifyWebhook, HMAC-SHA256)
//   - the five v1 handlers (predict / audit-dataset / validate / report /
//     manifest), which mirror the console routes' validation + engine calls
//     exactly and wrap them in auth + metering.
// The MCP server dispatches tools/call to the SAME handlers below — no engine
// code is duplicated.

import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateKey, sha256, type ApiKeyRec } from "./api-auth";
import { recordAudit } from "./audit-chain";
import { CLI_REFERENCE } from "./cli-reference";
import { buildManifestPayload } from "./manifest-data";
import {
  DRUGS,
  RUO_NOTICE,
  loadAstTable,
  loadCohortTable,
  loadFinalReport,
  loadModelCard,
} from "./data";
import { predict } from "./engine";
import { auditAstRows, DEFAULT_THRESHOLDS, parseUserAst, type AuditThresholds } from "./audit";
import { auditSplits } from "./splits-audit";

// ---------------------------------------------------------------------------
// CORS — the v1 surface (and openapi.json / mcp) is callable cross-origin by
// metered programmatic clients.
// ---------------------------------------------------------------------------

export const V1_CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-api-key, x-lacuna-signature",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function corsJson(body: unknown, status = 200): NextResponse {
  const res = NextResponse.json(body, { status });
  for (const [k, v] of Object.entries(V1_CORS_HEADERS)) res.headers.set(k, v);
  return res;
}

export function corsOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: V1_CORS_HEADERS });
}

// ---------------------------------------------------------------------------
// Auth + metering
// ---------------------------------------------------------------------------

export type ApiScope = "read" | "read+predict";

export interface V1Authed {
  rec: ApiKeyRec;
  actor: string; // "api:<keyPrefix>"
}

export type RequireApiAuthResult =
  | { ok: true; rec: ApiKeyRec; actor: string }
  | { ok: false; response: NextResponse };

export type ApiAuthInfo =
  | { ok: true; rec: ApiKeyRec; actor: string }
  | { ok: false; status: number; error: string };

/**
 * Core key/scope/credit check for the programmatic surface: the x-api-key
 * header is REQUIRED (unlike the console routes, where an absent header means
 * "interactive console"). 401 invalid/revoked/missing, 402 no credits,
 * 403 scope too weak. Returns the error detail so non-HTTP callers (MCP) can
 * surface it.
 */
export async function checkApiAuth(req: Request, needScope: ApiScope): Promise<ApiAuthInfo> {
  if (!req.headers.get("x-api-key")) {
    return { ok: false, status: 401, error: "Missing x-api-key header." };
  }
  const auth = await authenticateKey(req);
  if ("ok" in auth && !auth.ok) {
    return { ok: false, status: auth.status, error: auth.error };
  }
  if (!("ok" in auth) || !auth.ok) {
    return { ok: false, status: 401, error: "Authentication failed." };
  }
  if (needScope === "read+predict" && auth.rec.scope !== "read+predict") {
    return {
      ok: false,
      status: 403,
      error: `Key scope '${auth.rec.scope}' is insufficient — this call requires scope 'read+predict'.`,
    };
  }
  return { ok: true, rec: auth.rec, actor: auth.actor };
}

/**
 * Enforce API-key auth for the v1 surface; returns the authed key or a ready
 * 401/402/403 NextResponse.
 */
export async function requireApiAuth(req: Request, needScope: ApiScope): Promise<RequireApiAuthResult> {
  const info = await checkApiAuth(req, needScope);
  if (!info.ok) return { ok: false, response: corsJson({ error: info.error }, info.status) };
  return info;
}

/** Decrement credits via db.apiKey.update; floor 0, never negative. Returns the new balance. */
export async function chargeCredits(rec: ApiKeyRec, n: number): Promise<number> {
  const remaining = Math.max(0, rec.credits - n);
  try {
    await db.apiKey.update({ where: { id: rec.id }, data: { credits: remaining, lastUsedAt: new Date() } });
  } catch {
    // best-effort metering; the call itself is still answered
  }
  return remaining;
}

// ---------------------------------------------------------------------------
// Signed webhooks (HMAC-SHA256, same scheme for ping tests and events)
// ---------------------------------------------------------------------------

export function signPayload(secret: string, rawBody: string): string {
  return crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
}

/**
 * Deliver a signed outbound webhook for `eventType` to the configured active
 * integration endpoint, if (and only if) the event is subscribed. The real
 * outcome (delivered/failed, HTTP status, error) is recorded as a WebhookEvent
 * row. Never throws — webhook delivery failure must never fail the API call.
 */
export async function notifyWebhook(eventType: string, payload: Record<string, unknown>): Promise<void> {
  try {
    const config = await db.integrationConfig.findFirst({ where: { platform: "vecura", active: true } });
    if (!config || !config.endpointUrl) return;
    let events: unknown;
    try {
      events = JSON.parse(config.events);
    } catch {
      events = [];
    }
    if (!Array.isArray(events) || !events.includes(eventType)) return;

    const body = JSON.stringify({ event: eventType, sentAt: new Date().toISOString(), data: payload });
    const signature = `sha256=${signPayload(config.hmacSecret, body)}`;
    let status = "failed";
    let httpStatus: number | null = null;
    let error: string | null = null;
    try {
      const res = await fetch(config.endpointUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-lacuna-event": eventType,
          "x-lacuna-signature": signature,
        },
        body,
        signal: AbortSignal.timeout(3000),
      });
      httpStatus = res.status;
      if (res.ok) {
        status = "delivered";
      } else {
        status = "failed";
        error = `Endpoint responded HTTP ${res.status}.`;
      }
    } catch (err) {
      status = "failed";
      error = err instanceof Error ? err.message : String(err);
    }
    try {
      await db.webhookEvent.create({
        data: { direction: "outbound", platform: "vecura", eventType, payload: body, status, httpStatus, error },
      });
    } catch {
      // best-effort logging
    }
  } catch {
    // never throw
  }
}

// ---------------------------------------------------------------------------
// Shared v1 handlers (used by /api/v1/* routes AND /api/mcp tools/call)
// ---------------------------------------------------------------------------

export interface V1Envelope {
  data: unknown;
  runId?: string | null;
  creditsRemaining: number;
  notice: string;
}

export type V1Result =
  | { ok: true; status: 200; envelope: V1Envelope }
  | { ok: false; status: number; error: string };

export type CallSurface = "v1" | "mcp";

function v1Err(status: number, error: string): V1Result {
  return { ok: false, status, error };
}

function isPlainObject(b: unknown): b is Record<string, unknown> {
  return typeof b === "object" && b !== null && !Array.isArray(b);
}

// --- predict ----------------------------------------------------------------

interface PredictBody {
  drug?: string;
  isolate?: string;
  toggles?: Record<string, 0 | 1>;
  modelType?: "M0" | "M1" | "M2";
}

/** Mirrors POST /api/predict. Cost 1 credit, scope read+predict, event predict.completed. */
export async function v1Predict(auth: V1Authed, body: unknown, via: CallSurface = "v1"): Promise<V1Result> {
  if (!isPlainObject(body)) return v1Err(400, "Body must be a JSON object.");
  const b = body as PredictBody;
  const drug = b.drug;
  if (!drug || !DRUGS.includes(drug as (typeof DRUGS)[number])) {
    return v1Err(400, `drug must be one of: ${DRUGS.join(", ")}`);
  }
  const modelType = b.modelType ?? "M1";
  if (!["M0", "M1", "M2"].includes(modelType)) {
    return v1Err(400, "modelType must be M0, M1 or M2");
  }
  if (b.isolate === undefined && !b.toggles) {
    return v1Err(400, "Provide either an isolate accession or feature toggles.");
  }

  const out = predict({ drug, isolate: b.isolate, toggles: b.toggles, modelType });
  if ("error" in out) {
    return v1Err(400, out.error);
  }

  let runId: string | null = null;
  try {
    const rec = await db.predictRun.create({
      data: {
        drug: out.drug,
        isolate: out.isolate,
        modelType: out.modelType,
        m0Call: out.m0Call,
        pR: out.pR,
        call: out.call,
        conformalSet: out.conformalSetMondrian,
        input: JSON.stringify({ isolate: b.isolate ?? null, toggles: b.toggles ?? {}, modelType }),
        output: JSON.stringify(out),
      },
    });
    runId = rec.id;
  } catch {
    // best-effort persistence
  }

  await recordAudit(auth.actor, "predict.run", {
    runId,
    drug: out.drug,
    isolate: out.isolate,
    modelType: out.modelType,
    call: out.call,
    pR: Number(out.pR.toFixed(4)),
    conformalSet: out.conformalSetMondrian,
    chargedCredits: 1,
    via,
  });

  const creditsRemaining = await chargeCredits(auth.rec, 1);

  await notifyWebhook("predict.completed", {
    summary: {
      runId,
      drug: out.drug,
      isolate: out.isolate,
      modelType: out.modelType,
      call: out.call,
      pR: Number(out.pR.toFixed(4)),
      conformalSet: out.conformalSetMondrian,
      creditsRemaining,
    },
  });

  return {
    ok: true,
    status: 200,
    envelope: { data: { prediction: out }, runId, creditsRemaining, notice: RUO_NOTICE },
  };
}

// --- audit-dataset ----------------------------------------------------------

interface AuditBody {
  source?: "cohort" | "paste";
  text?: string; // pasted AST table (console contract)
  paste?: string; // alias for text (v1 convenience)
  cohortOnly?: boolean;
  thresholds?: Partial<AuditThresholds>;
}

/** Mirrors POST /api/audit-dataset. Cost 5 credits, scope read, event audit.completed. */
export async function v1AuditDataset(auth: V1Authed, body: unknown, via: CallSurface = "v1"): Promise<V1Result> {
  if (!isPlainObject(body)) return v1Err(400, "Body must be a JSON object.");
  const b = body as AuditBody;

  const thresholds: AuditThresholds = {
    minIsolates: b.thresholds?.minIsolates ?? DEFAULT_THRESHOLDS.minIsolates,
    minR: b.thresholds?.minR ?? DEFAULT_THRESHOLDS.minR,
    minS: b.thresholds?.minS ?? DEFAULT_THRESHOLDS.minS,
    minBioprojects: b.thresholds?.minBioprojects ?? DEFAULT_THRESHOLDS.minBioprojects,
  };

  const pastedText = typeof b.text === "string" ? b.text : typeof b.paste === "string" ? b.paste : "";

  let rows;
  let sourceLabel: string;
  if (b.source === "paste") {
    const parsed = parseUserAst(pastedText);
    if (parsed.errors.length > 0) {
      return v1Err(400, parsed.errors.join(" "));
    }
    rows = parsed.rows;
    sourceLabel = "user-pasted AST table";
  } else {
    let astRows = loadAstTable().rows;
    if (b.cohortOnly) {
      const cohort = new Set(loadCohortTable().map((c) => c.biosample));
      astRows = astRows.filter((r) => cohort.has(r.biosample));
    }
    rows = astRows;
    sourceLabel = b.cohortOnly ? "bundled pilot cohort (240 isolates)" : "bundled pilot AST table (all downloaded isolates)";
  }

  const audit = auditAstRows(rows, thresholds, { source: sourceLabel, version: "0.2.0-web" });

  // Persist one row per audited drug for traceability (best-effort)
  const savedRuns: { id: string; drug: string; verdict: string }[] = [];
  for (const d of audit.drugs) {
    try {
      const rec = await db.auditRun.create({
        data: {
          source: b.source === "paste" ? "paste" : b.cohortOnly ? "cohort" : "ast-table",
          drug: d.drug,
          verdict: d.verdict,
          nLabelled: d.nLabelledSR,
          summary: `S=${d.nS} R=${d.nR} I=${d.nI} censored=${d.nCensored} — ${d.verdict}`,
          input: JSON.stringify({ source: sourceLabel, thresholds, nRows: rows.length }),
          results: JSON.stringify(d),
        },
      });
      savedRuns.push({ id: rec.id, drug: d.drug, verdict: d.verdict });
    } catch {
      // DB persistence is best-effort; the audit result is still returned
    }
  }

  const sourceKey = b.source === "paste" ? "paste" : b.cohortOnly ? "cohort" : "ast-table";
  await recordAudit(auth.actor, "audit-dataset.run", {
    source: sourceKey,
    nDrugs: audit.drugs.length,
    nRows: rows.length,
    verdicts: audit.drugs.map((d) => `${d.drug}:${d.verdict}`).join(" "),
    chargedCredits: 5,
    via,
  });

  const creditsRemaining = await chargeCredits(auth.rec, 5);

  await notifyWebhook("audit.completed", {
    summary: {
      source: sourceKey,
      nDrugs: audit.drugs.length,
      nRows: rows.length,
      overallVerdict: audit.overallVerdict,
      creditsRemaining,
    },
  });

  return {
    ok: true,
    status: 200,
    envelope: { data: { audit, savedRuns }, creditsRemaining, notice: RUO_NOTICE },
  };
}

// --- validate ---------------------------------------------------------------

interface ValidateBody {
  drug?: string;
}

/** Mirrors POST /api/validate. Cost 5 credits, scope read, event validate.completed. */
export async function v1Validate(auth: V1Authed, body: unknown, via: CallSurface = "v1"): Promise<V1Result> {
  if (!isPlainObject(body)) return v1Err(400, "Body must be a JSON object.");
  const b = body as ValidateBody;
  const drug = b.drug;
  if (!drug || !DRUGS.includes(drug as (typeof DRUGS)[number])) {
    return v1Err(400, `drug must be one of: ${DRUGS.join(", ")}`);
  }

  const result = auditSplits(drug as (typeof DRUGS)[number]);

  let runId: string | null = null;
  try {
    const rec = await db.validateRun.create({
      data: {
        drug: result.drug,
        problems: result.problems.length,
        verdict: result.verdict,
        results: JSON.stringify(result),
      },
    });
    runId = rec.id;
  } catch {
    // best-effort
  }

  await recordAudit(auth.actor, "validate.run", {
    runId,
    drug: result.drug,
    problems: result.problems.length,
    verdict: result.verdict,
    chargedCredits: 5,
    via,
  });

  const creditsRemaining = await chargeCredits(auth.rec, 5);

  await notifyWebhook("validate.completed", {
    summary: {
      runId,
      drug: result.drug,
      problems: result.problems.length,
      verdict: result.verdict,
      creditsRemaining,
    },
  });

  return {
    ok: true,
    status: 200,
    envelope: { data: { audit: result }, runId, creditsRemaining, notice: RUO_NOTICE },
  };
}

// --- report -----------------------------------------------------------------

/** Mirrors GET /api/report. Cost 1 credit, scope read, event report.ready. */
export async function v1Report(auth: V1Authed, _body: unknown, via: CallSurface = "v1"): Promise<V1Result> {
  const data = {
    notice: RUO_NOTICE,
    finalReport: loadFinalReport(),
    modelCard: loadModelCard(),
    cliReference: CLI_REFERENCE,
  };

  await recordAudit(auth.actor, "report.run", { chargedCredits: 1, via });

  const creditsRemaining = await chargeCredits(auth.rec, 1);

  await notifyWebhook("report.ready", {
    summary: { generatedAt: new Date().toISOString(), creditsRemaining },
  });

  return { ok: true, status: 200, envelope: { data, creditsRemaining, notice: RUO_NOTICE } };
}

// --- manifest ---------------------------------------------------------------

/** Mirrors GET /api/manifest. Cost 0 credits, scope read. */
export async function v1Manifest(auth: V1Authed, _body: unknown, via: CallSurface = "v1"): Promise<V1Result> {
  const data = buildManifestPayload();

  await recordAudit(auth.actor, "manifest.read", { chargedCredits: 0, via });

  const creditsRemaining = await chargeCredits(auth.rec, 0);

  return { ok: true, status: 200, envelope: { data, creditsRemaining, notice: RUO_NOTICE } };
}

// ---------------------------------------------------------------------------
// Operation metadata (shared by /api/openapi.json and the MCP tool list) +
// MCP tool registry
// ---------------------------------------------------------------------------

export const V1_CREDIT_COSTS = {
  predict: 1,
  "audit-dataset": 5,
  validate: 5,
  report: 1,
  manifest: 0,
} as const;

export interface V1ToolSpec {
  name: string; // MCP tool name
  title: string;
  description: string;
  scope: ApiScope;
  cost: number;
  inputSchema: Record<string, unknown>;
  annotations: Record<string, unknown>;
  run: (auth: V1Authed, args: unknown, via: CallSurface) => Promise<V1Result>;
}

export const V1_TOOLS: V1ToolSpec[] = [
  {
    name: "audit_dataset",
    title: "Audit dataset (label heterogeneity + data gates)",
    description:
      "Run the label-heterogeneity and data-gate audit on the bundled pilot AST table/cohort or a pasted AST table (TSV/CSV with columns: biosample, drug, label_eucast, bioproject, standards, submitter_phenotypes, year, country, source). Returns per-drug distributions and PASS/FAIL data-gate verdicts. Costs 5 credits, scope 'read'. RESEARCH USE ONLY — not for clinical decision-making.",
    scope: "read",
    cost: V1_CREDIT_COSTS["audit-dataset"],
    inputSchema: {
      type: "object",
      properties: {
        source: { type: "string", enum: ["cohort", "paste"], description: "'cohort' audits the bundled pilot data; 'paste' audits the table supplied in text/paste." },
        text: { type: "string", description: "Pasted AST table (required when source=paste)." },
        paste: { type: "string", description: "Alias for text." },
        cohortOnly: { type: "boolean", description: "Restrict the bundled table to the 240-isolate pilot cohort (source=cohort only)." },
        thresholds: {
          type: "object",
          description: "Optional data-gate thresholds (defaults: minIsolates 800, minR 100, minS 100, minBioprojects 5).",
          properties: {
            minIsolates: { type: "integer" },
            minR: { type: "integer" },
            minS: { type: "integer" },
            minBioprojects: { type: "integer" },
          },
        },
      },
      required: ["source"],
    },
    annotations: { title: "Audit dataset", readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    run: v1AuditDataset,
  },
  {
    name: "predict_resistance",
    title: "Predict resistance (calibrated p(R) + conformal set)",
    description:
      "Score one isolate or a feature-toggle profile against the per-drug engine: determinant list, M0 catalogue call, calibrated p(R), thresholded call and Mondrian conformal prediction set (S/R/S+R/ABSTAIN). Costs 1 credit, scope 'read+predict'. RESEARCH USE ONLY — not for clinical decision-making.",
    scope: "read+predict",
    cost: V1_CREDIT_COSTS.predict,
    inputSchema: {
      type: "object",
      properties: {
        drug: { type: "string", enum: [...DRUGS], description: "Drug to score." },
        isolate: { type: "string", description: "Biosample accession of a pilot-cohort isolate (alternative to toggles)." },
        toggles: { type: "object", description: "Feature toggles {feature: 0|1} (alternative to isolate).", additionalProperties: { type: "integer", enum: [0, 1] } },
        modelType: { type: "string", enum: ["M0", "M1", "M2"], description: "Model tier; default M1." },
      },
      required: ["drug"],
    },
    annotations: { title: "Predict resistance", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    run: v1Predict,
  },
  {
    name: "validate_splits",
    title: "Validate splits (G3-style leakage audit)",
    description:
      "Re-run the split-leakage auditor on the sealed pilot splits for one drug: isolate and dedup-cluster overlap assertions on every train/test boundary, with a PASS/FAIL verdict. Costs 5 credits, scope 'read'. RESEARCH USE ONLY — not for clinical decision-making.",
    scope: "read",
    cost: V1_CREDIT_COSTS.validate,
    inputSchema: {
      type: "object",
      properties: {
        drug: { type: "string", enum: [...DRUGS], description: "Drug whose sealed splits to audit." },
      },
      required: ["drug"],
    },
    annotations: { title: "Validate splits", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    run: v1Validate,
  },
  {
    name: "generate_report",
    title: "Generate report (final report + model card + CLI reference)",
    description:
      "Return the pilot's final report, model card and CLI reference text. Costs 1 credit, scope 'read'. RESEARCH USE ONLY — not for clinical decision-making.",
    scope: "read",
    cost: V1_CREDIT_COSTS.report,
    inputSchema: { type: "object", properties: {} },
    annotations: { title: "Generate report", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    run: v1Report,
  },
  {
    name: "get_manifest",
    title: "Get manifest (reproduction, SBOM, references, claims ledger)",
    description:
      "Return the reproduction manifest: seeds, sealed splits hashes, breakpoints provenance, reference verification, SBOM and claims ledger. Costs 0 credits, scope 'read'. RESEARCH USE ONLY — not for clinical decision-making.",
    scope: "read",
    cost: V1_CREDIT_COSTS.manifest,
    inputSchema: { type: "object", properties: {} },
    annotations: { title: "Get manifest", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    run: v1Manifest,
  },
];
