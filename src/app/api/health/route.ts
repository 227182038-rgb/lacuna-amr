// Phase 1 — health probes (v0.5.0). Liveness + readiness in one endpoint:
// status is "ok" when the database answers SELECT 1, "degraded" otherwise.
// Unauthenticated by design (load balancers must reach it); returns no tenant
// data. Wrapped with metrics so the probe itself is observable.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withMetrics } from "@/lib/lacuna/observability";

export const dynamic = "force-dynamic";

async function health(): Promise<NextResponse> {
  const startedAt = Date.now();
  let dbOk = false;
  let dbLatencyMs: number | null = null;
  try {
    const t0 = Date.now();
    await db.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - t0;
    dbOk = true;
  } catch {
    dbOk = false;
  }
  const status = dbOk ? "ok" : "degraded";
  return NextResponse.json(
    {
      status,
      checks: { database: { ok: dbOk, latencyMs: dbLatencyMs } },
      version: "0.5.0",
      uptimeSeconds: Math.round(process.uptime()),
      checkedAt: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
    },
    { status: dbOk ? 200 : 503 },
  );
}

export const GET = withMetrics("health", health);
