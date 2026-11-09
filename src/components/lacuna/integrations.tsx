"use client";

// LACUNA-AMR v0.4.0 — Integrations section: versioned REST API + OpenAPI 3.1 +
// JSON-RPC MCP + HMAC-signed webhooks, with the Vecura-class platform
// connector configuration. Research-use-only console.

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, ExternalLink, KeyRound, Loader2, Plug, RefreshCw, Save, Send, ShieldCheck, Terminal, Webhook } from "lucide-react";
import { ErrorBox, LoadingBlock, SectionHeader } from "./ui-bits";

// --------------------------------------------------------------------------
// Types (mirror GET /api/integrations/vecura)
// --------------------------------------------------------------------------

interface VecuraConfig {
  id: string;
  platform: string;
  endpointUrl: string | null;
  hmacSecretMasked: string;
  events: string[];
  active: boolean;
  lastTestedAt: string | null;
  lastTestStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WebhookEventRow {
  id: string;
  direction: "outbound" | "inbound" | string;
  eventType: string;
  status: "verified" | "rejected" | "delivered" | "failed" | string;
  httpStatus: number | null;
  error: string | null;
  createdAt: string;
}

interface UsageRow {
  actor: string;
  action: string;
  count: number;
  lastAt: string;
}

interface IntegrationsData {
  config: VecuraConfig | null;
  events: WebhookEventRow[];
  usage: UsageRow[];
}

// --------------------------------------------------------------------------
// Vecura sources (cited footnote, market-research format)
// --------------------------------------------------------------------------

const VECURA_SOURCES = [
  {
    id: "NYB-AI-PLATFORM",
    title: "Nanyang Biologics — AI-first discovery platform (Vecura)",
    url: "https://www.nyb.group/ai-first-discovery-platform",
    retrieved: "2026-11-09",
  },
  {
    id: "GOSSET-VECURA",
    title: "Gosset — Vecura company profile (agentic AI life-science platform, Nanyang Biologics / NYB.AI, Singapore)",
    url: "https://gosset.ai/companies/vecura",
    retrieved: "2026-11-09",
  },
];

const SUBSCRIBABLE_EVENTS = ["audit.completed", "predict.completed", "validate.completed", "report.ready"] as const;

const CREDIT_COSTS: { endpoint: string; tool: string; cost: number; scope: string }[] = [
  { endpoint: "POST /api/v1/predict", tool: "predict_resistance", cost: 1, scope: "read+predict" },
  { endpoint: "POST /api/v1/audit-dataset", tool: "audit_dataset", cost: 5, scope: "read" },
  { endpoint: "POST /api/v1/validate", tool: "validate_splits", cost: 5, scope: "read" },
  { endpoint: "POST /api/v1/report", tool: "generate_report", cost: 1, scope: "read" },
  { endpoint: "GET /api/v1/manifest", tool: "get_manifest", cost: 0, scope: "read" },
];

function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "medium" });
  } catch {
    return iso;
  }
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    verified: "border-emerald-800 bg-emerald-950/60 text-emerald-300",
    delivered: "border-emerald-800 bg-emerald-950/60 text-emerald-300",
    rejected: "border-red-800 bg-red-950/60 text-red-300",
    failed: "border-red-800 bg-red-950/60 text-red-300",
  };
  return (
    <Badge variant="outline" className={`font-mono text-[10px] ${styles[status] ?? "border-zinc-700 bg-zinc-900 text-zinc-400"}`}>
      {status}
    </Badge>
  );
}

function copyText(text: string, what: string) {
  navigator.clipboard?.writeText(text);
  toast({ title: "Copied to clipboard", description: what });
}

// --------------------------------------------------------------------------
// Vecura connector card
// --------------------------------------------------------------------------

