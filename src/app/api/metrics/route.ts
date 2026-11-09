// Phase 1 — metrics endpoint (v0.5.0). Aggregates over the in-app metrics
// store: request/error/latency by route, webhook delivery outcomes, and the
// three alert rules. JSON by default, Prometheus text via ?format=prometheus.
// Aggregates only — no tenant payloads; see DEVIATIONS.md D-046 for the
// production auth note.

import { NextResponse } from "next/server";
import { computeMetrics, toPrometheus, withMetrics } from "@/lib/lacuna/observability";

export const dynamic = "force-dynamic";

async function metrics(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const rawWindow = parseInt(url.searchParams.get("window") ?? "15", 10);
  const windowMinutes = Number.isFinite(rawWindow) && rawWindow >= 1 && rawWindow <= 1440 ? rawWindow : 15;
  const snap = await computeMetrics(windowMinutes);
  if (url.searchParams.get("format") === "prometheus") {
    return new NextResponse(toPrometheus(snap), {
      status: 200,
      headers: { "content-type": "text/plain; version=0.0.4; charset=utf-8" },
    });
  }
  return NextResponse.json(snap);
}

export const GET = withMetrics("metrics", metrics);
