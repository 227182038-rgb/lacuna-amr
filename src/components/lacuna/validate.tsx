"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert } from "lucide-react";
import { ErrorBox, fmt, fmtPct, LoadingBlock, SectionHeader, VerdictBadge } from "./ui-bits";
import type { H1Cell, ResultsRow, SplitAuditResponse, ValidateResponse } from "@/lib/lacuna/api-types";

const DRUGS = ["ciprofloxacin", "gentamicin", "ceftazidime"] as const;

export function ValidateSection() {
  const [data, setData] = useState<ValidateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/validate")
      .then((r) => r.json())
      .then((d: ValidateResponse) => setData(d))
      .catch(() => setError("Failed to load validation results."));
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <LoadingBlock lines={6} />;

  const splits = ["S0", "S1", "S2", "S3"] as const;

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="lacuna validate"
        title="Validation under lineage, time and site shift"
        description="Recorded S0–S3 evaluation of M0/M1/M2 with cluster-bootstrap 95% CIs (results/evaluation/main_results.json), hypothesis outcomes H1–H4, plus a live re-run of the G3 split-leakage auditor on the sealed splits."
        right={
          <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 font-mono text-[11px] text-zinc-500">
            splits sealed {data.splitsManifest.sealed_utc} · SHA-256 sealed before any model fit
          </div>
        }
      />

      {DRUGS.map((drug) => (
        <DrugValidation key={drug} drug={drug} rows={data.results.filter((r) => r.drug === drug)} h1={data.hypotheses.H1?.[drug] ?? {}} />
      ))}

      <SplitAuditPanel />

      <H3Table h1={data.hypotheses.H1 ?? {}} />
    </div>
  );
}

interface ForestRow {
  key: string;
  model: string;
  split: string;
  delta: number;
  lo: number;
  hi: number;
  n: number;
}

/** Compact group label: "PRJNA292663|FDA" → "FDA"; keep lineage ids as-is. */
function shortLabel(variant: string): string {
  if (variant.includes("|")) {
    const org = variant.split("|")[1];
    return org.length > 22 ? `${org.slice(0, 20)}…` : org;
  }
  if (variant === "OTHER_S3") return "other";
  if (variant === "OTHER") return "other lineages";
  return variant === "forward time" ? "fwd time" : `lineage ${variant}`;
}

