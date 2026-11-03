import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAudit } from "@/lib/lacuna/audit-chain";
import { DRUGS, RUO_NOTICE } from "@/lib/lacuna/data";
import { engineSummary, predict } from "@/lib/lacuna/engine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const drug = url.searchParams.get("drug");
  if (!drug || !DRUGS.includes(drug as (typeof DRUGS)[number])) {
    return NextResponse.json({ error: `?drug= must be one of: ${DRUGS.join(", ")}` }, { status: 400 });
  }
  return NextResponse.json({ engine: engineSummary(drug), notice: RUO_NOTICE });
}

interface PredictBody {
  drug?: string;
  isolate?: string;
  toggles?: Record<string, 0 | 1>;
  modelType?: "M0" | "M1" | "M2";
}

export async function POST(req: Request) {
  let body: PredictBody;
  try {
    body = (await req.json()) as PredictBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const drug = body.drug;
  if (!drug || !DRUGS.includes(drug as (typeof DRUGS)[number])) {
    return NextResponse.json({ error: `drug must be one of: ${DRUGS.join(", ")}` }, { status: 400 });
  }
  const modelType = body.modelType ?? "M1";
  if (!["M0", "M1", "M2"].includes(modelType)) {
    return NextResponse.json({ error: "modelType must be M0, M1 or M2" }, { status: 400 });
  }
  if (body.isolate === undefined && !body.toggles) {
    return NextResponse.json({ error: "Provide either an isolate accession or feature toggles." }, { status: 400 });
  }

  const out = predict({ drug, isolate: body.isolate, toggles: body.toggles, modelType });
  if ("error" in out) {
    return NextResponse.json({ error: out.error }, { status: 400 });
  }

  let runId: string | null = null;
  try {
    const rec = await db.predictRun.create({
      data: {
        drug: out.drug,
        isolate: out.isolate,
        modelType: out.modelType,
        m0Call: out.m0Call,
        pR: out.pR,
        call: out.call,
        conformalSet: out.conformalSetMondrian,
        input: JSON.stringify({ isolate: body.isolate ?? null, toggles: body.toggles ?? {}, modelType }),
        output: JSON.stringify(out),
      },
    });
    runId = rec.id;
  } catch {
    // best-effort persistence
  }

  await recordAudit("console", "predict.run", {
    runId,
    drug: out.drug,
    isolate: out.isolate,
    modelType: out.modelType,
    call: out.call,
    pR: Number(out.pR.toFixed(4)),
    conformalSet: out.conformalSetMondrian,
  });

  return NextResponse.json({ prediction: out, runId });
}
