// POST /api/webhooks/vecura — inbound HMAC-verified webhook receiver.
// The RAW request body is verified against the header
//   x-lacuna-signature: sha256=<HMAC-SHA256(config.hmacSecret, rawBody)>
// using crypto.timingSafeEqual. Valid → WebhookEvent "verified" + audit
// "webhook.received" + 200 {received:true}; invalid/missing → WebhookEvent
// "rejected" + 401. No configured integration → 401.

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

  const config = await db.integrationConfig.findFirst({ where: { platform: PLATFORM } });
  if (!config) {
    return NextResponse.json({ error: "No integration configured." }, { status: 401 });
  }

  const signatureHeader = req.headers.get("x-lacuna-signature") ?? "";
  const expected = `sha256=${signPayload(config.hmacSecret, rawBody)}`;

  let valid = false;
  if (signatureHeader.length === expected.length) {
    try {
      valid = crypto.timingSafeEqual(Buffer.from(signatureHeader, "utf8"), Buffer.from(expected, "utf8"));
    } catch {
      valid = false;
    }
  }

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

  if (!valid) {
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
    data: { direction: "inbound", platform: PLATFORM, eventType, payload: rawBody.slice(0, 4000), status: "verified" },
  });
  await recordAudit("console", "webhook.received", { platform: PLATFORM, eventType });

  return corsJson({ received: true }, 200);
}
