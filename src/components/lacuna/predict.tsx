"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Dna, Play } from "lucide-react";
import { ErrorBox, fmt, LabelBadge, LoadingBlock, SectionHeader } from "./ui-bits";
import type { EngineSummary, IsolateItem, IsolatesResponse, Prediction } from "@/lib/lacuna/api-types";

const DRUGS = ["ciprofloxacin", "gentamicin", "ceftazidime"] as const;

export function PredictSection() {
  const [drug, setDrug] = useState<string>("ciprofloxacin");
  const [modelType, setModelType] = useState<"M0" | "M1" | "M2">("M1");
  const [engine, setEngine] = useState<EngineSummary | null>(null);
  const [items, setItems] = useState<IsolateItem[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<IsolateItem | null>(null);
  const [toggles, setToggles] = useState<Record<string, 0 | 1>>({});
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/predict?drug=${drug}`)
      .then((r) => r.json())
      .then((d) => setEngine(d.engine ?? null))
      .catch(() => setEngine(null));
  }, [drug]);

  const loadIsolates = useCallback(() => {
    fetch(`/api/isolates?drug=${drug}&limit=200`)
      .then((r) => r.json())
      .then((d: IsolatesResponse) => {
        setItems(d.items ?? []);
        setSelected(d.items?.[0] ?? null);
      })
      .catch(() => setItems([]));
  }, [drug]);

  useEffect(() => {
    loadIsolates();
    setToggles({});
    setPrediction(null);
  }, [loadIsolates]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (i) =>
        i.biosample.toLowerCase().includes(q) ||
        i.bioproject.toLowerCase().includes(q) ||
        i.submitterOrg.toLowerCase().includes(q) ||
        i.coarseLineage === q.replace("l", "") ||
        (i.label ?? "").toLowerCase() === q
    );
  }, [items, query]);

  const runPredict = async () => {
    setRunning(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { drug, modelType };
      if (Object.keys(toggles).length > 0) {
        body.toggles = toggles;
      } else if (selected) {
        body.isolate = selected.biosample;
      } else {
        throw new Error("Select an isolate or toggle determinants first.");
      }
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Prediction failed.");
      setPrediction(data.prediction as Prediction);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="lacuna predict"
        title="Conformal prediction console"
        description="The engine trains M0 (catalogue rule), M1 (L2 logistic regression) and M2 (boosted stumps) live on the real cohort features — deterministic seed 20261101, sigmoid calibration on a lineage-carved calibration set, Mondrian + marginal split-conformal sets at α = 0.10."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: input */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-500">Drug</Label>
                  <Select value={drug} onValueChange={setDrug}>
                    <SelectTrigger className="bg-zinc-950 font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {DRUGS.map((d) => (
                        <SelectItem key={d} value={d} className="font-mono text-xs">
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-500">Model</Label>
                  <Select value={modelType} onValueChange={(v) => setModelType(v as "M0" | "M1" | "M2")}>
                    <SelectTrigger className="bg-zinc-950 font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="M0" className="font-mono text-xs">M0 — catalogue</SelectItem>
                      <SelectItem value="M1" className="font-mono text-xs">M1 — logistic + conformal</SelectItem>
                      <SelectItem value="M2" className="font-mono text-xs">M2 — boosted stumps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="isolate">
                <TabsList className="w-full bg-zinc-800/60">
                  <TabsTrigger value="isolate" className="flex-1 text-xs">
                    Cohort isolate
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex-1 text-xs">
                    Manual profile
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="isolate" className="mt-3 space-y-2">
                  <Input
                    placeholder="Search accession / project / org / lineage (e.g. PRJNA292663, R)…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-zinc-950 text-xs"
                    aria-label="Search isolates"
                  />
                  <ScrollArea className="h-64 rounded-md border border-zinc-800">
                    <div className="divide-y divide-zinc-800/60">
                      {filtered.map((i) => (
                        <button
                          key={i.biosample}
                          onClick={() => {
                            setSelected(i);
                            setToggles({});
                          }}
                          className={`w-full px-3 py-2 text-left transition-colors hover:bg-zinc-800/40 ${
                            selected?.biosample === i.biosample && Object.keys(toggles).length === 0 ? "bg-emerald-950/30" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs text-zinc-200">{i.biosample}</span>
                            {i.label ? <LabelBadge label={i.label === "INDETERMINATE_CENSORED" ? "censored" : i.label} /> : null}
                          </div>
                          <div className="mt-0.5 flex justify-between text-[10px] text-zinc-500">
                            <span>
                              L{i.coarseLineage} · cl{i.dedupCluster} · {i.nDeterminants} genes
                            </span>
                            <span className="truncate pl-2">{i.submitterOrg}</span>
                          </div>
                        </button>
                      ))}
                      {filtered.length === 0 ? <div className="p-4 text-center text-xs text-zinc-500">No isolates match.</div> : null}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="manual" className="mt-3 space-y-2">
                  <p className="text-[11px] leading-relaxed text-zinc-500">
                    Toggle determinants to score a synthetic profile. M0-relevant genes for {drug} are marked
                    <span className="ml-1 rounded border border-emerald-800 bg-emerald-950/40 px-1 text-emerald-300">M0</span>
                  </p>
                  <ScrollArea className="h-64 rounded-md border border-zinc-800">
                    <div className="grid grid-cols-1 gap-1 p-2">
                      {(engine?.m0Features ?? []).map((g) => (
                        <ToggleRow
                          key={g}
                          gene={g}
                          m0
                          value={toggles[g] ?? 0}
                          onChange={(v) => setToggles((t) => ({ ...t, [g]: v }))}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <Button onClick={runPredict} disabled={running} className="w-full bg-emerald-600 text-zinc-950 hover:bg-emerald-500">
                {running ? (
                  <>
                    <Dna className="mr-2 h-4 w-4 animate-pulse" /> Scoring…
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Run predict
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {engine ? (
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Engine — {engine.drug}</CardTitle>
                <CardDescription className="font-mono text-[10px]">
                  n={engine.nLabelled} labelled (R={engine.labelCounts.R}) · {engine.nFeatures} features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-[11px]">
                {(["m1", "m2"] as const).map((m) => {
                  const fit = engine[m];
                  return (
                    <div key={m} className="rounded-md border border-zinc-800 bg-zinc-950/40 p-2.5">
                      <div className="mb-1 font-mono uppercase tracking-wider text-zinc-400">{m.toUpperCase()}</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-zinc-400">
                        <span>train/cal</span>
                        <span className="text-right text-zinc-200">
                          {fit.nTrain}/{fit.nCal} (R {fit.nCalR}/S {fit.nCalS})
                        </span>
                        <span>threshold (Youden)</span>
                        <span className="text-right text-zinc-200">{fmt(fit.threshold)}</span>
                        <span>train / cal AUROC</span>
                        <span className="text-right text-zinc-200">
                          {fmt(fit.trainAuroc, 2)} / {fmt(fit.calAuroc, 2)}
                        </span>
                        <span>q̂ marginal</span>
                        <span className="text-right text-zinc-200">{fmt(fit.quantiles.marginal)}</span>
                        <span>q̂ Mondrian S | R</span>
                        <span className="text-right text-zinc-200">
                          {fmt(fit.quantiles.mondrian["0"])} | {fmt(fit.quantiles.mondrian["1"])}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : (
            <LoadingBlock lines={4} />
          )}
        </div>

        {/* Right: result */}
        <div className="lg:col-span-3">
          {error ? <ErrorBox message={error} /> : null}
          {!prediction && !error ? (
            <Card className="h-full bg-zinc-900/60 border-zinc-800">
              <CardContent className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
                <Dna className="h-8 w-8 text-zinc-700" />
                <p className="text-sm text-zinc-500">Pick an isolate or a determinant profile, then run predict.</p>
                <p className="max-w-sm text-[11px] text-zinc-600">{engine ? `${engine.nLabelled} labelled ${engine.drug} isolates available.` : ""}</p>
              </CardContent>
            </Card>
          ) : null}
          {prediction ? <PredictionCard p={prediction} /> : null}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ gene, m0, value, onChange }: { gene: string; m0?: boolean; value: 0 | 1; onChange: (v: 0 | 1) => void }) {
  return (
    <button
      onClick={() => onChange(value === 1 ? 0 : 1)}
      className={`flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-left font-mono text-[11px] transition-colors ${
        value === 1 ? "border-emerald-700 bg-emerald-950/40 text-emerald-300" : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700"
      }`}
      aria-pressed={value === 1}
    >
      <span className="truncate">
        {gene.replace("gene:", "")}
        {m0 ? <span className="ml-1.5 rounded border border-emerald-800 bg-emerald-950/40 px-1 text-[9px] text-emerald-400">M0</span> : null}
      </span>
      <span>{value === 1 ? "●" : "○"}</span>
    </button>
  );
}

function PredictionCard({ p }: { p: Prediction }) {
  const pct = Math.round(p.pR * 100);
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="font-mono text-base">
              {p.drug} {p.isolate ? `· ${p.isolate}` : "· manual profile"}
            </CardTitle>
            <CardDescription>
              {p.modelType} · threshold {fmt(p.threshold)} · {p.ruoNotice}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">conformal set (Mondrian)</div>
              <LabelBadge label={p.conformalSetMondrian} />
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">marginal</div>
              <LabelBadge label={p.conformalSetMarginal} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* probability gauge */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500">calibrated P(resistance)</span>
            <span className={`font-mono text-3xl font-semibold tabular-nums ${p.pR >= 0.5 ? "text-red-300" : "text-emerald-300"}`}>
              {p.pR.toFixed(3)}
            </span>
          </div>
          <div className="relative h-4 overflow-hidden rounded-full bg-zinc-800">
            <div className="absolute inset-y-0 left-0 bg-emerald-900/60" style={{ width: `${Math.min(100, Math.round(p.threshold * 100))}%` }} />
            <div
              className={`absolute inset-y-0 left-0 ${p.pR >= p.threshold ? "bg-red-500/70" : "bg-emerald-500/70"}`}
              style={{ width: `${pct}%` }}
            />
            <div className="absolute inset-y-0 w-0.5 bg-amber-300" style={{ left: `${Math.min(100, p.threshold * 100)}%` }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-600">
            <span>S ◀</span>
            <span className="text-amber-400/80">▲ decision threshold {fmt(p.threshold)}</span>
            <span>▶ R</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">model call</div>
            <div className="mt-1 font-mono text-xl">{p.call === "R" ? <span className="text-red-300">R</span> : <span className="text-emerald-300">S</span>}</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">M0 catalogue</div>
            <div className="mt-1 font-mono text-xl">{p.m0Call === "R" ? <span className="text-red-300">R</span> : <span className="text-emerald-300">S</span>}</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">p(S)</div>
            <div className="mt-1 font-mono text-xl text-zinc-200">{p.pS.toFixed(3)}</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">n determinants</div>
            <div className="mt-1 font-mono text-xl text-zinc-200">{p.determinants.length}</div>
          </div>
        </div>

        {/* determinants */}
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-wider text-zinc-500">Detected determinants (AMRFinderPlus)</div>
          <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-950/40 p-2.5">
            {p.determinants.length === 0 ? (
              <span className="text-xs text-zinc-600">none detected (wild-type profile)</span>
            ) : (
              p.determinants.map((d) => (
                <span key={d} className="rounded border border-zinc-700 bg-zinc-800/60 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
                  {d.replace("gene:", "")}
                </span>
              ))
            )}
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-zinc-600">
          A conformal set <span className="font-mono text-zinc-400">S+R</span> means the isolate is not separable at the
          requested 90% coverage (uncertainty is surfaced, not hidden); an empty set would be reported as ABSTAIN.
          Prediction sets are computed with the same split-conformal logic as the CLI
          (nonconformity 1 − p̂(y); finite-sample quantile ⌈(n+1)(1−α)⌉/n on the calibration carve-out).
        </p>
      </CardContent>
    </Card>
  );
}
