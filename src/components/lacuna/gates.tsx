"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ScrollText } from "lucide-react";
import { ErrorBox, LoadingBlock, MarkdownLite, SectionHeader, VerdictBadge } from "./ui-bits";
import type { GatesResponse } from "@/lib/lacuna/api-types";

export function GatesSection() {
  const [data, setData] = useState<GatesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gates")
      .then((r) => r.json())
      .then((d: GatesResponse) => setData(d))
      .catch(() => setError("Failed to load gates."));
  }, []);

  const ordered = useMemo(() => {
    if (!data) return [];
    const sortKey = (id: string) => parseInt(id.slice(1), 10);
    return [...data.gates].sort((a, b) => sortKey(a.id) - sortKey(b.id));
  }, [data]);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <LoadingBlock lines={6} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="gates G0–G11"
        title="Evidence-gated pipeline — verdicts read from the gate files"
        description="Each gate file (gates/GX.md) is loaded and its verdict extracted at request time; the console cannot disagree with the evidence. A FAIL gate stops downstream phases fail-closed — G7 (phase B) was never attempted because G5 failed."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {ordered.map((g) => (
          <Card key={g.id} className="bg-zinc-900/60 border-zinc-800">
            <Collapsible>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-sm text-emerald-400">{g.id}</div>
                    <CardTitle className="mt-0.5 text-sm font-medium text-zinc-200">{g.title}</CardTitle>
                    <CardDescription className="mt-0.5 font-mono text-[10px]">{g.filePath}</CardDescription>
                  </div>
                  <VerdictBadge verdict={g.verdict} />
                </div>
              </CardHeader>
              <CardContent>
                <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-700">
                  <span className="font-mono text-[11px]">{g.verdictRaw.slice(0, 100)}{g.verdictRaw.length > 100 ? "…" : ""}</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 max-h-72 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
                    <MarkdownLite text={g.evidence} />
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="h-4 w-4 text-emerald-500" /> Deviations log — {data.deviations.length} entries
          </CardTitle>
          <CardDescription>
            Every departure from the brief with UTC timestamp, reason and consequence (protocol/DEVIATIONS.md). The audit
            trail is part of the product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
            {data.deviations.map((d) => (
              <div key={d.id} className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] text-emerald-400">{d.id}</span>
                  <span className="font-mono text-[10px] text-zinc-500">{d.utc}</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{d.deviation}</p>
                <div className="mt-1.5 grid gap-1 text-[11px] text-zinc-500 md:grid-cols-2">
                  <div>
                    <span className="text-zinc-600">Reason: </span>
                    {d.reason}
                  </div>
                  <div>
                    <span className="text-zinc-600">Consequence: </span>
                    {d.consequence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
