// Phase 1 — tenant resolution (v0.5.0). Every API route resolves the calling
// workspace through this module exactly once, then scopes all reads/writes by
// its organizationId:
//   1. signed-in console session cookie → the user's ACTIVE organization
//      (falls back to their first membership; "open workspace" if they have none)
//   2. x-api-key programmatic call                     → the KEY's organization
//   3. anything else                                   → the shared open workspace
//     (organizationId = null — the v0.4.x demo console, unchanged behavior)
// A caller can NEVER specify an organizationId in the request body: identity
// comes only from the session cookie or the key hash.

import { db } from "@/lib/db";
import { getSession, readSessionCookie, sha256Hex, type OrgRole } from "./auth";

export interface OrgContext {
  orgId: string | null; // null = shared open workspace
  orgName: string; // display name ("Open workspace" when null)
  orgSlug: string | null;
  role: OrgRole | null; // caller's role in the org (null = open workspace)
  via: "session" | "apikey" | "open";
  userId: string | null;
  userEmail: string | null;
  actor: string; // audit actor string
}

export const OPEN_WORKSPACE_NAME = "Open workspace";

export async function resolveOrgContext(req: Request): Promise<OrgContext> {
  // 1) session cookie
  const session = await getSession(readSessionCookie(req));
  if (session) {
    const memberships = await db.membership.findMany({ where: { userId: session.userId }, include: { org: true } });
    if (memberships.length === 0) {
      return openContext(session.userId, session.email);
    }
    const active = session.activeOrgId ? memberships.find((m) => m.orgId === session.activeOrgId) : undefined;
    const ctx = active ?? memberships[0];
    return {
      orgId: ctx.org.id,
      orgName: ctx.org.name,
      orgSlug: ctx.org.slug,
      role: ctx.role as OrgRole,
      via: "session",
      userId: session.userId,
      userEmail: session.email,
      actor: `user:${session.email}`,
    };
  }

  // 2) API key — attribute to the key's organization (null = open workspace)
  const rawKey = req.headers.get("x-api-key");
  if (rawKey) {
    const rec = await db.apiKey.findFirst({ where: { keyHash: sha256Hex(rawKey), revokedAt: null } });
    if (rec && rec.organizationId) {
      const org = await db.organization.findUnique({ where: { id: rec.organizationId } });
      if (org) {
        return {
          orgId: org.id,
          orgName: org.name,
          orgSlug: org.slug,
          role: null, // programmatic identity has no human role
          via: "apikey",
          userId: null,
          userEmail: null,
          actor: `api:${rec.keyPrefix}`,
        };
      }
    }
  }

  // 3) shared open workspace
  return openContext();
}

function openContext(userId: string | null = null, userEmail: string | null = null): OrgContext {
  return {
    orgId: null,
    orgName: OPEN_WORKSPACE_NAME,
    orgSlug: null,
    role: null,
    via: "open",
    userId,
    userEmail,
  };
}

/** Prisma `where` fragment scoping a model by the caller's workspace.
 *  `organizationId: null` matches only legacy/open-workspace rows. */
export function orgScope(ctx: OrgContext) {
  return { organizationId: ctx.orgId };
}