function VecuraConnectorCard() {
  const [data, setData] = useState<IntegrationsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [endpointUrl, setEndpointUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["predict.completed"]);
  const [secretInput, setSecretInput] = useState("");
  const [rotatedSecret, setRotatedSecret] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [rotating, setRotating] = useState(false);

  const load = useCallback(() => {
    fetch("/api/integrations/vecura")
      .then((r) => r.json())
      .then((d: IntegrationsData) => {
        setData(d);
        if (d.config) {
          setEndpointUrl(d.config.endpointUrl ?? "");
          setEvents(d.config.events.length > 0 ? d.config.events : []);
        }
      })
      .catch(() => setError("Could not load the integration state."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/integrations/vecura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error ?? "Request failed.");
    return d;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await post({
        action: "save",
        endpointUrl: endpointUrl.trim(),
        events,
        ...(secretInput.trim() !== "" ? { hmacSecret: secretInput.trim() } : {}),
      });
      setSecretInput("");
      toast({ title: "Connector saved", description: "Endpoint, subscriptions and signing secret stored." });
      load();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setTesting(true);
    try {
      const d = await post({ action: "test" });
      if (d.ok) {
        toast({ title: `Ping delivered (HTTP ${d.httpStatus})`, description: "The endpoint accepted the signed ping." });
      } else {
        // Honest outcome: a failed ping in a sandboxed network is a real result.
        toast({
          title: "Ping failed",
          description: d.error ?? `Endpoint responded HTTP ${d.httpStatus}.`,
          variant: "destructive",
        });
      }
      load();
    } catch (err) {
      toast({ title: "Test failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
      load();
    } finally {
      setTesting(false);
    }
  };

  const rotate = async () => {
    setRotating(true);
    try {
      const d = await post({ action: "rotate-secret" });
      setRotatedSecret(d.secret);
      toast({ title: "Secret rotated", description: "Copy the new secret now — it is shown only once." });
      load();
    } catch (err) {
      toast({ title: "Rotate failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setRotating(false);
    }
  };

  const toggleEvent = (ev: string, checked: boolean) => {
    setEvents((prev) => (checked ? Array.from(new Set([...prev, ev])) : prev.filter((x) => x !== ev)));
  };

  const config = data?.config ?? null;

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Plug className="h-4 w-4 text-emerald-500" />
          <CardTitle className="text-base">Vecura connector — outbound webhook integration</CardTitle>
        </div>
        <CardDescription>
          Configure where LACUNA posts HMAC-SHA256-signed events (predict.completed, audit.completed, validate.completed,
          report.ready). Each delivery is signed with the shared secret as{" "}
          <code className="rounded bg-zinc-800/80 px-1 font-mono text-[11px] text-emerald-300">
            x-lacuna-signature: sha256=&lt;HMAC(secret, rawBody)&gt;
          </code>{" "}
          and every attempt — delivered or failed — is logged below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cited intro (market-research footnote format) */}
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Vecura is an agentic-AI life-science platform by Nanyang Biologics / NYB.AI (Singapore) —{" "}
          {VECURA_SOURCES.map((s, i) => (
            <span key={s.id}>
              {i > 0 ? " · " : ""}
              <a href={s.url} target="_blank" rel="noreferrer noopener" className="font-mono text-emerald-400 underline underline-offset-2">
                {s.id}
              </a>{" "}
              <span className="font-mono text-[10px] text-zinc-600">(retrieved {s.retrieved})</span>
            </span>
          ))}
          . This console ships the standards-based connector surface any Vecura-class platform can call.
        </p>

        <form onSubmit={save} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="vecura-endpoint" className="text-xs text-zinc-500">
              Endpoint URL (your platform&apos;s webhook receiver)
            </Label>
            <Input
              id="vecura-endpoint"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              placeholder="https://your-platform.example/hooks/lacuna"
              className="bg-zinc-950 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">Event subscriptions</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {SUBSCRIBABLE_EVENTS.map((ev) => (
                <label
                  key={ev}
                  className="flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs transition-colors hover:border-zinc-700"
                >
                  <Checkbox checked={events.includes(ev)} onCheckedChange={(c) => toggleEvent(ev, c === true)} />
                  <span className="font-mono text-[11px] text-zinc-300">{ev}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vecura-secret" className="text-xs text-zinc-500">
              Signing secret {config ? `(stored: ${config.hmacSecretMasked})` : ""}
            </Label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                id="vecura-secret"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder={config ? "leave blank to keep the stored secret" : "leave blank to generate one"}
                className="min-w-[220px] flex-1 bg-zinc-950 font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                disabled={rotating || !config}
                className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-emerald-800 hover:text-emerald-300"
                onClick={rotate}
              >
                {rotating ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <KeyRound className="mr-2 h-3.5 w-3.5" />}
                Generate / Rotate
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={saving} className="bg-emerald-600 text-zinc-950 hover:bg-emerald-500">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save connector
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={testing || !config}
              className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-emerald-800 hover:text-emerald-300"
              onClick={test}
            >
              {testing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-2 h-3.5 w-3.5" />} Test connection
            </Button>
            {config?.lastTestStatus ? (
              <span className="text-xs text-zinc-500">
                Last test:{" "}
                <span className={config.lastTestStatus.startsWith("delivered") ? "font-mono text-emerald-300" : "font-mono text-red-300"}>
                  {config.lastTestStatus}
                </span>{" "}
                <span className="font-mono text-[10px] text-zinc-600">{fmtTime(config.lastTestedAt)}</span>
              </span>
            ) : (
              <span className="text-xs text-zinc-600">Not tested yet — run a signed ping to verify reachability.</span>
            )}
          </div>
        </form>

        {rotatedSecret ? (
          <div className="rounded-md border border-emerald-900 bg-emerald-950/30 p-3">
            <div className="mb-1.5 text-xs font-semibold text-emerald-300">New signing secret — copy it now, shown once</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 overflow-x-auto rounded bg-zinc-950 px-2 py-1.5 font-mono text-[11px] text-emerald-300">{rotatedSecret}</code>
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-800 bg-zinc-950 text-emerald-300 hover:border-emerald-700"
                onClick={() => copyText(rotatedSecret, "Signing secret")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : null}

        {/* Webhook event log */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              <Webhook className="h-3.5 w-3.5" /> Webhook event log (latest 20)
            </h4>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-zinc-400 hover:text-zinc-200" onClick={load}>
              <RefreshCw className="mr-1 h-3 w-3" /> Refresh
            </Button>
          </div>
          {error ? (
            <ErrorBox message={error} />
          ) : data === null ? (
            <LoadingBlock lines={3} />
          ) : data.events.length === 0 ? (
            <p className="rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 text-xs text-zinc-500">
              No webhook traffic yet — save the connector, subscribe to an event and run a metered API call.
            </p>
          ) : (
            <div className="overflow-hidden rounded-md border border-zinc-800">
              <div className="max-h-72 overflow-y-auto [scrollbar-width:thin]">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-zinc-900 text-left font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-2.5 py-2 font-medium">dir</th>
                      <th className="px-2.5 py-2 font-medium">event</th>
                      <th className="px-2.5 py-2 font-medium">status</th>
                      <th className="px-2.5 py-2 font-medium">http</th>
                      <th className="px-2.5 py-2 font-medium">time</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[11px] text-zinc-300">
                    {data.events.map((e) => (
                      <tr key={e.id} className="border-t border-zinc-800/60">
                        <td className="px-2.5 py-1.5">
                          <span className={e.direction === "outbound" ? "text-emerald-400" : "text-amber-400"}>{e.direction === "outbound" ? "→ out" : "← in"}</span>
                        </td>
                        <td className="px-2.5 py-1.5">{e.eventType}</td>
                        <td className="px-2.5 py-1.5">{statusBadge(e.status)}</td>
                        <td className="px-2.5 py-1.5 text-zinc-400">{e.httpStatus ?? "—"}</td>
                        <td className="px-2.5 py-1.5 text-zinc-500">{fmtTime(e.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] leading-relaxed text-zinc-600">
          Inbound receiver: <code className="rounded bg-zinc-800/80 px-1 font-mono text-[10px] text-emerald-300">POST /api/webhooks/vecura</code>{" "}
          verifies <code className="rounded bg-zinc-800/80 px-1 font-mono text-[10px] text-emerald-300">x-lacuna-signature</code> against the raw
          body with a constant-time comparison; invalid signatures are recorded as rejected.
        </p>
      </CardContent>
    </Card>
  );
}

// --------------------------------------------------------------------------
// Developer surface card
// --------------------------------------------------------------------------

const ENDPOINTS: { label: string; path: string; note: string }[] = [
  { label: "REST base (v1)", path: "/api/v1", note: "versioned · x-api-key · metered" },
  { label: "OpenAPI 3.1 spec", path: "/api/openapi.json", note: "full request/response schemas" },
  { label: "MCP server", path: "/api/mcp", note: "JSON-RPC 2.0 · 5 tools" },
];

function DeveloperSurfaceCard({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-500" />
          <CardTitle className="text-base">Developer surface — REST, OpenAPI and MCP</CardTitle>
        </div>
        <CardDescription>
          The same five operations are exposed three ways: a versioned REST API, a machine-readable OpenAPI 3.1 document, and a
          JSON-RPC 2.0 MCP server for agentic clients. All require an API key and are metered per call.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-md border border-zinc-800">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-zinc-900 text-left font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-2.5 py-2 font-medium">surface</th>
                <th className="px-2.5 py-2 font-medium">endpoint</th>
                <th className="px-2.5 py-2 font-medium">note</th>
                <th className="px-2.5 py-2 font-medium sr-only">copy</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.path} className="border-t border-zinc-800/60">
                  <td className="px-2.5 py-2 text-zinc-300">{e.label}</td>
                  <td className="px-2.5 py-2 font-mono text-[11px] text-emerald-300">{e.path}</td>
                  <td className="px-2.5 py-2 text-zinc-500">{e.note}</td>
                  <td className="px-2.5 py-2 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-emerald-300"
                      aria-label={`Copy ${e.path}`}
                      onClick={() => copyText(e.path, e.path)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div>
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">curl — REST predict</div>
            <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-[10px] leading-relaxed text-zinc-400">
{`curl -X POST /api/v1/predict \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: lacuna_live_…" \\
  -d '{"drug":"ciprofloxacin",
       "isolate":"SAMN10620096",
       "modelType":"M1"}'`}
            </pre>
            <p className="mt-1.5 text-[11px] text-zinc-600">Paths are relative — prefix with your deployment origin.</p>
          </div>
          <div>
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">JSON-RPC — MCP tools/call</div>
            <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-[10px] leading-relaxed text-zinc-400">
{`curl -X POST /api/mcp \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: lacuna_live_…" \\
  -d '{"jsonrpc":"2.0","id":1,
       "method":"tools/call",
       "params":{"name":"predict_resistance",
                 "arguments":{"drug":"ciprofloxacin",
                              "isolate":"SAMN10620096"}}}'`}
            </pre>
            <p className="mt-1.5 text-[11px] text-zinc-600">
              Also: <code className="font-mono text-[10px] text-emerald-400">initialize</code>,{" "}
              <code className="font-mono text-[10px] text-emerald-400">tools/list</code>. Notifications (no id) get no response.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div>
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">Credit costs per call</div>
            <div className="overflow-hidden rounded-md border border-zinc-800">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-zinc-900 text-left font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-2.5 py-2 font-medium">endpoint</th>
                    <th className="px-2.5 py-2 font-medium">credits</th>
                    <th className="px-2.5 py-2 font-medium">scope</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {CREDIT_COSTS.map((c) => (
                    <tr key={c.endpoint} className="border-t border-zinc-800/60">
                      <td className="px-2.5 py-1.5 text-zinc-300">{c.endpoint}</td>
                      <td className="px-2.5 py-1.5 text-emerald-300">{c.cost}</td>
                      <td className="px-2.5 py-1.5 text-zinc-500">{c.scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3 text-xs leading-relaxed text-zinc-400">
            <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              <KeyRound className="h-3.5 w-3.5" /> API keys
            </div>
            <p>
              Keys carry a scope (<span className="font-mono text-[11px] text-zinc-300">read</span> or{" "}
              <span className="font-mono text-[11px] text-zinc-300">read+predict</span>) and 100 demo credits each; only their SHA-256
              hash is stored. Issue and revoke keys in the Compliance section.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-emerald-800 bg-emerald-950/30 text-emerald-300 hover:border-emerald-700 hover:text-emerald-200"
              onClick={() => onNavigate("compliance")}
            >
              Go to API keys <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --------------------------------------------------------------------------
// API usage card
// --------------------------------------------------------------------------

function ApiUsageCard() {
  const [usage, setUsage] = useState<UsageRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/integrations/vecura")
      .then((r) => r.json())
      .then((d: IntegrationsData) => setUsage(d.usage ?? []))
      .catch(() => setError("Could not load usage."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <CardTitle className="text-base">API usage — metered calls by key</CardTitle>
        </div>
        <CardDescription>
          Aggregated from the hash-chained audit trail: every call made with an API key (REST or MCP) lands here as{" "}
          <code className="rounded bg-zinc-800/80 px-1 font-mono text-[11px] text-emerald-300">api:&lt;keyPrefix&gt;</code> with its action,
          count and last-seen time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <ErrorBox message={error} />
        ) : usage === null ? (
          <LoadingBlock lines={3} />
        ) : usage.length === 0 ? (
          <p className="rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 text-xs text-zinc-500">
            No programmatic calls yet — issue a key and try /api/v1/predict.
          </p>
        ) : (
          <div className="overflow-hidden rounded-md border border-zinc-800">
            <div className="max-h-72 overflow-y-auto [scrollbar-width:thin]">
              <table className="w-full border-collapse text-xs">
                <thead className="sticky top-0 bg-zinc-900 text-left font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-2.5 py-2 font-medium">actor</th>
                    <th className="px-2.5 py-2 font-medium">action</th>
                    <th className="px-2.5 py-2 font-medium">count</th>
                    <th className="px-2.5 py-2 font-medium">last seen</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px] text-zinc-300">
                  {usage.map((u) => (
                    <tr key={`${u.actor}|${u.action}`} className="border-t border-zinc-800/60">
                      <td className="px-2.5 py-1.5 text-emerald-300">{u.actor}</td>
                      <td className="px-2.5 py-1.5">{u.action}</td>
                      <td className="px-2.5 py-1.5 tabular-nums text-zinc-200">{u.count}</td>
                      <td className="px-2.5 py-1.5 text-zinc-500">{fmtTime(u.lastAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --------------------------------------------------------------------------
// Section
// --------------------------------------------------------------------------

export function IntegrationsSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="integrations"
        title="Integration layer — versioned API, MCP server and signed webhooks"
        description="v0.4.0 makes LACUNA callable by external agentic platforms and metered programmatic clients: /api/v1/* (OpenAPI 3.1, API-key auth, per-call credits), /api/mcp (JSON-RPC 2.0 MCP server), and HMAC-SHA256-signed webhooks."
      />
      <p className="-mt-3 text-xs leading-relaxed text-zinc-500">
        Standards-based connector (OpenAPI 3.1 · JSON-RPC MCP · HMAC webhooks). &ldquo;Vecura-ready&rdquo; means integrable with
        Vecura-class agentic platforms — it is not a partnership claim.
      </p>
      <VecuraConnectorCard />
      <DeveloperSurfaceCard onNavigate={onNavigate} />
      <ApiUsageCard />
    </div>
  );
}
