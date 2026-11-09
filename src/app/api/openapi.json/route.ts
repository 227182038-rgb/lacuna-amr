// GET /api/openapi.json — OpenAPI 3.1 specification for the /api/v1 surface.

import { corsJson, corsOptions } from "@/lib/lacuna/v1";
import { buildOpenApiSpec } from "@/lib/lacuna/openapi";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  return corsJson(buildOpenApiSpec());
}
