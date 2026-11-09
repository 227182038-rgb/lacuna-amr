// POST /api/mcp — Model Context Protocol server (JSON-RPC 2.0, single call or
// array batch). Supported methods:
//   initialize  → protocol info
//   tools/list  → the five LACUNA tools (audit_dataset, predict_resistance,
//                 validate_splits, generate_report, get_manifest)
//   tools/call  → dispatch to the SAME v1 handlers as /api/v1/* (auth via the
//                 x-api-key header on the JSON-RPC POST itself; identical
//                 401/402/403 semantics + credit charges)
// Notifications (requests without an id) get no response (HTTP 204).
// Tool/handler failures come back as JSON-RPC error objects; unknown tools are
// -32602, unknown methods -32601, invalid JSON -32700.

import { corsJson, corsOptions, checkApiAuth, V1_TOOLS } from "@/lib/lacuna/v1";

export const dynamic = "force-dynamic";

interface JsonRpcError {
  code: number;
  message: string;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: unknown;
  result?: unknown;
  error?: JsonRpcError;
}

const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const SERVER_ERROR = -32000;

function rpcResult(id: unknown, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id: unknown, code: number, message: string): JsonRpcResponse {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function hasId(msg: Record<string, unknown>): boolean {
  return "id" in msg;
}

async function handleCall(req: Request, msg: Record<string, unknown>): Promise<JsonRpcResponse | null> {
  const id = msg.id ?? null;
  if (!hasId(msg)) return null; // notification — no response

  const method = msg.method;
  if (typeof method !== "string") {
    return rpcError(id, INVALID_REQUEST, "Invalid Request: 'method' must be a string.");
  }

  if (method === "initialize") {
    return rpcResult(id, {
      protocolVersion: "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: { name: "lacuna-amr", version: "0.4.0" },
    });
  }

  if (method === "tools/list") {
    return rpcResult(id, {
      tools: V1_TOOLS.map((t) => ({
        name: t.name,
        title: t.title,
        description: t.description,
        inputSchema: t.inputSchema,
        annotations: t.annotations,
      })),
    });
  }

  if (method === "tools/call") {
    const params = msg.params;
    if (!isPlainObject(params) || typeof params.name !== "string") {
      return rpcError(id, INVALID_PARAMS, "Invalid params: expected { name: string, arguments?: object }.");
    }
    const tool = V1_TOOLS.find((t) => t.name === params.name);
    if (!tool) {
      return rpcError(id, INVALID_PARAMS, `Unknown tool: ${params.name}`);
    }
    // Same auth + metering as /api/v1/*: the JSON-RPC POST must carry x-api-key.
    const auth = await checkApiAuth(req, tool.scope);
    if (!auth.ok) {
      return rpcError(id, SERVER_ERROR, `HTTP ${auth.status}: ${auth.error}`);
    }
    const args = isPlainObject(params.arguments) ? params.arguments : {};
    const result = await tool.run({ rec: auth.rec, actor: auth.actor }, args, "mcp");
    if (!result.ok) {
      return rpcError(id, SERVER_ERROR, `HTTP ${result.status}: ${result.error}`);
    }
    return rpcResult(id, {
      content: [{ type: "text", text: JSON.stringify(result.envelope) }],
      structuredContent: result.envelope,
    });
  }

  return rpcError(id, METHOD_NOT_FOUND, `Method not found: ${method}`);
}

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await req.text());
  } catch {
    return corsJson(rpcError(null, PARSE_ERROR, "Parse error: invalid JSON."));
  }

  // Batch: process each entry, respond with an array (only for entries that
  // carry an id); an all-notification batch gets no response body.
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return corsJson(rpcError(null, INVALID_REQUEST, "Invalid Request: empty batch."));
    }
    const responses: JsonRpcResponse[] = [];
    for (const entry of parsed) {
      if (!isPlainObject(entry)) {
        responses.push(rpcError(null, INVALID_REQUEST, "Invalid Request."));
        continue;
      }
      const res = await handleCall(req, entry);
      if (res !== null) responses.push(res);
    }
    if (responses.length === 0) return new Response(null, { status: 204 });
    return corsJson(responses);
  }

  if (!isPlainObject(parsed)) {
    return corsJson(rpcError(null, INVALID_REQUEST, "Invalid Request."));
  }

  const response = await handleCall(req, parsed);
  if (response === null) return new Response(null, { status: 204 }); // notification
  return corsJson(response);
}
