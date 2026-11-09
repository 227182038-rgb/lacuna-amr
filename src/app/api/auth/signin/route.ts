// Phase 1 — sign-in (v0.5.0). Verifies the scrypt password and issues a fresh
// session token (previous tokens stay valid until expiry; sign-out revokes
// the current one).

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import {
  SESSION_COOKIE,
  createSession,
  membershipsOf,
  verifyPassword,
} from "@/lib/lacuna/auth";

export const dynamic = "force-dynamic";

const signinSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = signinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();
  const user = await db.user.findUnique({ where: { email } });
  // constant-ish response regardless of which factor failed
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    await recordAudit(`user:${email}`, "auth.signin_failed", {});
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const memberships = await membershipsOf(user.id);
  const activeOrgId = memberships[0]?.orgId ?? null;
  const { token, expiresAt } = await createSession(user.id, activeOrgId);

  await recordAudit(`user:${email}`, "auth.signin", { userId: user.id });

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    organizations: memberships,
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return res;
}
