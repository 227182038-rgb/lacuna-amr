import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  sku: z.enum(["S1", "S2", "S3"]),
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  org: z.string().max(200).optional().or(z.literal("")),
  isolates: z.number().int().min(0).max(10_000_000).optional().nullable(),
  message: z.string().max(4000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  }
  const { sku, name, email, org, isolates, message } = parsed.data;

  const rec = await db.serviceRequest.create({
    data: {
      sku,
      name,
      email,
      org: org || null,
      isolates: isolates ?? null,
      message: message || null,
    },
  });

  await recordAudit("console", "service.request", {
    sku,
    isolates: isolates ?? null,
    org: org || null,
    // name/email intentionally NOT recorded in the audit trail (data minimisation)
  });

  return NextResponse.json({
    id: rec.id,
    status: rec.status,
    notice:
      "Research-use-only audit services. This demo console records the inquiry locally; no data leaves this environment and no service engagement is created by this form.",
  });
}

export async function GET() {
  const requests = await db.serviceRequest.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json({
    requests: requests.map((r) => ({
      id: r.id,
      sku: r.sku,
      name: r.name,
      org: r.org,
      isolates: r.isolates,
      status: r.status,
      createdAt: r.createdAt,
    })),
  });
}
