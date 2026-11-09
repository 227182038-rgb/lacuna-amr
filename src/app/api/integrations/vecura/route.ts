// /api/integrations/vecura — console-only management surface for the outbound
// connector (platform "vecura").
//   GET  → { config (secret masked), events (latest 20), usage (api:* audit
//          aggregation, max 50) } — records audit action "integration.view".
//   POST → { action: "save" | "test" | "rotate-secret" }
//     save          — upsert the single IntegrationConfig row (generates a
//                     secret if none exists); audit "integration.save".
//     test          — send a REAL signed ping to the configured endpoint
//                     (3s timeout) and record the honest outcome; audit
//                     "integration.test".
//     rotate-secret — new secret, returned ONCE in full; audit
//                     "integration.rotate".

import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { signPayload } from "@/lib/lacuna/v1";

export const dynamic = "force-dynamic";

const PLATFORM = "vecura";

function maskSecret(secret: string): string {
  return `${secret.slice(0, 4)}…`;
}

function configPublic(config: {
  id: string;
  platform: string;
  endpointUrl: string | null;
  hmacSecret: string;
  events: string;
  active: boolean;
  lastTestedAt: Date | null;
  lastTestStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  let events: unknown;
  try {
    events = JSON.parse(config.events);
  } catch {
    events = [];
  }
  return {
    id: config.id,
    platform: config.platform,
    endpointUrl: config.endpointUrl,
    hmacSecretMasked: maskSecret(config.hmacSecret),
    events: Array.isArray(events) ? (events as string[]) : [],
    active: config.active,
    lastTestedAt: config.lastTestedAt,
    lastTestStatus: config.lastTestStatus,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt,
  };
}

async function getConfig() {
  return db.integrationConfig.findFirst({ where: { platform: PLATFORM } });
}

export async function GET() {
  const config = await getConfig();

  const events = await db.webhookEvent.findMany({
    where: { platform: PLATFORM },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Programmatic usage: AuditLog rows with actor "api:<keyPrefix>", aggregated
  // in JS (actor, action, count, lastAt), most-used first, max 50 rows.
  const apiRows = await db.auditLog.findMany({
    where: { actor: { startsWith: "api:" } },
    orderBy: { createdAt: "desc" },
    take: 2000,
  });
  const grouped = new Map<string, { actor: string; action: string; count: number; lastAt: Date }>();
  for (const row of apiRows) {
    const key = `${row.actor}|${row.action}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.count += 1;
      if (row.createdAt > existing.lastAt) existing.lastAt = row.createdAt;
    } else {
      grouped.set(key, { actor: row.actor, action: row.action, count: 1, lastAt: row.createdAt });
    }
  }
  const usage = Array.from(grouped.values())
    .sort((a, b) => b.count - a.count || b.lastAt.getTime() - a.lastAt.getTime())
    .slice(0, 50);

  await recordAudit("console", "integration.view", {
    platform: PLATFORM,
    configured: Boolean(config),
    nWebhookEvents: events.length,
  });

  return NextResponse.json({
    config: config ? configPublic(config) : null,
    events: events.map((e) => ({
      id: e.id,
      direction: e.direction,
      eventType: e.eventType,
      status: e.status,
      httpStatus: e.httpStatus,
      error: e.error,
      createdAt: e.createdAt,
    })),
    usage,
  });
}

interface SaveBody {
  action?: "save" | "test" | "rotate-secret";
  endpointUrl?: string;
  events?: string[];
  hmacSecret?: string;
}

export async function POST(req: Request) {
  let body: SaveBody;
  try {
    body = (await req.json()) as SaveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // ------------------------------------------------------------------ save --
  if (body.action === "save") {
    const endpointUrl = typeof body.endpointUrl === "string" && body.endpointUrl.trim() !== "" ? body.endpointUrl.trim() : null;
    const events = Array.isArray(body.events) ? body.events.filter((e): e is string => typeof e === "string") : [];

    const existing = await getConfig();
    let secret: string;
    if (typeof body.hmacSecret === "string" && body.hmacSecret.trim() !== "") {
      secret = body.hmacSecret.trim();
    } else if (existing) {
      secret = existing.hmacSecret; // keep the stored secret
    } else {
      secret = crypto.randomBytes(24).toString("hex");
    }

    const config = existing
      ? await db.integrationConfig.update({
          where: { id: existing.id },
          data: { endpointUrl, hmacSecret: secret, events: JSON.stringify(events), active: true },
        })
      : await db.integrationConfig.create({
          data: { platform: PLATFORM, endpointUrl, hmacSecret: secret, events: JSON.stringify(events), active: true },
        });

    await recordAudit("console", "integration.save", {
      platform: PLATFORM,
      endpointUrl,
      events,
      secretGenerated: !existing && typeof body.hmacSecret !== "string",
    });

    return NextResponse.json({ ok: true, config: configPublic(config) });
  }

  // ------------------------------------------------------------------ test --
  if (body.action === "test") {
    const config = await getConfig();
    if (!config) {
      return NextResponse.json({ ok: false, error: "No integration configured — save an endpoint first." }, { status: 400 });
    }
    if (!config.endpointUrl) {
      return NextResponse.json({ ok: false, error: "No endpoint URL configured — set one before testing." }, { status: 400 });
    }

    const rawBody = JSON.stringify({ event: "ping", sentAt: new Date().toISOString() });
    const signature = `sha256=${signPayload(config.hmacSecret, rawBody)}`;

    let status = "failed";
    let httpStatus: number | null = null;
    let error: string | null = null;
    try {
      const res = await fetch(config.endpointUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-lacuna-event": "ping",
          "x-lacuna-signature": signature,
        },
        body: rawBody,
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

    const lastTestStatus = status === "delivered" ? `delivered · HTTP ${httpStatus}` : `failed · ${error ?? "unknown error"}`;

    try {
      await db.webhookEvent.create({
        data: { direction: "outbound", platform: PLATFORM, eventType: "ping", payload: rawBody, status, httpStatus, error },
      });
    } catch {
      // best-effort logging
    }
    await db.integrationConfig.update({
      where: { id: config.id },
      data: { lastTestedAt: new Date(), lastTestStatus },
    });
    await recordAudit("console", "integration.test", { platform: PLATFORM, endpointUrl: config.endpointUrl, status, httpStatus, error });

    // Honest outcome — a sandbox network failure is a real "failed" result.
    return NextResponse.json({ ok: status === "delivered", httpStatus, error });
  }

  // --------------------------------------------------------- rotate-secret --
  if (body.action === "rotate-secret") {
    const config = await getConfig();
    if (!config) {
      return NextResponse.json({ ok: false, error: "No integration configured — save an endpoint first." }, { status: 400 });
    }
    const secret = crypto.randomBytes(24).toString("hex");
    const updated = await db.integrationConfig.update({ where: { id: config.id }, data: { hmacSecret: secret } });
    await recordAudit("console", "integration.rotate", { platform: PLATFORM, configId: config.id });
    // The full secret is returned exactly once; everywhere else it is masked.
    return NextResponse.json({ ok: true, secret, config: configPublic(updated) });
  }

  return NextResponse.json({ error: "action must be one of: save, test, rotate-secret." }, { status: 400 });
}
