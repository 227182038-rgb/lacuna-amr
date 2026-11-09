// OpenAPI 3.1 specification for the LACUNA-AMR versioned API surface
// (/api/v1/*), served at GET /api/openapi.json. Every operation carries the
// research-use notice as the x-ruo-notice extension and states its credit
// cost in the description. The MCP server (/api/mcp) exposes the same five
// operations as tools and is documented in info.description.

import { DRUGS, RUO_NOTICE } from "./data";
import { V1_CREDIT_COSTS } from "./v1";

type Schema = Record<string, unknown>;

const ErrorSchema: Schema = {
  type: "object",
  properties: { error: { type: "string" } },
  required: ["error"],
};

function envelope(dataSchema: Schema, withRunId: boolean): Schema {
  return {
    type: "object",
    properties: {
      data: dataSchema,
      ...(withRunId ? { runId: { type: ["string", "null"], description: "Id of the persisted run record, where applicable." } } : {}),
      creditsRemaining: { type: "integer", description: "Credits left on the key after this call was charged." },
      notice: { type: "string", const: RUO_NOTICE },
    },
    required: ["data", "creditsRemaining", "notice"],
  };
}

const drugEnum: Schema = { type: "string", enum: [...DRUGS] };

const PredictionOutputSchema: Schema = {
  type: "object",
  description: "Deterministic engine output for one isolate / toggle profile.",
  properties: {
    drug: { type: "string" },
    isolate: { type: ["string", "null"], description: "Biosample accession when a cohort isolate was scored." },
    determinants: { type: "array", items: { type: "string" }, description: "Detected resistance determinants." },
    m0Call: { type: "string", enum: ["S", "R"], description: "M0 catalogue-rule call." },
    modelType: { type: "string", enum: ["M0", "M1", "M2"] },
    pS: { type: "number" },
    pR: { type: "number", description: "Calibrated probability of resistance (M1/M2)." },
    call: { type: "string", enum: ["S", "R"], description: "Thresholded call." },
    conformalSetMondrian: { type: "string", enum: ["S", "R", "S+R", "ABSTAIN"], description: "Mondrian conformal prediction set." },
    conformalSetMarginal: { type: "string", enum: ["S", "R", "S+R", "ABSTAIN"] },
    threshold: { type: "number" },
    ruoNotice: { type: "string" },
  },
  required: ["drug", "determinants", "m0Call", "modelType", "pS", "pR", "call", "conformalSetMondrian", "conformalSetMarginal", "threshold"],
};

const DgCheckSchema: Schema = {
  type: "object",
  properties: {
    key: { type: "string" },
    label: { type: "string" },
    value: { type: "integer" },
    threshold: { type: "integer" },
    pass: { type: "boolean" },
  },
};

const DrugAuditResultSchema: Schema = {
  type: "object",
  properties: {
    drug: { type: "string" },
    nRows: { type: "integer" },
    nIsolates: { type: "integer" },
    nBioprojects: { type: "integer" },
    standards: { type: "object", additionalProperties: { type: "integer" } },
    submitterPhenotypes: { type: "object", additionalProperties: { type: "integer" } },
    labels: { type: "object", additionalProperties: { type: "integer" } },
    nLabelledSR: { type: "integer" },
    nR: { type: "integer" },
    nS: { type: "integer" },
    nI: { type: "integer" },
    nCensored: { type: "integer" },
    dgChecks: { type: "array", items: DgCheckSchema },
    verdict: { type: "string", enum: ["PASS", "FAIL"] },
  },
  required: ["drug", "verdict"],
};

const AuditOutputSchema: Schema = {
  type: "object",
  properties: {
    tool: { type: "string" },
    version: { type: "string" },
    notice: { type: "string" },
    source: { type: "string" },
    nRows: { type: "integer" },
    thresholds: {
      type: "object",
      properties: {
        minIsolates: { type: "integer" },
        minR: { type: "integer" },
        minS: { type: "integer" },
        minBioprojects: { type: "integer" },
      },
    },
    drugs: { type: "array", items: DrugAuditResultSchema },
    overallVerdict: { type: "string", enum: ["PASS", "FAIL"] },
  },
  required: ["drugs", "overallVerdict"],
};

