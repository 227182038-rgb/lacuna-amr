import { NextResponse } from "next/server";
import { buildManifestPayload } from "@/lib/lacuna/manifest-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(buildManifestPayload());
}
