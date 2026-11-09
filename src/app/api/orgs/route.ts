// Phase 1 — organizations (v0.5.0).
//   GET              my organizations + the active one (session required)
//   POST   create    new organization (caller becomes owner; requires session)
//   POST   switch    set the session's active organization

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import {
  getSession,
  membershipsOf,
  readSessionCookie,
  uniqueSlug,
} from "@/lib/lacuna/auth";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  action: z.literal("create"),
  name: z.string().min(1).max(120),
});

const switchSchema = z.object({
  action: z.literal("switch"),
  orgId: z.string().min(1),
});

export async function GET(req: Request) {
  const session = await getSession(readSessionCookie(req));
  if (!session) {
    return NextResponse.json({ error: "Sign in to manage organizations." }, { status: 401 });
  }
  const memberships = await membershipsOf(session.userId);
  const active = session.activeOrgId ? memberships.find((m) => m.orgId === session.activeOrgId) : undefined;

  // plan info per org for the UI (quota display)
  const orgsWithPlan = await Promise.all(
    memberships.map(async (m) => {
      const sub = await db.billingSubscription.findUnique({ where: { organizationId: m.orgId } });
      return { ...m, plan: sub?.plan ?? null, status: sub?.status ?? "none" };
    }),
  );

  return NextResponse.json({
    organizations: orgsWithPlan,
    activeOrganizationId: (active ?? memberships[0])?.orgId ?? null,
  });
}

export async function POST(req: Request) {
  const session = await getSession(readSessionCookie(req));
  if (!session) {
    return NextResponse.json({ error: "Sign in to manage organizations." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = z.union([createSchema, switchSchema]).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
      { status: 400 },
    );
  }

  if (parsed.data.action === "create") {
    const org = await db.organization.create({
      data: { name: parsed.data.name.trim(), slug: await uniqueSlug(parsed.data.name) },
    });
    await db.membership.create({ data: { userId: session.userId, orgId: org.id, role: "owner" } });
    await recordAudit(`user:${session.email}`, "org.create", { orgId: org.id, orgSlug: org.slug });

    // switch the session to the new org
    await db.session.update({ where: { id: session.sessionId }, data: { activeOrgId: org.id } });
    return NextResponse.json({ organization: { id: org.id, name: org.name, slug: org.slug, role: "owner" } });
  }

  // switch
  const { orgId } = parsed.data;
  const membership = await db.membership.findFirst({ where: { userId: session.userId, orgId } });
  if (!membership) {
    return NextResponse.json({ error: "You are not a member of that organization." }, { status: 403 });
  }
  await db.session.update({ where: { id: session.sessionId }, data: { activeOrgId: orgId } });
  const org = await db.organization.findUnique({ where: { id: orgId } });
  await recordAudit(`user:${session.email}`, "org.switch", { orgId, orgSlug: org?.slug });
  return NextResponse.json({ activeOrganizationId: orgId, name: org?.name, slug: org?.slug });
}
