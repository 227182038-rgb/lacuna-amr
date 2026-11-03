"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, FileSearch, XCircle } from "lucide-react";
import { ErrorBox, KeyValue, LoadingBlock, SectionHeader, VerdictBadge } from "./ui-bits";
import type { AuditResponse, AuditRunRecord, DrugAudit } from "@/lib/lacuna/api-types";

const SAMPLE_TSV = `biosample\tdrug\tlabel_eucast\tbioproject\tstandards\tsubmitter_phenotypes\tyear\tcountry
SAMN99900001\tciprofloxacin\tS\tPRJNA999001\tEUCAST\tsusceptible\t2022\tUSA: NY
SAMN99900002\tciprofloxacin\tR\tPRJNA999001\tEUCAST\tresistant\t2022\tUSA: NY
SAMN99900003\tciprofloxacin\tR\tPRJNA999002\tCLSI\tresistant\t2023\tGermany
SAMN99900004\tciprofloxacin\tS\tPRJNA999002\tCLSI\tnot defined\t2023\tGermany`;

export function AuditSection() {
  const [source, setSource] = useState<"ast-table" | "cohort" | "paste">("cohort");
  const [pasteText, setPasteText] = useState("");
  const [thresholds, setThresholds] = useState({ minIsolates: 800, minR: 100, minS: 100, minBioprojects: 5 });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runs, setRuns] = useState<AuditRunRecord[]>([]);

  const loadRuns = useCallback(() => {
    fetch("/api/audit-dataset")
      .then((r) => r.json())
      .then((d) => setRuns(d.runs ?? []))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  const runAudit = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/audit-dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: source === "paste" ? "paste" : "cohort",
          text: source === "paste" ? pasteText : undefined,
          cohortOnly: source === "cohort",
          thresholds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed.");
      setResult(data as AuditResponse);
      toast({ title: "Audit complete", description: `${data.audit.drugs.length} drugs audited — overall ${data.audit.overallVerdict}` });
      loadRuns();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Audit failed.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="lacuna audit-dataset"
        title="Dataset audit — label heterogeneity + data gates"
        description="Runs the same engine as the CLI's audit-dataset: per-drug label distributions, source heterogeneity and PASS/FAIL verdicts against the pre-registered data-gate thresholds. Every run is persisted to the audit ledger."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Input</CardTitle>
            <CardDescription>Choose the data source and gate thresholds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={source} onValueChange={(v) => setSource(v as typeof source)} className="gap-2">
              <Label className="flex items-start gap-3 rounded-lg border border-zinc-800 p-3 font-normal">
                <RadioGroupItem value="cohort" className="mt-0.5" />
                <div>
                  <div className="text-sm text-zinc-200">Bundled pilot cohort</div>
                  <div className="text-[11px] text-zinc-500">240 frozen isolates, all AST rows</div>
                </div>
              </Label>
              <Label className="flex items-start gap-3 rounded-lg border border-zinc-800 p-3 font-normal">
                <RadioGroupItem value="ast-table" className="mt-0.5" />
                <div>
                  <div className="text-sm text-zinc-200">Full AST table</div>
                  <div className="text-[11px] text-zinc-500">all 450 downloaded isolates incl. dedup-dropped</div>
                </div>
              </Label>
              <Label className="flex items-start gap-3 rounded-lg border border-zinc-800 p-3 font-normal">
                <RadioGroupItem value="paste" className="mt-0.5" />
                <div>
                  <div className="text-sm text-zinc-200">Paste your own AST table</div>
                  <div className="text-[11px] text-zinc-500">TSV: biosample, drug, label_eucast, bioproject, …</div>
                </div>
              </Label>
            </RadioGroup>

            {source === "paste" ? (
              <div className="space-y-2">
                <Textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={SAMPLE_TSV}
                  className="min-h-[140px] bg-zinc-950 font-mono text-[11px] text-zinc-300"
                  aria-label="AST table input"
                />
                <Button variant="outline" size="sm" className="border-zinc-700 text-xs" onClick={() => setPasteText(SAMPLE_TSV)}>
                  Insert example rows
                </Button>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["minIsolates", "Min labelled S/R"],
                  ["minR", "Min resistant"],
                  ["minS", "Min susceptible"],
                  ["minBioprojects", "Min BioProjects"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key} className="text-[11px] text-zinc-500">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min={0}
                    value={thresholds[key]}
                    onChange={(e) => setThresholds((t) => ({ ...t, [key]: parseInt(e.target.value, 10) || 0 }))}
                    className="h-8 bg-zinc-950 font-mono text-xs"
                  />
                </div>
              ))}
            </div>

            <Button onClick={runAudit} disabled={running} className="w-full bg-emerald-600 text-zinc-950 hover:bg-emerald-500">
              {running ? (
                <>
                  <FileSearch className="mr-2 h-4 w-4 animate-pulse" /> Auditing…
                </>
              ) : (
                <>
                  <FileSearch className="mr-2 h-4 w-4" /> Run audit-dataset
                </>
              )}
            </Button>
            <p className="text-[11px] leading-relaxed text-zinc-600">
              Defaults are the full-scale protocol gates. Relax them explicitly for smaller client datasets —
              exactly as the CLI requires (no silent threshold changes).
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {error ? <ErrorBox message={error} /> : null}
          {!result && !error ? (
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardContent className="py-10 text-center text-sm text-zinc-500">
                Run an audit to see per-drug data-gate verdicts.
              </CardContent>
            </Card>
          ) : null}
          {result
            ? result.audit.drugs.map((d) => (
                <DrugAuditCard key={d.drug} d={d} />
              ))
            : null}
          {result ? (
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardContent className="py-3 font-mono text-[11px] text-zinc-500">
                {result.audit.tool} v{result.audit.version} · {result.audit.source} · {result.audit.nRows} rows ·{" "}
                {result.savedRuns.length} run records saved to the audit ledger
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-base">Audit ledger (recent runs)</CardTitle>
          <CardDescription>Persisted by the console — every interactive verdict is traceable.</CardDescription>
        </CardHeader>
        <CardContent>
          {runs.length === 0 ? (
            <p className="text-sm text-zinc-500">No runs yet.</p>
          ) : (
            <ScrollArea className="max-h-72">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-zinc-500">
                    <th className="px-2 py-1.5 font-medium">time</th>
                    <th className="px-2 py-1.5 font-medium">source</th>
                    <th className="px-2 py-1.5 font-medium">drug</th>
                    <th className="px-2 py-1.5 font-medium">labelled</th>
                    <th className="px-2 py-1.5 font-medium">verdict</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-zinc-300">
                  {runs.map((r) => (
                    <tr key={r.id} className="border-b border-zinc-800/50">
                      <td className="px-2 py-1.5 text-zinc-500">{new Date(r.createdAt).toLocaleTimeString()}</td>
                      <td className="px-2 py-1.5">{r.source}</td>
                      <td className="px-2 py-1.5">{r.drug}</td>
                      <td className="px-2 py-1.5">{r.nLabelled}</td>
                      <td className="px-2 py-1.5">
                        <VerdictBadge verdict={r.verdict} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DrugAuditCard({ d }: { d: DrugAudit }) {
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono text-base">{d.drug}</CardTitle>
          <VerdictBadge verdict={d.verdict} />
        </div>
        <CardDescription>
          {d.nRows} rows · {d.nIsolates} isolates · {d.nBioprojects} BioProjects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            {d.dgChecks.map((c) => (
              <div key={c.key} className="flex items-center justify-between gap-2 rounded-md border border-zinc-800/70 bg-zinc-950/40 px-2.5 py-2">
                <div className="flex items-center gap-2">
                  {c.pass ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  <span className="text-xs text-zinc-300">{c.label}</span>
                </div>
                <span className={`font-mono text-xs tabular-nums ${c.pass ? "text-emerald-300" : "text-red-300"}`}>
                  {c.value} / {c.threshold}
                </span>
              </div>
            ))}
            <div className="pt-1">
              <KeyValue k="S / R / I / censored" v={`${d.nS} / ${d.nR} / ${d.nI} / ${d.nCensored}`} />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wider text-zinc-500">Testing standards</div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {Object.entries(d.standards).map(([k, v]) => (
                  <span key={k} className="rounded border border-zinc-700 bg-zinc-800/50 px-1.5 py-0.5 text-zinc-300">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wider text-zinc-500">Submitter phenotype vocabulary</div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {Object.entries(d.submitterPhenotypes).map(([k, v]) => (
                  <span key={k} className="rounded border border-zinc-700 bg-zinc-800/50 px-1.5 py-0.5 text-zinc-300">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