/** CSS forest plot: ΔAUROC with 95% CI whiskers against a zero reference line. */
function ForestPlot({ data }: { data: ForestRow[] }) {
  const lo = Math.min(-0.05, ...data.map((d) => d.lo)) - 0.05;
  const hi = Math.max(0.05, ...data.map((d) => d.hi)) + 0.05;
  const pos = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="space-y-1.5">
        {data.map((d) => {
          const crossesZero = d.lo <= 0 && d.hi >= 0;
          const color = crossesZero ? "#a1a1aa" : d.delta < 0 ? "#f87171" : "#34d399";
          return (
            <div key={d.key} className="flex items-center gap-3 font-mono text-[11px]">
              <div className="w-14 shrink-0 text-zinc-400">{d.model}</div>
              <div className="w-8 shrink-0 text-zinc-500">{d.split}</div>
              <div className="relative h-4 flex-1">
                <div className="absolute inset-y-1/2 h-px w-full bg-zinc-800" />
                <div className="absolute inset-y-0 w-px bg-amber-500/60" style={{ left: `${pos(0)}%` }} />
                <div
                  className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full"
                  style={{ left: `${pos(d.lo)}%`, width: `${Math.max(0.5, pos(d.hi) - pos(d.lo))}%`, backgroundColor: color, opacity: 0.75 }}
                />
                <div className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ left: `${pos(d.delta)}%`, backgroundColor: "#09090b", borderColor: color }} />
              </div>
              <div className="w-44 shrink-0 text-right text-zinc-400">
                {fmt(d.delta, 3)} [{fmt(d.lo, 2)}, {fmt(d.hi, 2)}] <span className="text-zinc-600">n={d.n}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-zinc-600">
        <span>ΔAUROC worse under shift ◀</span>
        <span>0</span>
        <span>▶ better under shift</span>
      </div>
    </div>
  );
}

function DrugValidation({ drug, rows, h1 }: { drug: string; rows: ResultsRow[]; h1: Record<string, H1Cell | { n_common: number; note: string }> }) {
  // rows already carry one entry per (split, variant, model)
  const byKey = useMemo(() => {
    const map = new Map<string, ResultsRow>();
    for (const r of rows) map.set(`${r.split}|${r.variant}|${r.model}`, r);
    return map;
  }, [rows]);

  // ordered variants: S0 mean, S1 groups, S2, S3 groups
  const variants = useMemo(() => {
    const seen = new Map<string, string[]>();
    for (const r of rows) {
      if (!seen.has(r.split)) seen.set(r.split, []);
      if (!seen.get(r.split)!.includes(r.variant)) seen.get(r.split)!.push(r.variant);
    }
    return seen;
  }, [rows]);

  const models = ["M0", "M1", "M2"];

  // H1 forest data (M1 + M2 deltas with CI)
  const forest = Object.entries(h1)
    .filter(([k]) => k.startsWith("M1_") || k.startsWith("M2_"))
    .map(([k, v]) => {
      if ("note" in v) return null;
      const cellVal = v as H1Cell;
      return { key: k, model: k.slice(0, 2), split: k.slice(3), delta: cellVal.delta, lo: cellVal.delta_ci95[0], hi: cellVal.delta_ci95[1], n: cellVal.n_common };
    })
    .filter((d): d is { key: string; model: string; split: string; delta: number; lo: number; hi: number; n: number } => d !== null);
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="font-mono text-base">{drug}</CardTitle>
        <CardDescription>
          AUROC (cluster-bootstrap 95% CI) · Mondrian coverage · Brier. S1 = lineage hold-out, S2 = time hold-out, S3 = site/BioProject hold-out.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 text-[11px] text-zinc-500">
                <TableHead className="w-16">split</TableHead>
                {models.map((m) => (
                  <TableHead key={m} className="font-mono">
                    {m} AUROC [95% CI]
                  </TableHead>
                ))}
                <TableHead className="font-mono">M1 coverage (R|S)</TableHead>
                <TableHead className="font-mono">M1 Brier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {["S0", "S1", "S2", "S3"].map((split) => {
                const splitVariants = variants.get(split) ?? [];
                if (splitVariants.length === 0) {
                  return (
                    <TableRow key={split} className="border-zinc-800/60 font-mono text-xs">
                      <TableCell className="font-semibold text-zinc-300">{split}</TableCell>
                      <TableCell colSpan={5} className="text-zinc-600">
                        infeasible at pilot scale (test n=60, R=4 &lt; protocol requirement)
                      </TableCell>
                    </TableRow>
                  );
                }
                return splitVariants.map((variant, vi) => {
                  const m0 = byKey.get(`${split}|${variant}|M0`);
                  const m1 = byKey.get(`${split}|${variant}|M1`);
                  const m2 = byKey.get(`${split}|${variant}|M2`);
                  return (
                    <TableRow key={`${split}-${variant}`} className="border-zinc-800/60 font-mono text-xs">
                      <TableCell className="font-semibold text-zinc-300">
                        {vi === 0 ? split : ""}
                        <span className={`ml-1 text-[10px] ${variant === "10-fold mean" || variant === "forward time" ? "text-zinc-600" : "text-zinc-500"}`}>
                          {variant === "10-fold mean" ? "" : shortLabel(variant)}
                        </span>
                      </TableCell>
                      {[m0, m1, m2].map((m, i) => (
                        <TableCell key={i}>
                          {m?.auroc == null ? (
                            <span className="text-zinc-600">—</span>
                          ) : (
                            <span>
                              <span className="text-zinc-100">{fmt(m.auroc)}</span>
                              {m.aurocCi ? (
                                <span className="text-zinc-500">
                                  {" "}
                                  [{fmt(m.aurocCi[0], 2)}, {fmt(m.aurocCi[1], 2)}]
                                </span>
                              ) : null}
                            </span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        {m1?.coverage == null ? (
                          <span className="text-zinc-600">—</span>
                        ) : (
                          <span className={m1.coverageR != null && m1.coverageR < 0.85 ? "text-amber-300" : "text-zinc-200"}>
                            {fmtPct(m1.coverage)} ({fmtPct(m1.coverageR, 0)}|{fmtPct(m1.coverageS, 0)})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{m1?.brier == null ? <span className="text-zinc-600">—</span> : fmt(m1.brier)}</TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
        </div>

        {forest.length > 0 ? (
          <div>
            <div className="mb-1 text-[11px] uppercase tracking-wider text-zinc-500">
              H1 optimism — ΔAUROC (shifted split − S0), 95% cluster-bootstrap CI
            </div>
            <ForestPlot data={forest} />
            <p className="text-[11px] text-zinc-500">
              Intervals crossing zero → optimism not separable from noise. Gentamicin M1_S1 −0.097 [−0.171, −0.016] is the
              pilot&apos;s clearest lineage-shift signal.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SplitAuditPanel() {
  const [drug, setDrug] = useState<string>("ciprofloxacin");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SplitAuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed.");
      setResult(data as SplitAuditResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Audit failed.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card className="border-amber-900/40 bg-zinc-900/60">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="h-4 w-4 text-amber-400" /> Live split-leakage audit (G3 re-run)
            </CardTitle>
            <CardDescription>
              Re-computes the G3 assertions right now: isolate overlap and dedup-cluster overlap at every train/test
              boundary of the sealed splits. This is the check that found the pilot&apos;s G3 FAIL (D-019).
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={drug} onValueChange={setDrug}>
              <SelectTrigger className="w-44 bg-zinc-950 font-mono text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900">
                {DRUGS.map((d) => (
                  <SelectItem key={d} value={d} className="font-mono text-xs">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={run} disabled={running} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
              {running ? "Auditing…" : "Audit splits"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? <ErrorBox message={error} /> : null}
        {!result && !error ? (
          <p className="text-sm text-zinc-500">
            Expected outcome for the pilot splits: <span className="font-mono text-amber-300">FAIL</span> — clonal dedup-clusters span
            train/test in the isolate-stratified S0 and in S2/S3 (zero isolate overlap; S1 lineage folds clone-disjoint).
          </p>
        ) : null}
        {result ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <VerdictBadge verdict={result.audit.verdict} />
              <span className="font-mono text-xs text-zinc-400">
                {result.audit.nSplitsChecked} boundaries checked · isolate overlaps: {result.audit.isolateOverlaps} · cluster
                overlaps: {result.audit.clusterOverlaps}
              </span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
                <div className="mb-1.5 text-[11px] uppercase tracking-wider text-zinc-500">Sealed split structure</div>
                <div className="space-y-1 font-mono text-[11px] text-zinc-400">
                  {Object.entries(result.audit.splitDescriptions).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="w-8 shrink-0 text-zinc-300">{k}</span>
                      <span className="truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
                <div className="mb-1.5 text-[11px] uppercase tracking-wider text-zinc-500">Leakage problems</div>
                <div className="max-h-40 space-y-1 overflow-y-auto font-mono text-[11px]">
                  {result.audit.problems.length === 0 ? (
                    <span className="text-emerald-400">none</span>
                  ) : (
                    result.audit.problems.map((p, i) => (
                      <div key={i} className="text-red-300">
                        {p.split}: <span className="text-zinc-400">{p.detail}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function H3Table({ h1 }: { h1: Record<string, Record<string, H1Cell | { n_common: number; note: string }>> }) {
  // H3 evidence is embedded in the summary; surface the known shortfall units from H1 context
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">H3 — conformal R-class coverage collapse under shift</CardTitle>
        <CardDescription>
          Mondrian R-coverage per held-out unit vs the same isolates under S0 (from results/evaluation/summary.txt, H3 section).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 text-[11px] text-zinc-500">
              <TableHead>drug</TableHead>
              <TableHead>split</TableHead>
              <TableHead>held-out unit</TableHead>
              <TableHead className="text-right">n</TableHead>
              <TableHead className="text-right">R</TableHead>
              <TableHead className="text-right">R-coverage</TableHead>
              <TableHead className="text-right">same isolates under S0</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-mono text-xs">
            {[
              ["ciprofloxacin", "S1", "lineage 8", 109, 7, 0.43, 0.86],
              ["ciprofloxacin", "S1", "lineage 3", 31, 8, 1.0, 1.0],
              ["ciprofloxacin", "S3", "PRJNA514245 (NCBI)", 55, 6, 1.0, 1.0],
              ["gentamicin", "S1", "lineage 8", 126, 9, 1.0, 0.94],
              ["gentamicin", "S1", "OTHER lineages", 41, 17, 0.29, 1.0],
              ["gentamicin", "S3", "PRJNA292663 (FDA)", 88, 10, 0.4, 0.95],
              ["gentamicin", "S3", "PRJNA514245 (NCBI)", 47, 16, 1.0, 1.0],
              ["ceftazidime", "S1", "lineage 8", 33, 16, 0.44, 0.88],
            ].map((row, i) => (
              <TableRow key={i} className="border-zinc-800/60">
                {row.map((c, j) => (
                  <TableCell key={j} className={j >= 4 ? "text-right tabular-nums" : ""}>
                    {typeof c === "number" ? (j >= 5 ? fmtPct(c, 0) : c) : c}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
          The headline risk the audit product quantifies: nominal 90% coverage holds under S0, but R-class coverage falls to
          0.29–0.44 for specific held-out lineages/sites — the model&apos;s uncertainty guarantees are lineage-local. H4
          (unexplained resistance): ciprofloxacin 0/17, gentamicin 3/34 [0.019, 0.237], ceftazidime 0/26 R isolates without an
          M0-relevant determinant.
        </p>
      </CardContent>
    </Card>
  );
}
