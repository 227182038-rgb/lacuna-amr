// POST /api/v1/audit-dataset — versioned, authenticated, metered mirror of
// the console POST /api/audit-dataset (same body contract: source, text/paste,
// cohortOnly, thresholds). Cost: 5 credits. Scope: read.

import { corsJson, corsOptions, requireApiAuth, v1AuditDataset } from "@/lib/lacuna/v1";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request) {
  const auth = await requireApiAuth(req, "read");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return corsJson({ error: "Invalid JSON body." }, 400);
  }

  const result = await v1AuditDataset({ rec: auth.rec, actor: auth.actor }, body, "v1");
  if (!result.ok) return corsJson({ error: result.error }, result.status);
  return corsJson(result.envelope);
}
