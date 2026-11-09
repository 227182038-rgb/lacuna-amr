// API-key authentication helper for routes that accept programmatic access.
// Absent header => caller is the interactive console (actor "console").
// Present header => must match a live, non-revoked key with credits left.

import crypto from "crypto";
import { db } from "@/lib/db";

export function sha256(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export interface ApiKeyRec {
  id: string;
  keyPrefix: string;
  scope: string;
  credits: number;
  organizationId: string | null; // owning organization; null = open workspace
}

export type KeyAuthResult =
  | { absent: true }
  | { ok: true; rec: ApiKeyRec; actor: string }
  | { ok: false; status: number; error: string };

export async function authenticateKey(req: Request): Promise<KeyAuthResult> {
  const raw = req.headers.get("x-api-key");
  if (!raw) return { absent: true };
  const rec = await db.apiKey.findFirst({ where: { keyHash: sha256(raw), revokedAt: null } });
  if (!rec) return { ok: false, status: 401, error: "Invalid or revoked API key." };
  if (rec.credits <= 0) return { ok: false, status: 402, error: "Key has no credits remaining." };
  return {
    ok: true,
    rec: { id: rec.id, keyPrefix: rec.keyPrefix, scope: rec.scope, credits: rec.credits, organizationId: rec.organizationId },
    actor: `api:${rec.keyPrefix}`,
  };
}
