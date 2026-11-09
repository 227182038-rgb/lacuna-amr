// POST /api/v1/report — versioned, authenticated, metered mirror of the
// console GET /api/report (final report + model card + CLI reference).
// Cost: 1 credit. Scope: read.

import { corsJson, corsOptions, requireApiAuth, v1Report } from "@/lib/lacuna/v1";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request) {
  const auth = await requireApiAuth(req, "read");
  if (!auth.ok) return auth.response;

  // Body is optional (the console route is a GET with no parameters); accept
  // an empty or JSON-object body, reject malformed JSON.
  let body: unknown = {};
  try {
    const text = await req.text();
    if (text.trim() !== "") body = JSON.parse(text);
  } catch {
    return corsJson({ error: "Invalid JSON body." }, 400);
  }

  const result = await v1Report({ rec: auth.rec, actor: auth.actor }, body, "v1");
  if (!result.ok) return corsJson({ error: result.error }, result.status);
  return corsJson(result.envelope);
}
