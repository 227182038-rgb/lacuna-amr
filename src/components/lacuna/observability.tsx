"use client";

// Phase 1 — Observability section (v0.5.0): request/error/latency metrics from
// the in-app MetricSample store, webhook delivery outcomes, and the three
// alert rules evaluated server-side over real recorded data. Prometheus
// exposition of the same snapshot is one query parameter away.

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Activity, BellRing, Gauge, RefreshCw, Webhook } from "lucide-react";
import { LoadingBlock, SectionHeader, StatCard } from "./ui-bits";

interface AlertEvaluation {
  ruleId: string;
  description: string;
  severity: "critical" | "warning";
  state: "firing" | "ok" | "no_data";
  observed: number;
  threshold: number;
  unit: string;
  windowMinutes: number;
  samples: number;
}

interface MetricsSnapshot {
  generatedAt: string;
  windowMinutes: number;
  http: {
    total: number;
    errors5xx: number;
    errorRatePct: number | null;
    p50Ms: number;
    p95Ms: number;
    byRoute: { route: string; count: number; errors5xx: number; p95Ms: number }[];
  };
  webhooks: {
    delivered: number;
    failed: number;
    verified: number;
    rejected: number;
    successRatePct: number | null;
    recent: { eventType: string; status: string; httpStatus: number | null; error: string | null; createdAt: string }[];
  };
  alerts: AlertEvaluation[];
  recentErrors: { route: string; method: string | null; status: number | null; error: string | null; requestId: string | null; createdAt: string }[];
}

