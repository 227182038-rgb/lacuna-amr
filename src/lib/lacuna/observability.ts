// Phase 1 — observability (v0.5.0). Three layers:
//   1. middleware.ts stamps every request with x-request-id and emits a
//      structured JSON log line (stdout → dev.log / container logs).
//   2. withMetrics() wraps every API route handler: duration, status and
//      errors land in the MetricSample table (best-effort, never throws).
//   3. /api/metrics evaluates alert rules over real recorded samples and can
//      expose the same numbers in Prometheus text format.

import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export interface AlertRule {
  id: string;
  description: string;
  severity: "critical" | "warning";
  windowMinutes: number;
  threshold: number;
  unit: string;
  minSamples: number;
}

export const ALERT_RULES: AlertRule[] = [
  {
    id: "http_5xx_error_rate",
    description: "Share of API responses with status >= 500 over the window",
    severity: "critical",
    windowMinutes: 15,
    threshold: 2, // percent
    unit: "%",
    minSamples: 20,
  },
  {
    id: "http_p95_latency",
    description: "95th percentile API latency over the window",
    severity: "warning",
    windowMinutes: 15,
    threshold: 2000, // ms
    unit: "ms",
    minSamples: 10,
  },
  {
    id: "webhook_delivery_failures",
    description: "Failed outbound webhook deliveries over the window",
    severity: "critical",
    windowMinutes: 15,
    threshold: 3, // count
    unit: "failures",
    minSamples: 1,
  },
];

export function newRequestId(): string {
  return crypto.randomUUID();
}

/** Best-effort metric write — observability must never break the request. */
export async function recordMetric(sample: {
  type: "http" | "error" | "webhook" | "alert";
  route: string;
  method?: string;
  status?: number;
  durationMs?: number;
  error?: string;
  requestId?: string;
}): Promise<void> {
  try {
    await db.metricSample.create({
      data: {
        type: sample.type,
        route: sample.route,
        method: sample.method ?? null,
        status: sample.status ?? null,
        durationMs: sample.durationMs ?? null,
        error: sample.error ? sample.error.slice(0, 500) : null,
        requestId: sample.requestId ?? null,
      },
    });
  } catch {
    // never throw
  }
}

type Handler = (req: Request, ctx: never) => Promise<NextResponse>;

/**
 * Wrap an API route handler with duration/status/error metering and the
 * request id echo. Usage: `export const GET = withMetrics("predict", GET_impl)`.
 */
export function withMetrics(route: string, handler: Handler): Handler {
  return async (req: Request, ctx: never) => {
    const t0 = Date.now();
    const requestId = req.headers.get("x-request-id") ?? newRequestId();
    let res: NextResponse;
    try {
      res = await handler(req, ctx);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await recordMetric({ type: "error", route, method: req.method, error: message, requestId });
      res = NextResponse.json({ error: "Internal server error.", requestId }, { status: 500 });
    }
    const durationMs = Date.now() - t0;
    res.headers.set("x-request-id", requestId);
    // fire-and-forget: the response must not wait on the metrics write
    void recordMetric({
      type: res.status >= 500 ? "error" : "http",
      route,
      method: req.method,
      status: res.status,
      durationMs,
      error: res.status >= 500 ? `HTTP ${res.status}` : undefined,
      requestId,
    });
    return res;
  };
}

export interface AlertEvaluation {
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

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

export interface MetricsSnapshot {
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

/** Compute the metrics snapshot + alert states from real recorded samples. */
export async function computeMetrics(windowMinutes = 15): Promise<MetricsSnapshot> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);