const SplitAuditSchema: Schema = {
  type: "object",
  description: "G3-style leakage audit of the sealed splits for one drug.",
  properties: {
    drug: { type: "string" },
    problems: {
      type: "array",
      items: {
        type: "object",
        properties: { split: { type: "string" }, kind: { type: "string" }, detail: { type: "string" } },
      },
    },
    verdict: { type: "string", enum: ["PASS", "FAIL"] },
  },
  required: ["drug", "problems", "verdict"],
};

const ReportDataSchema: Schema = {
  type: "object",
  properties: {
    notice: { type: "string" },
    finalReport: { type: "string", description: "Markdown final report." },
    modelCard: { type: "string", description: "Model card (markdown)." },
    cliReference: { type: "string", description: "CLI reference (markdown)." },
  },
  required: ["notice", "finalReport", "modelCard", "cliReference"],
};

const ManifestDataSchema: Schema = {
  type: "object",
  properties: {
    notice: { type: "string" },
    reproduction: { type: "object", description: "Seeds, protocol hash, pinned external tools." },
    splits: { type: "object", description: "Sealed-splits manifest (UTC date + sha256)." },
    breakpointsProvenance: { type: "object", description: "EUCAST breakpoints source provenance (never bundled)." },
    references: { type: "array", items: { type: "object" }, description: "DOI reference verification rows." },
    sbom: { type: "object", description: "SPDX SBOM summary." },
    pythonLock: { type: "array", items: { type: "string" } },
    claimsLedger: { type: "array", items: { type: "object" } },
  },
  required: ["notice", "reproduction", "splits", "breakpointsProvenance", "references", "sbom"],
};

function responses(okSchema: Schema, withRunId: boolean) {
  return {
    200: { description: "Success (metered envelope).", content: { "application/json": { schema: envelope(okSchema, withRunId) } } },
    400: { description: "Invalid request body / validation error.", content: { "application/json": { schema: ErrorSchema } } },
    401: { description: "Missing, invalid or revoked x-api-key.", content: { "application/json": { schema: ErrorSchema } } },
    402: { description: "Key has no credits remaining.", content: { "application/json": { schema: ErrorSchema } } },
    403: { description: "Key scope insufficient for this call.", content: { "application/json": { schema: ErrorSchema } } },
  };
}

const SECURITY = [{ ApiKeyAuth: [] }];

