import { NextResponse } from "next/server";
import { loadGates, loadDeviationsParsed } from "@/lib/lacuna/gates";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    gates: loadGates(),
    deviations: loadDeviationsParsed(),
  });
}