  const httpSamples = await db.metricSample.findMany({
    where: { type: { in: ["http", "error"] }, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });
  const total = httpSamples.length;
  const errors5xx = httpSamples.filter((s) => (s.status ?? 0) >= 500).length;
  const durations = httpSamples.map((s) => s.durationMs ?? 0).sort((a, b) => a - b);

  const byRouteMap = new Map<string, { count: number; errors5xx: number; durations: number[] }>();
  for (const s of httpSamples) {
    const entry = byRouteMap.get(s.route) ?? { count: 0, errors5xx: 0, durations: [] };
    entry.count += 1;
    if ((s.status ?? 0) >= 500) entry.errors5xx += 1;
    if (typeof s.durationMs === "number") entry.durations.push(s.durationMs);
    byRouteMap.set(s.route, entry);
  }

  const webhookEvents = await db.webhookEvent.findMany({ where: { createdAt: { gte: since } } });
  const delivered = webhookEvents.filter((w) => w.status === "delivered").length;
  const failed = webhookEvents.filter((w) => w.status === "failed").length;
  const verified = webhookEvents.filter((w) => w.status === "verified").length;
  const rejected = webhookEvents.filter((w) => w.status === "rejected").length;
  const outboundTotal = delivered + failed;

  const recentErrors = await db.metricSample.findMany({
    where: { type: "error" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const errorRatePct = total >= 1 ? (errors5xx / total) * 100 : null;
  const p95 = percentile(durations, 95);

  const alerts: AlertEvaluation[] = ALERT_RULES.map((rule) => {
    if (rule.id === "http_5xx_error_rate") {
      if (total < rule.minSamples) {
        return { ruleId: rule.id, description: rule.description, severity: rule.severity, state: "no_data" as const, observed: errorRatePct ?? 0, threshold: rule.threshold, unit: rule.unit, windowMinutes: rule.windowMinutes, samples: total };
      }
      const observed = errorRatePct ?? 0;
      return { ruleId: rule.id, description: rule.description, severity: rule.severity, state: observed > rule.threshold ? ("firing" as const) : ("ok" as const), observed, threshold: rule.threshold, unit: rule.unit, windowMinutes: rule.windowMinutes, samples: total };
    }
    if (rule.id === "http_p95_latency") {
      if (total < rule.minSamples) {
        return { ruleId: rule.id, description: rule.description, severity: rule.severity, state: "no_data" as const, observed: p95, threshold: rule.threshold, unit: rule.unit, windowMinutes: rule.windowMinutes, samples: total };
      }
      return { ruleId: rule.id, description: rule.description, severity: rule.severity, state: p95 > rule.threshold ? ("firing" as const) : ("ok" as const), observed: p95, threshold: rule.threshold, unit: rule.unit, windowMinutes: rule.windowMinutes, samples: total };
    }
    // webhook_delivery_failures
    return {
      ruleId: rule.id,
      description: rule.description,
      severity: rule.severity,
      state: failed > rule.threshold ? "firing" : outboundTotal === 0 ? "no_data" : "ok",
      observed: failed,
      threshold: rule.threshold,
      unit: rule.unit,
      windowMinutes: rule.windowMinutes,
      samples: outboundTotal,
    };
  });

  // Record alert transitions (deduplicated by remembering the last state per rule)
  for (const a of alerts) {
    if (a.state === "firing") {
      const lastFiring = await db.metricSample.findFirst({
        where: { type: "alert", route: `alert:${a.ruleId}`, createdAt: { gte: new Date(Date.now() - rule_window_ms(a.windowMinutes)) } },
      });
      if (!lastFiring) {
        await recordMetric({ type: "alert", route: `alert:${a.ruleId}`, error: `${a.ruleId} firing: observed ${a.observed.toFixed ? a.observed.toFixed(2) : a.observed}${a.unit} > threshold ${a.threshold}${a.unit} (${a.samples} samples)` });
      }
    }
  }

  const recentWebhooks = await db.webhookEvent.findMany({ orderBy: { createdAt: "desc" }, take: 10 });

  return {
    generatedAt: new Date().toISOString(),
    windowMinutes,
    http: {
      total,
      errors5xx,
      errorRatePct,
      p50Ms: percentile(durations, 50),
      p95Ms: p95,
      byRoute: Array.from(byRouteMap.entries())
        .map(([route, v]) => ({ route, count: v.count, errors5xx: v.errors5xx, p95Ms: percentile(v.durations.sort((a, b) => a - b), 95) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 25),
    },
    webhooks: {
      delivered,
      failed,
      verified,
      rejected,
      successRatePct: outboundTotal > 0 ? (delivered / outboundTotal) * 100 : null,
      recent: recentWebhooks.map((w) => ({ eventType: w.eventType, status: w.status, httpStatus: w.httpStatus, error: w.error, createdAt: w.createdAt.toISOString() })),
    },
    alerts,
    recentErrors: recentErrors.map((e) => ({ route: e.route, method: e.method, status: e.status, error: e.error, requestId: e.requestId, createdAt: e.createdAt.toISOString() })),
  };
}

function rule_window_ms(minutes: number): number {
  return minutes * 60 * 1000;
}

/** Prometheus text exposition of the same snapshot. */
export function toPrometheus(snap: MetricsSnapshot): string {
  const lines: string[] = [];
  lines.push("# HELP lacuna_http_requests_total API requests in the evaluation window.");
  lines.push("# TYPE lacuna_http_requests_total gauge");
  lines.push(`lacuna_http_requests_total{window_minutes="${snap.windowMinutes}"} ${snap.http.total}`);
  lines.push("# HELP lacuna_http_errors_5xx_total API 5xx responses in the evaluation window.");
  lines.push("# TYPE lacuna_http_errors_5xx_total gauge");
  lines.push(`lacuna_http_errors_5xx_total{window_minutes="${snap.windowMinutes}"} ${snap.http.errors5xx}`);
  lines.push("# HELP lacuna_http_request_duration_ms API latency quantiles in the evaluation window.");
  lines.push("# TYPE lacuna_http_request_duration_ms gauge");
  lines.push(`lacuna_http_request_duration_ms{window_minutes="${snap.windowMinutes}",quantile="0.5"} ${snap.http.p50Ms}`);
  lines.push(`lacuna_http_request_duration_ms{window_minutes="${snap.windowMinutes}",quantile="0.95"} ${snap.http.p95Ms}`);
  lines.push("# HELP lacuna_webhook_events_total Webhook exchanges in the evaluation window by status.");
  lines.push("# TYPE lacuna_webhook_events_total gauge");
  lines.push(`lacuna_webhook_events_total{window_minutes="${snap.windowMinutes}",status="delivered"} ${snap.webhooks.delivered}`);
  lines.push(`lacuna_webhook_events_total{window_minutes="${snap.windowMinutes}",status="failed"} ${snap.webhooks.failed}`);
  lines.push(`lacuna_webhook_events_total{window_minutes="${snap.windowMinutes}",status="verified"} ${snap.webhooks.verified}`);
  lines.push(`lacuna_webhook_events_total{window_minutes="${snap.windowMinutes}",status="rejected"} ${snap.webhooks.rejected}`);
  lines.push("# HELP lacuna_alert_firing Alert rule state (1 = firing).");
  lines.push("# TYPE lacuna_alert_firing gauge");
  for (const a of snap.alerts) {
    lines.push(`lacuna_alert_firing{rule="${a.ruleId}",severity="${a.severity}"} ${a.state === "firing" ? 1 : 0}`);
  }
  return lines.join("\n") + "\n";
}