export function ObservabilitySection() {
  const [snap, setSnap] = useState<MetricsSnapshot | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/metrics", { cache: "no-store" });
      if (res.ok) setSnap(await res.json());
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 30000);
    return () => clearInterval(t);
  }, [load]);

  const firing = snap?.alerts.filter((a) => a.state === "firing") ?? [];

  return (
    <div>
      <SectionHeader
        kicker="Phase 1 · production foundation"
        title="Observability"
        description={`Structured JSON request logs (one line per request with x-request-id), per-route metrics in the database, webhook delivery outcomes and threshold alerts — evaluated over the last ${snap?.windowMinutes ?? 15} minutes of real traffic.`}
        right={
          <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300" onClick={() => void load()} disabled={busy}>
            {busy ? <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />} Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Requests (window)" value={snap?.http.total ?? "—"} sub={`${snap?.http.errors5xx ?? 0} × 5xx`} accent={(snap?.http.errors5xx ?? 0) > 0 ? "red" : "emerald"} />
        <StatCard
          label="5xx error rate"
          value={snap?.http.errorRatePct != null ? `${snap.http.errorRatePct.toFixed(1)}%` : "—"}
          sub="alert threshold > 2% (n ≥ 20)"
          accent={(snap?.http.errorRatePct ?? 0) > 2 ? "red" : "emerald"}
        />
        <StatCard label="Latency p95" value={snap ? `${snap.http.p95Ms} ms` : "—"} sub={`p50 ${snap?.http.p50Ms ?? 0} ms · alert > 2000 ms`} accent={(snap?.http.p95Ms ?? 0) > 2000 ? "amber" : "emerald"} />
        <StatCard
          label="Webhook delivery"
          value={snap?.webhooks.successRatePct != null ? `${snap.webhooks.successRatePct.toFixed(0)}%` : "—"}
          sub={`${snap?.webhooks.delivered ?? 0} delivered · ${snap?.webhooks.failed ?? 0} failed`}
          accent={(snap?.webhooks.failed ?? 0) > 3 ? "red" : "emerald"}
        />
      </div>

      {firing.length > 0 ? (
        <div className="mt-4 rounded-md border border-red-900/70 bg-red-950/30 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-red-300">
            <BellRing className="h-4 w-4" /> {firing.length} alert{firing.length > 1 ? "s" : ""} firing
          </div>
          <ul className="mt-1 space-y-0.5 text-xs text-red-200/80">
            {firing.map((a) => (
              <li key={a.ruleId} className="font-mono">
                {a.ruleId}: observed {a.observed.toFixed ? a.observed.toFixed(2) : a.observed}
                {a.unit} &gt; {a.threshold}
                {a.unit} ({a.samples} samples)
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* Alert rules */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <BellRing className="h-4 w-4 text-emerald-400" /> Alert rules
            </CardTitle>
            <CardDescription>Evaluated server-side on every /api/metrics read; firing transitions are recorded as metric samples (type “alert”).</CardDescription>
          </CardHeader>
          <CardContent>
            {!snap ? (
              <LoadingBlock lines={3} />
            ) : (
              <ul className="space-y-2">
                {snap.alerts.map((a) => (
                  <li key={a.ruleId} className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-zinc-200">{a.ruleId}</span>
                      <Badge
                        variant="outline"
                        className={`font-mono text-[10px] ${
                          a.state === "firing"
                            ? "border-red-900 bg-red-950/40 text-red-300"
                            : a.state === "ok"
                              ? "border-emerald-800 bg-emerald-950/40 text-emerald-300"
                              : "border-zinc-700 bg-zinc-900 text-zinc-500"
                        }`}
                      >
                        {a.state}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-500">{a.description}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-zinc-600">
                      observed {a.observed.toFixed ? a.observed.toFixed(2) : a.observed}
                      {a.unit} / threshold {a.threshold}
                      {a.unit} · window {a.windowMinutes}m · n={a.samples}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Per-route */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <Gauge className="h-4 w-4 text-emerald-400" /> Per-route traffic
            </CardTitle>
            <CardDescription>Every API handler is wrapped with duration/status metering (withMetrics) — these are real measured requests, not sampling.</CardDescription>
          </CardHeader>
          <CardContent>
            {!snap ? (
              <LoadingBlock lines={4} />
            ) : snap.http.byRoute.length === 0 ? (
              <p className="text-sm text-zinc-500">No traffic in the current window — exercise the console and refresh.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="pb-2">Route</th>
                      <th className="pb-2 text-right">Requests</th>
                      <th className="pb-2 text-right">5xx</th>
                      <th className="pb-2 text-right">p95 ms</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-zinc-300">
                    {snap.http.byRoute.map((r) => (
                      <tr key={r.route} className="border-t border-zinc-800/60">
                        <td className="py-1.5 pr-2">{r.route}</td>
                        <td className="py-1.5 pr-2 text-right tabular-nums">{r.count}</td>
                        <td className={`py-1.5 pr-2 text-right tabular-nums ${r.errors5xx > 0 ? "text-red-400" : "text-zinc-600"}`}>{r.errors5xx}</td>
                        <td className="py-1.5 text-right tabular-nums">{r.p95Ms}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Webhooks */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <Webhook className="h-4 w-4 text-emerald-400" /> Webhook delivery (window)
            </CardTitle>
            <CardDescription>Real outcomes from the signed outbound connector — failures are recorded as failures.</CardDescription>
          </CardHeader>
          <CardContent>
            {!snap ? (
              <LoadingBlock lines={3} />
            ) : (
              <>
                <div className="mb-3 grid grid-cols-4 gap-2 text-center">
                  {[
                    ["delivered", snap.webhooks.delivered, "text-emerald-300"],
                    ["failed", snap.webhooks.failed, "text-red-300"],
                    ["verified", snap.webhooks.verified, "text-emerald-300"],
                    ["rejected", snap.webhooks.rejected, "text-amber-300"],
                  ].map(([label, value, cls]) => (
                    <div key={String(label)} className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2 py-2">
                      <div className={`font-mono text-lg font-semibold tabular-nums ${cls as string}`}>{value as number}</div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label as string}</div>
                    </div>
                  ))}
                </div>
                {snap.webhooks.recent.length === 0 ? (
                  <p className="text-xs text-zinc-500">No webhook exchanges in the window.</p>
                ) : (
                  <ul className="max-h-40 space-y-1 overflow-y-auto pr-1">
                    {snap.webhooks.recent.map((w, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 rounded border border-zinc-800/70 bg-zinc-950/50 px-2 py-1 font-mono text-[10px]">
                        <span className="truncate text-zinc-300">{w.eventType}</span>
                        <span className={w.status === "delivered" || w.status === "verified" ? "text-emerald-400" : "text-red-400"}>
                          {w.status}
                          {w.httpStatus ? ` · ${w.httpStatus}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent errors + logs */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <Activity className="h-4 w-4 text-emerald-400" /> Recent errors & structured log sample
            </CardTitle>
            <CardDescription>Errors caught by the route wrapper (status ≥ 500 or thrown). One structured JSON line per request also lands in the container log with its x-request-id.</CardDescription>
          </CardHeader>
          <CardContent>
            {!snap ? (
              <LoadingBlock lines={3} />
            ) : snap.recentErrors.length === 0 ? (
              <p className="mb-2 text-sm text-zinc-500">No recorded errors.</p>
            ) : (
              <ul className="mb-3 max-h-40 space-y-1 overflow-y-auto pr-1">
                {snap.recentErrors.map((e, i) => (
                  <li key={i} className="rounded border border-red-900/50 bg-red-950/20 px-2 py-1 font-mono text-[10px] text-red-200/80">
                    {new Date(e.createdAt).toLocaleTimeString()} · {e.route} [{e.status ?? "throw"}] {e.error}
                    {e.requestId ? <span className="text-red-200/40"> · {e.requestId.slice(0, 8)}</span> : null}
                  </li>
                ))}
              </ul>
            )}
            <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 p-2 font-mono text-[10px] leading-relaxed text-zinc-400">
{`{"ts":"…","level":"info","msg":"http_request","requestId":"…","method":"POST","path":"/api/v1/predict"}`}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 bg-zinc-900 font-mono text-[11px] text-zinc-300"
                onClick={() => {
                  void fetch("/api/metrics?format=prometheus", { cache: "no-store" })
                    .then((r) => r.text())
                    .then((t) => {
                      navigator.clipboard?.writeText(t).catch(() => undefined);
                      toast({ title: "Prometheus exposition copied", description: `${t.split("\n").length} lines on the clipboard.` });
                    });
                }}
              >
                Copy Prometheus exposition
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 bg-zinc-900 font-mono text-[11px] text-zinc-300"
                onClick={() => window.open("/api/health", "_blank", "noopener")}
              >
                Open /api/health
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
        Deployment note: this in-app metrics store ships with the platform; the production deploy exposes the identical
        snapshot at /api/metrics?format=prometheus for scraping, and the structured request log is the container log
        stream. /api/metrics is unauthenticated in this RUO demo (aggregates only, no tenant payloads — see
        DEVIATIONS.md D-046); the runbook gates it behind the reverse proxy in production.
      </p>
    </div>
  );
}
