// Phase 1 — multi-tenant authentication (v0.5.0).
// Email + password with per-user salted scrypt (Node crypto, no external
// dependency), server-side sessions whose httpOnly cookie carries a random
// token (only its SHA-256 hash is stored). Passwords are never logged and
// never leave the server; sessions expire after 7 days.

import crypto from "crypto";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "lacuna_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// --- password hashing --------------------------------------------------------

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `scrypt:${SCRYPT_N}:${SCRYPT_R}:${SCRYPT_P}:${salt.toString("base64")}:${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split(":");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const [, nStr, rStr, pStr, saltB64, hashB64] = parts;
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const actual = crypto.scryptSync(password, salt, expected.length, {
      N: parseInt(nStr, 10),
      r: parseInt(rStr, 10),
      p: parseInt(pStr, 10),
    });
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// --- sessions -----------------------------------------------------------------

export interface SessionInfo {
  sessionId: string;
  userId: string;
  email: string;
  name: string;
  activeOrgId: string | null;
  expiresAt: Date;
}

export function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export function newSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string, activeOrgId: string | null): Promise<{ token: string; expiresAt: Date }> {
  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.session.create({ data: { userId, tokenHash: sha256Hex(token), activeOrgId, expiresAt } });
  return { token, expiresAt };
}

/** Look up the session for a raw cookie token. Returns null when absent/expired. */
export async function getSession(token: string | null | undefined): Promise<SessionInfo | null> {
  if (!token) return null;
  const rec = await db.session.findUnique({ where: { tokenHash: sha256Hex(token) } });
  if (!rec) return null;
  if (rec.expiresAt.getTime() < Date.now()) {
    await db.session.delete({ where: { id: rec.id } }).catch(() => undefined);
    return null;
  }
  const user = await db.user.findUnique({ where: { id: rec.userId } });
  if (!user) return null;
  return {
    sessionId: rec.id,
    userId: user.id,
    email: user.email,
    name: user.name,
    activeOrgId: rec.activeOrgId,
    expiresAt: rec.expiresAt,
  };
}

export async function destroySession(token: string | null | undefined): Promise<void> {
  if (!token) return;
  await db.session.delete({ where: { tokenHash: sha256Hex(token) } }).catch(() => undefined);
}

/** Parse the session cookie out of a Request's Cookie header (no next/headers
 *  dependency so this works from plain route handlers and tests alike). */
export function readSessionCookie(req: Request): string | null {
  const raw = req.headers.get("cookie");
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === SESSION_COOKIE) return decodeURIComponent(rest.join("="));
  }
  return null;
}

// --- organizations -------------------------------------------------------------

export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "org";
}

export async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  for (let i = 2; i < 100; i++) {
    const existing = await db.organization.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${i}`;
  }
  // cryptographic fallback — practically unreachable
  return `${base}-${crypto.randomBytes(3).toString("hex")}`;
}

export type OrgRole = "owner" | "admin" | "member";

export interface MembershipInfo {
  orgId: string;
  orgName: string;
  orgSlug: string;
  role: OrgRole;
}

export async function membershipsOf(userId: string): Promise<MembershipInfo[]> {
  const rows = await db.membership.findMany({ where: { userId }, include: { org: true } });
  return rows.map((r) => ({ orgId: r.org.id, orgName: r.org.name, orgSlug: r.org.slug, role: r.role as OrgRole }));
}

export function canManageBilling(role: OrgRole): boolean {
  return role === "owner" || role === "admin";
}

export function canManageMembers(role: OrgRole): boolean {
  return role === "owner" || role === "admin";
}
