"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, ExternalLink, Quote, TrendingUp } from "lucide-react";
import { ErrorBox, LoadingBlock, SectionHeader, StatCard } from "./ui-bits";

interface MarketSource {
  id: string;
  title: string;
  detail: string;
  url: string;
  retrieved: string;
}

interface DemandSignal {
  id: string;
  signal: string;
  evidence: string;
  sourceId: string;
  lacunaAnswer: string;
  shipped: boolean;
}

interface MarketData {
  retrievedOn: string;
  integrityNote: string;
  sources: MarketSource[];
  signals: DemandSignal[];
}

export function MarketSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [data, setData] = useState<MarketData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/market")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setError("Could not load market research."));
  }, []);

  const sourceById = new Map((data?.sources ?? []).map((s) => [s.id, s]));

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="market research"
        title="What the market demands — and where it maps into LACUNA"
        description="Deep-research findings that drove this build (retrieved 2026-11-04). Every figure below carries its source; nothing is invented. Each demand signal maps to a shipped feature, because a commercial feature without a cited demand signal is a guess."
      />

      {error ? <ErrorBox message={error} /> : null}
      {data === null && !error ? <LoadingBlock lines={6} /> : null}

      {data ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="AMR diagnostics market, 2025" value="US$3.4B" sub="→ US$4.7B by 2033 (CAGR 4.1%)" accent="emerald" />
            <StatCard label="Hospitals' share of end-use" value="58.2%" sub="dominant buyer segment, 2025" accent="emerald" />
            <StatCard label="ResFinder analyses, 2012–21" value="820,803" sub="from 61,776 IPs in 171 countries" accent="zinc" />
            <StatCard label="US AMR infections / year" value="~2.8M" sub="CDC estimate" accent="amber" />
            <StatCard label="Projected AMR deaths by 2050" value="10M/yr" sub="vs ~700k/yr today (USP)" accent="red" />
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-emerald-500">
              <TrendingUp className="h-3.5 w-3.5" /> Demand signal → shipped feature
            </h3>
            <div className="grid gap-3 lg:grid-cols-2">
              {data.signals.map((s) => {
                const src = sourceById.get(s.sourceId);
                return (
                  <Card key={s.id} className="border-zinc-800 bg-zinc-900/60">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold leading-snug text-zinc-100">{s.signal}</span>
                        <span className="flex shrink-0 items-center gap-1 rounded border border-emerald-800 bg-emerald-950/50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                          <BadgeCheck className="h-3 w-3" /> SHIPPED
                        </span>
                      </div>
                      <div className="flex gap-2 rounded-md border border-zinc-800 bg-zinc-950/40 p-2.5">
                        <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
                        <div>
                          <p className="text-xs leading-relaxed text-zinc-400">{s.evidence}</p>
                          {src ? (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 underline underline-offset-2"
                            >
                              {src.id} <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs leading-relaxed text-zinc-300">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">LACUNA answer: </span>
                        {s.lacunaAnswer}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">From signals to tiers</CardTitle>
              <CardDescription>
                The research also sets the pricing architecture: free open core, Lab subscription aligned to the published
                US$5,000–25,000/yr clinical-genomics SaaS band, and per-engagement enterprise pricing on the US$0.50–7/sample
                compute benchmark.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-800 bg-emerald-950/30 text-emerald-300 hover:border-emerald-700 hover:text-emerald-200"
                onClick={() => onNavigate("services")}
              >
                See the three tiers <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>

          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-emerald-500">Sources ({data.sources.length})</h3>
            <Card className="border-zinc-800 bg-zinc-900/60">
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto">
                  {data.sources.map((s) => (
                    <div key={s.id} className="border-b border-zinc-800/60 p-3.5 last:border-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-xs font-medium leading-snug text-zinc-200 underline decoration-zinc-700 underline-offset-2 hover:text-emerald-300"
                          >
                            {s.title}
                          </a>
                          <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{s.detail}</p>
                        </div>
                        <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">↗ {s.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">{data.integrityNote}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
