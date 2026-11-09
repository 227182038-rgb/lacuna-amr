// POST /api/webhooks/vecura — inbound HMAC-verified webhook receiver.
// The RAW request body is verified against the header
//   x-lacuna-signature: sha256=<HMAC-SHA256(config.hmacSecret, rawBody)>
// using crypto.timingSafeEqual. Phase 1 (v0.5.0): with per-organization
// connector configs the signature is checked against EVERY active config of
// the platform; the first constant-time match attributes the event to that
// organization's workspace. Valid → WebhookEvent "verified" (with org
// attribution) + audit "webhook.received" + 200; invalid/missing →
// WebhookEvent "rejected" + 401; no configured integration → 401.

import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { corsJson, corsOptions, signPayload } from "@/lib/lacuna/v1";

export const dynamic = "force-dynamic";

const PLATFORM = "vecura";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const configs = await db.integrationConfig.findMany({ where: { platform: PLATFORM, active: true } });
  if (configs.length === 0) {
    return NextResponse.json({ error: "No integration configured." }, { status: 401 });
  }

  const signatureHeader = req.headers.get("x-lacuna-signature") ?? "";

  // Best-effort event-type extraction for the log (never trusted for auth).
  let eventType = "unknown";
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (parsed && typeof parsed === "object" && "event" in parsed && typeof (parsed as { event: unknown }).event === "string") {
      eventType = (parsed as { event: string }).event;
    }
  } catch {
    // non-JSON body — keep "unknown"
  }

  // Match the signature against every active config (constant-time compare
  // each); the matching secret identifies the sending workspace.
  let matched: (typeof configs)[number] | null = null;
  for (const config of configs) {
    const expected = `sha256=${signPayload(config.hmacSecret, rawBody)}`;
    if (signatureHeader.length === expected.length) {
      try {
        if (crypto.timingSafeEqual(Buffer.from(signatureHeader, "utf8"), Buffer.from(expected, "utf8"))) {
          matched = config;
          break;
        }
      } catch {
        // continue to next config
      }
    }
  }

  if (!matched) {
    await db.webhookEvent.create({
      data: {
        direction: "inbound",
        platform: PLATFORM,
        eventType,
        payload: rawBody.slice(0, 4000),
        status: "rejected",
        error: "HMAC signature verification failed.",
      },
    });
    return corsJson({ error: "Invalid signature." }, 401);
  }

  await db.webhookEvent.create({
    data: {
      organizationId: matched.organizationId,
      direction: "inbound",
      platform: PLATFORM,
      eventType,
      payload: rawBody.slice(0, 4000),
      status: "verified",
    },
  });
  await recordAudit("console", "webhook.received", {
    platform: PLATFORM,
    eventType,
    workspace: matched.organizationId ?? "open",
  });

  return corsJson({ received: true }, 200);
}
