// Phase 1 — sign-out (v0.5.0). Revokes the current session server-side and
// clears the cookie.

import { NextResponse } from "next/server";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { SESSION_COOKIE, destroySession, getSession, readSessionCookie } from "@/lib/lacuna/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSession(readSessionCookie(req));
  if (session) {
    await destroySession(readSessionCookie(req));
    await recordAudit(session.userEmail ? `user:${session.userEmail}` : "console", "auth.signout", { userId: session.userId });
  }
  const res = NextResponse.json({ signedOut: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
