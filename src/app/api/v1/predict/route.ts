// POST /api/v1/predict — versioned, authenticated, metered mirror of the
// console POST /api/predict (same validation + engine call). Cost: 1 credit.
// Scope: read+predict.

import { corsJson, corsOptions, requireApiAuth, v1Predict } from "@/lib/lacuna/v1";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request) {
  const auth = await requireApiAuth(req, "read+predict");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return corsJson({ error: "Invalid JSON body." }, 400);
  }

  const result = await v1Predict({ rec: auth.rec, actor: auth.actor }, body, "v1");
  if (!result.ok) return corsJson({ error: result.error }, result.status);
  return corsJson(result.envelope);
}
