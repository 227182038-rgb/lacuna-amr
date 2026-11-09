import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { planById } from "@/lib/lacuna/billing";
import { resolveOrgContext } from "@/lib/lacuna/org-context";

export const dynamic = "force-dynamic";

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

const createSchema = z.object({
  label: z.string().min(1).max(120),
  scope: z.enum(["read", "read+predict"]).default("read+predict"),
});

export async function GET(req: Request) {
  const ctx = await resolveOrgContext(req);
  const keys = await db.apiKey.findMany({ where: { organizationId: ctx.orgId }, orderBy: { createdAt: "desc" }, take: 50 });

  // plan quota context for the UI
  const sub = ctx.orgId ? await db.billingSubscription.findUnique({ where: { organizationId: ctx.orgId } }) : null;
  const plan = sub && sub.status !== "canceled" ? planById(sub.plan) : null;

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
    quota: plan ? { plan: plan.id, maxKeys: plan.maxKeys, monthlyCredits: plan.monthlyCredits } : { plan: "none", maxKeys: null, monthlyCredits: 100 },
    workspace: { id: ctx.orgId, name: ctx.orgName },
  });
}

export async function POST(req: Request) {
  const ctx = await resolveOrgContext(req);

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

  // Plan quotas apply to organizations; the open workspace keeps the v0.4.x
  // demo default (100 credits, no key-count limit).
  let initialCredits = 100;
  if (ctx.orgId) {
    const sub = await db.billingSubscription.findUnique({ where: { organizationId: ctx.orgId } });
    const plan = sub && sub.status !== "canceled" ? planById(sub.plan) : null;
    if (plan) {
      initialCredits = plan.monthlyCredits;
      if (plan.maxKeys !== -1) {
        const active = await db.apiKey.count({ where: { organizationId: ctx.orgId, revokedAt: null } });
        if (active >= plan.maxKeys) {
          return NextResponse.json(
            { error: `Plan '${plan.id}' allows ${plan.maxKeys} active key(s). Revoke one or upgrade (Billing section).` },
            { status: 402 },
          );
        }
      }
    }
  }

  const raw = `lacuna_live_${crypto.randomBytes(24).toString("hex")}`;
  const rec = await db.apiKey.create({
    data: {
      organizationId: ctx.orgId,
      label: parsed.data.label,
      keyPrefix: raw.slice(0, 12),
      keyHash: sha256(raw),
      scope: parsed.data.scope,
      credits: initialCredits,
    },
  });

  await recordAudit(ctx.actor, "key.issue", {
    keyId: rec.id,
    label: rec.label,
    scope: rec.scope,
    credits: rec.credits,
    workspace: ctx.orgSlug ?? "open",
  });

  return NextResponse.json({
    id: rec.id,
    label: rec.label,
    scope: rec.scope,
    credits: rec.credits,
    key: raw, // shown exactly once
    notice:
      "Store this key now — it is never shown again (only its SHA-256 hash is stored). The key authenticates programmatic calls via the x-api-key header, is scoped to your current workspace, and carries per-sample credits.",
  });
}

export async function DELETE(req: Request) {
  const ctx = await resolveOrgContext(req);
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "?id= is required." }, { status: 400 });
  const rec = await db.apiKey.findUnique({ where: { id } });
  if (!rec || rec.organizationId !== ctx.orgId) {
    return NextResponse.json({ error: "Key not found." }, { status: 404 });
  }
  if (rec.revokedAt) return NextResponse.json({ error: "Key already revoked." }, { status: 400 });
  await db.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
  await recordAudit(ctx.actor, "key.revoke", { keyId: id, label: rec.label, workspace: ctx.orgSlug ?? "open" });
  return NextResponse.json({ id, revoked: true });
}
