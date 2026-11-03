import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuditChain } from "@/lib/lacuna/audit-chain";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const verify = url.searchParams.get("verify") === "1";
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 200);

  const entries = await db.auditLog.findMany({ orderBy: { seq: "desc" }, take: limit });
  const tip = await db.auditLog.findFirst({ orderBy: { seq: "desc" } });
  const verification = verify ? await verifyAuditChain() : null;

  return NextResponse.json({
    entries: entries.map((e) => ({
      seq: e.seq,
      id: e.id,
      actor: e.actor,
      action: e.action,
      detail: e.detail,
      hash: e.hash,
      prevHash: e.prevHash,
      createdAt: e.createdAt,
    })),
    tip: tip ? { seq: tip.seq, hash: tip.hash } : null,
    verification,
    notice:
      "Append-only, hash-chained record of console/API activity (21 CFR Part 11-style electronic records, research use only). Each hash covers the previous entry's hash, so retroactive edits break the chain and the verifier catches it.",
  });
}
