import { NextResponse } from "next/server";
import { loadFinalReport, loadModelCard, RUO_NOTICE } from "@/lib/lacuna/data";
import { CLI_REFERENCE } from "@/lib/lacuna/cli-reference";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    notice: RUO_NOTICE,
    finalReport: loadFinalReport(),
    modelCard: loadModelCard(),
    cliReference: CLI_REFERENCE,
  });
}