export function buildOpenApiSpec(): Record<string, unknown> {
  return {
    openapi: "3.1.0",
    info: {
      title: "LACUNA-AMR API",
      version: "0.4.0",
      summary: "Versioned, API-key-authenticated, credit-metered surface of the LACUNA-AMR research-use-only AMR dataset-audit and conformal-prediction console.",
      description:
        "All /api/v1/* operations require the x-api-key header and are metered per call (predict 1 credit, audit-dataset 5, validate 5, report 1, manifest 0). " +
        "Keys are issued in the console (Compliance section, POST /api/keys) with scope 'read' or 'read+predict' and 100 demo credits. " +
        "The same five operations are exposed as tools over JSON-RPC 2.0 MCP at POST /api/mcp (tools: audit_dataset, predict_resistance, validate_splits, generate_report, get_manifest). " +
        RUO_NOTICE,
      license: { name: "Apache-2.0" },
    },
    servers: [{ url: "/" }],
    security: SECURITY,
    tags: [
      { name: "predict", description: "Conformal resistance prediction." },
      { name: "audit", description: "Dataset and split auditing." },
      { name: "reporting", description: "Reports and manifests." },
    ],
    paths: {
      "/api/v1/predict": {
        post: {
          tags: ["predict"],
          summary: "Predict resistance for one isolate or feature-toggle profile",
          description: `Runs the deterministic per-drug engine and returns determinants, the M0 catalogue call, a calibrated p(R), a thresholded call and the Mondrian conformal prediction set. Costs ${V1_CREDIT_COSTS.predict} credit. Requires scope 'read+predict'.`,
          operationId: "predictResistance",
          security: SECURITY,
          "x-ruo-notice": RUO_NOTICE,
          "x-credit-cost": V1_CREDIT_COSTS.predict,
          "x-required-scope": "read+predict",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    drug: drugEnum,
                    isolate: { type: "string", description: "Biosample accession of a pilot-cohort isolate (alternative to toggles)." },
                    toggles: { type: "object", description: "Feature toggles {feature: 0|1} (alternative to isolate).", additionalProperties: { type: "integer", enum: [0, 1] } },
                    modelType: { type: "string", enum: ["M0", "M1", "M2"], description: "Model tier; default M1." },
                  },
                  required: ["drug"],
                },
              },
            },
          },
          responses: responses({ type: "object", properties: { prediction: PredictionOutputSchema }, required: ["prediction"] }, true),
        },
      },
      "/api/v1/audit-dataset": {
        post: {
          tags: ["audit"],
          summary: "Audit a dataset (label heterogeneity + data gates)",
          description: `Runs the label-heterogeneity audit with data-gate verdicts either on the bundled pilot AST table / cohort or on a pasted AST table. Costs ${V1_CREDIT_COSTS["audit-dataset"]} credits. Requires scope 'read'.`,
          operationId: "auditDataset",
          security: SECURITY,
          "x-ruo-notice": RUO_NOTICE,
          "x-credit-cost": V1_CREDIT_COSTS["audit-dataset"],
          "x-required-scope": "read",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
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
              },
            },
          },
          responses: responses(
            {
              type: "object",
              properties: {
                audit: AuditOutputSchema,
                savedRuns: { type: "array", items: { type: "object", properties: { id: { type: "string" }, drug: { type: "string" }, verdict: { type: "string" } } } },
              },
              required: ["audit", "savedRuns"],
            },
            false
          ),
        },
      },
      "/api/v1/validate": {
        post: {
          tags: ["audit"],
          summary: "Re-run the G3-style split-leakage audit for one drug",
          description: `Audits the sealed pilot splits (isolate + dedup-cluster overlap assertions on every train/test boundary) and returns problems with a PASS/FAIL verdict. Costs ${V1_CREDIT_COSTS.validate} credits. Requires scope 'read'.`,
          operationId: "validateSplits",
          security: SECURITY,
          "x-ruo-notice": RUO_NOTICE,
          "x-credit-cost": V1_CREDIT_COSTS.validate,
          "x-required-scope": "read",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { drug: drugEnum },
                  required: ["drug"],
                },
              },
            },
          },
          responses: responses({ type: "object", properties: { audit: SplitAuditSchema }, required: ["audit"] }, true),
        },
      },
      "/api/v1/report": {
        post: {
          tags: ["reporting"],
          summary: "Return the final report, model card and CLI reference",
          description: `Returns the pilot's final report (markdown), model card and CLI reference. Costs ${V1_CREDIT_COSTS.report} credit. Requires scope 'read'.`,
          operationId: "generateReport",
          security: SECURITY,
          "x-ruo-notice": RUO_NOTICE,
          "x-credit-cost": V1_CREDIT_COSTS.report,
          "x-required-scope": "read",
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: { type: "object", properties: {}, description: "Empty object; no parameters." },
              },
            },
          },
          responses: responses(ReportDataSchema, false),
        },
      },
      "/api/v1/manifest": {
        get: {
          tags: ["reporting"],
          summary: "Return the reproduction manifest",
          description: `Seeds, sealed-splits hashes, breakpoints provenance, reference verification, SBOM and claims ledger. Costs ${V1_CREDIT_COSTS.manifest} credits (free). Requires scope 'read'.`,
          operationId: "getManifest",
          security: SECURITY,
          "x-ruo-notice": RUO_NOTICE,
          "x-credit-cost": V1_CREDIT_COSTS.manifest,
          "x-required-scope": "read",
          responses: responses(ManifestDataSchema, false),
        },
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Key issued via the console (POST /api/keys). Scopes: 'read' or 'read+predict'; 100 demo credits per key.",
        },
      },
      schemas: {
        PredictionOutput: PredictionOutputSchema,
        AuditOutput: AuditOutputSchema,
        SplitAudit: SplitAuditSchema,
        Error: ErrorSchema,
      },
    },
  };
}
