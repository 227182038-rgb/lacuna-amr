// Phase 1 — session probe (v0.5.0). Returns the caller's identity, the
// organizations they belong to, and which one is active. Used by the header
// account widget and every section that needs the workspace context.

import { NextResponse } from "next/server";
import { getSession, membershipsOf, readSessionCookie } from "@/lib/lacuna/auth";
import { OPEN_WORKSPACE_NAME } from "@/lib/lacuna/org-context";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession(readSessionCookie(req));
  if (!session) {
    return NextResponse.json({
      authenticated: false,
      workspace: { id: null, name: OPEN_WORKSPACE_NAME, via: "open" },
    });
  }
  const memberships = await membershipsOf(session.userId);
  const active = session.activeOrgId ? memberships.find((m) => m.orgId === session.activeOrgId) : undefined;
  const ctx = active ?? memberships[0] ?? null;
  return NextResponse.json({
    authenticated: true,
    user: { id: session.userId, email: session.email, name: session.name },
    organizations: memberships,
    activeOrganization: ctx ? { id: ctx.orgId, name: ctx.orgName, slug: ctx.orgSlug, role: ctx.role } : null,
    workspace: ctx
      ? { id: ctx.orgId, name: ctx.orgName, via: "session" }
      : { id: null, name: OPEN_WORKSPACE_NAME, via: "open" },
    expiresAt: session.expiresAt.toISOString(),
  });
}
