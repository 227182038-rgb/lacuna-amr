import { NextResponse } from "next/server";
import { marketSummary } from "@/lib/lacuna/market";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(marketSummary());
}
