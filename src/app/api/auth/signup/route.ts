// Phase 1 — sign-up (v0.5.0). Creates the account AND its first organization
// (owner membership), then signs the user in. Password: scrypt, min 8 chars.
// The session cookie is httpOnly + SameSite=Lax (secure in production).

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { SESSION_COOKIE, createSession, hashPassword, uniqueSlug } from "@/lib/lacuna/auth";

export const dynamic = "force-dynamic";

const signupSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().min(1).max(120),
  orgName: z.string().min(1).max(120),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
      { status: 400 },
    );
  }
  const email = parsed.data.email.toLowerCase().trim();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists — sign in instead." }, { status: 409 });
  }

  const user = await db.user.create({
    data: { email, name: parsed.data.name.trim(), passwordHash: hashPassword(parsed.data.password) },
  });
  const org = await db.organization.create({
    data: { name: parsed.data.orgName.trim(), slug: await uniqueSlug(parsed.data.orgName) },
  });
  await db.membership.create({ data: { userId: user.id, orgId: org.id, role: "owner" } });

  const { token, expiresAt } = await createSession(user.id, org.id);

  await recordAudit(`user:${email}`, "auth.signup", { userId: user.id, orgId: org.id, orgSlug: org.slug });

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    organization: { id: org.id, name: org.name, slug: org.slug, role: "owner" },
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
