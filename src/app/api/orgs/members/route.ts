// Phase 1 — organization members (v0.5.0).
//   GET    ?orgId=   list members (any member of the org may view)
//   POST   add       { orgId, email, role } — email must belong to a signed-up
//                    user (no email invitations are sent in this sandbox);
//                    owner/admin only; plan maxMembers enforced
//   DELETE remove    { orgId, userId } — owner/admin only; owners cannot be
//                    removed while they hold the role (an org needs an owner)

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { canManageMembers, getSession, readSessionCookie, type OrgRole } from "@/lib/lacuna/auth";
import { planById } from "@/lib/lacuna/billing";

export const dynamic = "force-dynamic";

const addSchema = z.object({
  action: z.literal("add"),
  orgId: z.string().min(1),
  email: z.string().email().max(200),
  role: z.enum(["admin", "member"]).default("member"),
});

const removeSchema = z.object({
  action: z.literal("remove"),
  orgId: z.string().min(1),
  userId: z.string().min(1),
});

async function callerRole(userId: string, orgId: string): Promise<OrgRole | null> {
  const m = await db.membership.findFirst({ where: { userId, orgId } });
  return (m?.role as OrgRole) ?? null;
}

export async function GET(req: Request) {
  const session = await getSession(readSessionCookie(req));
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const orgId = new URL(req.url).searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "?orgId= is required." }, { status: 400 });
  const role = await callerRole(session.userId, orgId);
  if (!role) return NextResponse.json({ error: "You are not a member of that organization." }, { status: 403 });

  const members = await db.membership.findMany({ where: { orgId }, include: { user: true }, orderBy: { createdAt: "asc" } });
  const sub = await db.billingSubscription.findUnique({ where: { organizationId: orgId } });
  const plan = sub && sub.status !== "canceled" ? planById(sub.plan) : null;
  return NextResponse.json({
    members: members.map((m) => ({
      userId: m.user.id,
      email: m.user.email,
      name: m.user.name,
      role: m.role,
      addedAt: m.createdAt.toISOString(),
    })),
    quota: { maxMembers: plan?.maxMembers ?? 1, plan: plan?.id ?? "none" },
  });
}

export async function POST(req: Request) {
  const session = await getSession(readSessionCookie(req));
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = z.union([addSchema, removeSchema]).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
      { status: 400 },
    );
  }

  const myRole = await callerRole(session.userId, parsed.data.orgId);
  if (!myRole || !canManageMembers(myRole)) {
    return NextResponse.json({ error: "Only owners or admins can manage members." }, { status: 403 });
  }

  if (parsed.data.action === "add") {
    // Plan quota is enforced BEFORE the user lookup: an add that would exceed
    // the seat limit is rejected regardless of whether the email exists yet.
    const sub = await db.billingSubscription.findUnique({ where: { organizationId: parsed.data.orgId } });
    const plan = sub && sub.status !== "canceled" ? planById(sub.plan) : null;
    const maxMembers = plan?.maxMembers ?? 1;
    const count = await db.membership.count({ where: { orgId: parsed.data.orgId } });
    if (maxMembers !== -1 && count >= maxMembers) {
      return NextResponse.json(
        { error: `Plan '${plan?.id ?? "default"}' allows ${maxMembers} member(s). Upgrade to add more.` },
        { status: 402 },
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "No account exists for that email yet — ask them to sign up first, then add them." },
        { status: 404 },
      );
    }
    const existing = await db.membership.findFirst({ where: { userId: user.id, orgId: parsed.data.orgId } });
    if (existing) return NextResponse.json({ error: "That user is already a member." }, { status: 409 });

    const rec = await db.membership.create({
      data: { userId: user.id, orgId: parsed.data.orgId, role: parsed.data.role },
    });
    await recordAudit(`user:${session.email}`, "member.add", {
      orgId: parsed.data.orgId,
      addedEmail: email,
      role: rec.role,
    });
    return NextResponse.json({ member: { userId: user.id, email: user.email, name: user.name, role: rec.role } });
  }

  // remove
  const target = await db.membership.findFirst({ where: { userId: parsed.data.userId, orgId: parsed.data.orgId } });
  if (!target) return NextResponse.json({ error: "Member not found." }, { status: 404 });
  if (target.role === "owner") {
    return NextResponse.json({ error: "The owner cannot be removed — transfer ownership first." }, { status: 400 });
  }
  await db.membership.delete({ where: { id: target.id } });
  await recordAudit(`user:${session.email}`, "member.remove", { orgId: parsed.data.orgId, removedUserId: parsed.data.userId });
  return NextResponse.json({ removed: true });
}
