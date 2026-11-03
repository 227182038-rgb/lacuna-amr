"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, FlaskConical, ShieldCheck } from "lucide-react";
import { ErrorBox, fmt, LoadingBlock, SectionHeader, StatCard, VerdictBadge } from "./ui-bits";
import type { OverviewResponse } from "@/lib/lacuna/api-types";

export function OverviewSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/overview")
      .then((r) => r.json())
      .then((d: OverviewResponse) => setData(d))
      .catch(() => setError("Failed to load overview data."));
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <LoadingBlock lines={6} />;

  const funnel = data.attrition.map((a) => ({ ...a, label: a.stage.length > 44 ? a.stage.slice(0, 43) + "…" : a.stage }));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-500">
              <FlaskConical className="h-3.5 w-3.5" /> open-core audit toolkit · v{data.project.version}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50">LACUNA·AMR</h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {data.project.tagline}. This console runs the toolkit&apos;s audit, prediction and validation
              engines against the <span className="text-zinc-200">real pilot study artifacts</span> — a
              phenotype-blind 240-isolate <em>Escherichia coli</em> cohort from public NCBI assemblies with
              EUCAST v16.1-derived labels and AMRFinderPlus 4.2.7 determinants.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <VerdictBadge verdict={data.gates.tally.FAIL > 0 ? "FAIL" : "PASS"} />
            <div className="text-[11px] leading-tight text-zinc-500">
              {data.gates.tally.PASS} gates PASS · {data.gates.tally.FAIL} FAIL ·{" "}
              {data.gates.tally["NOT ATTEMPTED"] ?? 0} not attempted
              <br />
              failures documented fail-closed (see Gates)
            </div>
          </div>
        </div>
        <Alert className="mt-4 border-amber-900/60 bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-xs text-amber-300">Research Use Only — pilot scale, exploratory</AlertTitle>
          <AlertDescription className="text-xs text-amber-200/70">
            {data.project.notice} All results shown are from a session-scale pilot (n=240, below the
            pre-registered data-gate scale of 800/drug) and are labelled exploratory. G3 (split integrity)
            and G5 (seed reproduction) are documented FAILs; no confirmatory conclusions are drawn.
          </AlertDescription>
        </Alert>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Cohort isolates" value={data.cohort.n} sub={`${data.cohort.nBioprojects} BioProjects`} />
        <StatCard label="Dedup clusters" value={data.cohort.nDedupClusters} sub="sourmash k=31, ≤3 per cluster×project" />
        <StatCard label="Coarse lineages" value={data.cohort.nCoarseLineages} sub={`2 with ≥25 isolates`} />
        <StatCard label="AMR features" value={data.features.nGenes} sub="AMRFinderPlus genes + point mutations" />
        <StatCard label="Drugs analysed" value={3} sub="ciprofloxacin · gentamicin · ceftazidime" />
        <StatCard label="Dropped as clones" value={data.cohort.nDropped} sub="clonal de-duplication" accent="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attrition funnel */}
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Data attrition — pool to cohort</CardTitle>
            <CardDescription>Every count measured during acquisition, not estimated.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 56, top: 4, bottom: 4 }}>
                  <XAxis type="number" hide domain={[0, "dataMax"]} />
                  <YAxis type="category" dataKey="label" width={150} tick={{ fill: "#a1a1aa", fontSize: 10 }} stroke="#3f3f46" />
                  <Tooltip
                    cursor={{ fill: "#18181b" }}
                    contentStyle={{ background: "#09090b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "#e4e4e7" }}
                    formatter={(v: number) => [v, "isolates"]}
                  />
                  <Bar dataKey="n" radius={[0, 4, 4, 0]} background={{ fill: "#18181b" }}>
                    {funnel.map((_, i) => (
                      <Cell key={i} fill={i === funnel.length - 1 ? "#34d399" : i >= 5 ? "#a78bfa00" : "#52525b"} />
                    ))}
                    <LabelList dataKey="n" position="right" style={{ fill: "#d4d4d8", fontSize: 11, fontFamily: "monospace" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">
              K. pneumoniae failed the pool-size gate (est. 524–735 &lt; 800/drug) → brief-mandated fallback to E. coli.
              Meropenem failed the resistant-count gate (6 R); colistin failed for both organisms (D-006).
            </p>
          </CardContent>
        </Card>

        {/* Headline results */}
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Headline pilot results — M1 under S0</CardTitle>
            <CardDescription>
              AUROC with cluster-bootstrap 95% CI (10 folds). Exploratory; G5 seed-reproduction FAIL documented.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.headline.map((h) => (
              <button
                key={h.drug}
                onClick={() => onNavigate("validate")}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-left transition-colors hover:border-emerald-800"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-zinc-200">{h.drug}</span>
                  <span className="font-mono text-lg text-emerald-300">{fmt(h.aurocM1)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>
                    95% CI [{h.aurocCi ? fmt(h.aurocCi[0], 2) : "—"}, {h.aurocCi ? fmt(h.aurocCi[1], 2) : "—"}]
                  </span>
                  <span>
                    n={h.n} (R={h.nR})
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-emerald-500/80" style={{ width: `${(h.aurocM1 ?? 0) * 100}%` }} />
                </div>
              </button>
            ))}
            <div className="rounded-lg border border-zinc-800 p-3 text-[11px] leading-relaxed text-zinc-500">
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-500" />
              Numbers loaded directly from <code className="font-mono text-zinc-400">results/evaluation/main_results.json</code> —
              never re-typed. The Validation tab recomputes split-leakage live.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EUCAST breakpoints card */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-base">EUCAST breakpoints — user-supplied, never bundled</CardTitle>
          <CardDescription>
            {data.breakpoints.version} · Enterobacterales rows · source SHA-256 {data.breakpoints.sourceSha256.slice(0, 16)}…
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(data.breakpoints.rows).map(([drug, bp]) => (
              <div key={drug} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                <div className="font-mono text-sm text-zinc-200">{drug}</div>
                <div className="mt-1 text-[11px] text-zinc-500">{bp.rowLabel}</div>
                <div className="mt-2 flex gap-2 font-mono text-xs">
                  <span className="rounded border border-emerald-800 bg-emerald-950/50 px-1.5 py-0.5 text-emerald-300">S ≤ {bp.sLe}</span>
                  <span className="rounded border border-red-800 bg-red-950/50 px-1.5 py-0.5 text-red-300">R &gt; {bp.rGt}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
            {data.breakpoints.citation} Reference-only posture: the EUCAST xlsx is excluded from release
            archives (D-021) and this console; only the derived row values above are shown with their cell references.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
