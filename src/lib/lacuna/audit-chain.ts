// Append-only, hash-chained audit trail (21 CFR Part 11-style electronic
// records, research use only). Each entry hashes the previous entry's hash,
// so any retroactive edit breaks every subsequent hash and the one-click
// verifier catches it.

import crypto from "crypto";
import { db } from "@/lib/db";

export type AuditActor = string; // "console" | "api:<keyPrefix>"

export interface AuditDetail {
  [key: string]: unknown;
}

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function canonicalDetail(detail: AuditDetail): string {
  // Stable key ordering so the hash is reproducible.
  const keys = Object.keys(detail).sort();
  return JSON.stringify(
    keys.reduce<Record<string, unknown>>((acc, k) => {
      acc[k] = detail[k];
      return acc;
    }, {})
  );
}

export function computeHash(seq: number, prevHash: string | null, actor: string, action: string, detail: string, createdAtIso: string): string {
  return sha256(`${seq}|${prevHash ?? "genesis"}|${actor}|${action}|${detail}|${createdAtIso}`);
}

/**
 * Append one audit entry. Never throws — an audit failure must not break the
 * user action being recorded (the action itself is fail-closed at its own
 * gates); a broken chain is however visible via verifyAuditChain().
 */
export async function recordAudit(actor: AuditActor, action: string, detail: AuditDetail): Promise<void> {
  try {
    const last = await db.auditLog.findFirst({ orderBy: { seq: "desc" } });
    const prevHash = last?.hash ?? null;
    // seq is autoincrement; we must know it before hashing. Prisma returns it
    // only after create, so we insert with a placeholder hash, then update it
    // with the true chained hash in the same transaction-ish flow.
    const rec = await db.auditLog.create({
      data: {
        actor,
        action,
        detail: canonicalDetail(detail),
        prevHash,
        hash: "pending",
      },
    });
    const hash = computeHash(rec.seq, prevHash, actor, action, rec.detail, rec.createdAt.toISOString());
    await db.auditLog.update({ where: { seq: rec.seq }, data: { hash } });
  } catch {
    // best-effort by design; see DEVIATIONS.md D-25
  }
}

export interface ChainVerification {
  ok: boolean;
  n: number;
  brokenAt: number | null;
  reason: string | null;
}

/** Recompute every hash and verify linkage; returns the first break if any. */
export async function verifyAuditChain(): Promise<ChainVerification> {
  const entries = await db.auditLog.findMany({ orderBy: { seq: "asc" } });
  let prevHash: string | null = null;
  for (const e of entries) {
    if (e.prevHash !== prevHash) {
      return { ok: false, n: entries.length, brokenAt: e.seq, reason: `prevHash mismatch at #${e.seq}: stored "${e.prevHash}", expected "${prevHash}"` };
    }
    const expected = computeHash(e.seq, prevHash, e.actor, e.action, e.detail, e.createdAt.toISOString());
    if (e.hash !== expected) {
      return { ok: false, n: entries.length, brokenAt: e.seq, reason: `hash mismatch at #${e.seq}: stored "${e.hash}", recomputed "${expected}"` };
    }
    prevHash = e.hash;
  }
  return { ok: true, n: entries.length, brokenAt: null, reason: null };
}
