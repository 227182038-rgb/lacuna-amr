"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBox, fmt, KeyValue, LoadingBlock, SectionHeader } from "./ui-bits";
import type { OverviewResponse } from "@/lib/lacuna/api-types";

const LABEL_COLORS: Record<string, string> = {
  S: "#34d399",
  R: "#f87171",
  I: "#fbbf24",
  INDETERMINATE_CENSORED: "#71717a",
};

export function CohortSection() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/overview")
      .then((r) => r.json())
      .then((d: OverviewResponse) => setData(d))
      .catch(() => setError("Failed to load cohort data."));
  }, []);

  const labelData = useMemo(() => {
    if (!data) return [];
    const drugs = Object.keys(data.labelCounts).sort();
    return drugs.map((drug) => {
      const row: Record<string, string | number> = { drug };
      for (const [k, v] of Object.entries(data.labelCounts[drug])) row[k] = v;
      return row;
    });
  }, [data]);

  const lineageData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.cohort.coarseSizes)
      .map(([lineage, n]) => ({ lineage: `L${lineage}`, n }))
      .sort((a, b) => b.n - a.n);
  }, [data]);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <LoadingBlock lines={6} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="cohort explorer"
        title="The frozen 240-isolate E. coli cohort"
        description="Phenotype-blind selection, clonal de-duplication and lineage clustering were all frozen before any label was joined (results/lineages.json). Distance metric: 1 − Jaccard similarity of sourmash sketches (k=31, scaled=1000)."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="bg-zinc-900/60 border-zinc-800 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">EUCAST-derived labels per drug</CardTitle>
            <CardDescription>All downloaded isolates (pre-dedup n=450); S/R/I/censored from the primary-rule AST rows.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labelData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#27272a" vertical={false} />
                <XAxis dataKey="drug" tick={{ fill: "#a1a1aa", fontSize: 11 }} stroke="#3f3f46" />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} stroke="#3f3f46" />
                <Tooltip
                  cursor={{ fill: "#18181b" }}
                  contentStyle={{ background: "#09090b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {["S", "R", "I", "INDETERMINATE_CENSORED"].map((k) => (
                  <Bar key={k} dataKey={k} stackId="a" fill={LABEL_COLORS[k]} name={k === "INDETERMINATE_CENSORED" ? "censored" : k} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Coarse lineage clusters</CardTitle>
            <CardDescription>18 coarse clusters; only 2 lineages reach the ≥25-isolate protocol tier.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineageData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#27272a" vertical={false} />
                <XAxis dataKey="lineage" tick={{ fill: "#a1a1aa", fontSize: 11 }} stroke="#3f3f46" />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} stroke="#3f3f46" />
                <Tooltip
                  cursor={{ fill: "#18181b" }}
                  contentStyle={{ background: "#09090b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                  {lineageData.map((d, i) => (
                    <Cell key={i} fill={d.n >= 25 ? "#34d399" : "#52525b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Clonality &amp; de-duplication</CardTitle>
            <CardDescription>Thresholds detected from the empirical distance histogram (valley method, D-011/D-014/D-015).</CardDescription>
          </CardHeader>
          <CardContent>
            <KeyValue k="Distance metric" v="1 − Jaccard, sourmash k=31 scaled=1000" />
            <KeyValue k="Dedup threshold" v={fmt(data.cohort.thresholds.dedup)} />
            <KeyValue k="Fine / coarse thresholds" v={`${fmt(data.cohort.thresholds.fine)} / ${fmt(data.cohort.thresholds.coarse)}`} />
            <KeyValue k="Median pairwise distance" v={fmt(data.cohort.distanceStats.median)} />
            <KeyValue k="IQR" v={`[${fmt(data.cohort.distanceStats.p25)}, ${fmt(data.cohort.distanceStats.p75)}]`} />
            <KeyValue k="Survivors after dedup (≤3/cluster×project)" v={338} />
            <KeyValue k="Frozen before phenotype join" v={data.cohort.frozenBeforePhenotypeJoin ? "yes" : "no"} />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Analysis sets (post-dedup cohort)</CardTitle>
            <CardDescription>Labelled S/R isolates with features, per pre-registered drug set.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ciprofloxacin">
              <TabsList className="bg-zinc-800/60">
                {Object.keys(data.analysisSets).map((d) => (
                  <TabsTrigger key={d} value={d} className="font-mono text-xs">
                    {d}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(data.analysisSets).map(([drug, s]) => (
                <TabsContent key={drug} value={drug} className="mt-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-center">
                      <div className="font-mono text-2xl text-zinc-100">{s.n}</div>
                      <div className="text-[11px] text-zinc-500">labelled S/R</div>
                    </div>
                    <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-3 text-center">
                      <div className="font-mono text-2xl text-red-300">{s.nR}</div>
                      <div className="text-[11px] text-zinc-500">resistant</div>
                    </div>
                    <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-3 text-center">
                      <div className="font-mono text-2xl text-emerald-300">{s.nS}</div>
                      <div className="text-[11px] text-zinc-500">susceptible</div>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
                    Below the pre-registered full-scale data gate (≥800 labelled, ≥100 R, ≥100 S) — pilot-scale, exploratory. The
                    Dataset Audit tab shows these checks live.
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
