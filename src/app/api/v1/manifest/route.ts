// GET /api/v1/manifest — versioned, authenticated mirror of the console
// GET /api/manifest. Cost: 0 credits. Scope: read.

import { corsJson, corsOptions, requireApiAuth, v1Manifest } from "@/lib/lacuna/v1";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: Request) {
  const auth = await requireApiAuth(req, "read");
  if (!auth.ok) return auth.response;

  const result = await v1Manifest({ rec: auth.rec, actor: auth.actor }, {}, "v1");
  if (!result.ok) return corsJson({ error: result.error }, result.status);
  return corsJson(result.envelope);
}
