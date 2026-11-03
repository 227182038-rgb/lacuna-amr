import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";

export const dynamic = "force-dynamic";

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

const createSchema = z.object({
  label: z.string().min(1).max(120),
  scope: z.enum(["read", "read+predict"]).default("read+predict"),
});

export async function GET() {
  const keys = await db.apiKey.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({
    keys: keys.map((k) => ({
      id: k.id,
      label: k.label,
      keyPrefix: k.keyPrefix,
      scope: k.scope,
      credits: k.credits,
      lastUsedAt: k.lastUsedAt,
      revokedAt: k.revokedAt,
      createdAt: k.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  }

  const raw = `lacuna_live_${crypto.randomBytes(24).toString("hex")}`;
  const rec = await db.apiKey.create({
    data: {
      label: parsed.data.label,
      keyPrefix: raw.slice(0, 12),
      keyHash: sha256(raw),
      scope: parsed.data.scope,
      credits: 100,
    },
  });

  await recordAudit("console", "key.issue", { keyId: rec.id, label: rec.label, scope: rec.scope, credits: rec.credits });

  return NextResponse.json({
    id: rec.id,
    label: rec.label,
    scope: rec.scope,
    credits: rec.credits,
    key: raw, // shown exactly once
    notice:
      "Store this key now — it is never shown again (only its SHA-256 hash is stored). Demo console: the key authenticates batch submissions via the x-api-key header and carries per-sample credits.",
  });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "?id= is required." }, { status: 400 });
  const rec = await db.apiKey.findUnique({ where: { id } });
  if (!rec) return NextResponse.json({ error: "Key not found." }, { status: 404 });
  if (rec.revokedAt) return NextResponse.json({ error: "Key already revoked." }, { status: 400 });
  await db.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
  await recordAudit("console", "key.revoke", { keyId: id, label: rec.label });
  return NextResponse.json({ id, revoked: true });
}
