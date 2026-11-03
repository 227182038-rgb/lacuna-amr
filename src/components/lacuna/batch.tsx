"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Download, Loader2, Play, Terminal } from "lucide-react";
import { ErrorBox, LabelBadge, LoadingBlock, SectionHeader, StatCard, fmtPct } from "./ui-bits";

const DRUGS = ["ciprofloxacin", "gentamicin", "ceftazidime"] as const;

interface BatchResultRow {
  isolate: string;
  pR: number;
  call: "S" | "R";
  m0Call: "S" | "R";
  conformalSet: string;
  determinants: number;
  label: string | null;
}

interface BatchSummary {
  n: number;
  calls: { S: number; R: number };
  conformalSets: Record<string, number>;
  meanPR: number;
  nLabelled: number;
  agreementWithLabel: number | null;
  setCoverageVsLabel: number | null;
  m0ModelAgreement: number | null;
}

interface BatchState {
  id: string;
  label: string;
  drug: string;
  modelType: string;
  n: number;
  done: number;
  status: "queued" | "running" | "complete" | "failed";
}

interface JobListRow {
  id: string;
  label: string;
  drug: string;
  modelType: string;
  n: number;
  done: number;
  status: string;
  createdAt: string;
}

function downloadFile(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function BatchSection() {
  const [form, setForm] = useState({ label: "Routine batch", drug: "ciprofloxacin", modelType: "M1", n: 60 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<BatchState | null>(null);
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [results, setResults] = useState<BatchResultRow[]>([]);
  const [jobs, setJobs] = useState<JobListRow[] | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadJobs = useCallback(() => {
    fetch("/api/batch")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    loadJobs();
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [loadJobs]);

  const poll = useCallback(
    (id: string) => {
      fetch(`/api/batch?id=${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.error) throw new Error(d.error);
          setJob(d.job);
          setSummary(d.summary ?? null);
          setResults(d.results ?? []);
          if (d.job && (d.job.status === "queued" || d.job.status === "running")) {
            pollRef.current = setTimeout(() => poll(id), 700);
          } else {
            loadJobs();
          }
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Polling failed."));
    },
    [loadJobs]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSummary(null);
    setResults([]);
    try {
      const res = await fetch("/api/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Submission failed.");
      toast({ title: "Batch queued", description: d.notice });
      setJob(d.job);
      loadJobs();
      pollRef.current = setTimeout(() => poll(d.job.id), 400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  };

  const exportPredictions = async () => {
    const res = await fetch("/api/exports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format: "predictions", drug: job?.drug }),
    });
    const d = await res.json();
    if (!res.ok) {
      toast({ title: "Export failed", description: d.error, variant: "destructive" });
      return;
    }
    downloadFile(d.filename, d.mime, d.content);
    toast({ title: "Downloaded", description: `${d.n} prediction rows (${d.filename})` });
  };

  const progressPct = job && job.n > 0 ? Math.round((job.done / job.n) * 100) : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="batch scoring"
        title="High-throughput scoring queue"
        description="The hospital-lab pattern: score a whole labelled cohort per drug, watch staged progress, and read the aggregate QA summary before trusting anything. Progress reflects real engine computation — each poll advances the job by a chunk of isolates, so nothing here is a simulated progress bar."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Submit a batch</CardTitle>
            <CardDescription>Deterministic selection: labelled cohort isolates for the drug, sorted by accession, capped at 240.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="batch-label" className="text-xs text-zinc-500">
                  Batch label
                </Label>
                <Input
                  id="batch-label"
                  value={form.label}
                  maxLength={120}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="bg-zinc-950 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="batch-drug" className="text-xs text-zinc-500">
                    Drug
                  </Label>
                  <select
                    id="batch-drug"
                    value={form.drug}
                    onChange={(e) => setForm((f) => ({ ...f, drug: e.target.value }))}
                    className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 font-mono text-xs text-zinc-200"
                  >
                    {DRUGS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="batch-model" className="text-xs text-zinc-500">
                    Model
                  </Label>
                  <select
                    id="batch-model"
                    value={form.modelType}
                    onChange={(e) => setForm((f) => ({ ...f, modelType: e.target.value }))}
                    className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 font-mono text-xs text-zinc-200"
                  >
                    <option value="M0">M0 — catalogue rule</option>
                    <option value="M1">M1 — logistic + conformal</option>
                    <option value="M2">M2 — boosted stumps + conformal</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="batch-n" className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Isolates</span>
                  <span className="font-mono text-emerald-400">{form.n}</span>
                </Label>
                <input
                  id="batch-n"
                  type="range"
                  min={10}
                  max={240}
                  step={10}
                  value={form.n}
                  onChange={(e) => setForm((f) => ({ ...f, n: parseInt(e.target.value, 10) }))}
                  className="w-full accent-emerald-500"
                  aria-valuetext={`${form.n} isolates`}
                />
              </div>
              {error ? <ErrorBox message={error} /> : null}
              <Button type="submit" disabled={busy} className="w-full bg-emerald-600 text-zinc-950 hover:bg-emerald-500">
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} Queue batch
              </Button>
              <div className="flex gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/40 p-2 font-mono text-[10px] leading-relaxed text-zinc-500">
                <Terminal className="mt-0.5 h-3 w-3 shrink-0" />
                <span>
                  API path: POST /api/batch with header x-api-key (see Compliance tab) — keys are charged 1 credit per isolate.
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {job === null ? (
            <Card className="border-dashed border-zinc-800 bg-zinc-900/30">
              <CardContent className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 p-6 text-center">
                <Play className="h-6 w-6 text-zinc-700" />
                <p className="text-sm text-zinc-500">Queue a batch to see staged processing, aggregate QA and exports.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-base">
                      {job.label} <span className="ml-1 font-mono text-xs text-zinc-500">{job.drug} · {job.modelType}</span>
                    </CardTitle>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                        job.status === "complete"
                          ? "bg-emerald-950/60 text-emerald-300"
                          : job.status === "running" || job.status === "queued"
                            ? "bg-zinc-800 text-zinc-300"
                            : "bg-red-950/60 text-red-300"
                      }`}
                    >
                      {job.status.toUpperCase()} · {job.done}/{job.n}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${job.status === "complete" ? "bg-emerald-500" : "bg-emerald-600/70"}`}
                      style={{ width: `${progressPct}%` }}
                      role="progressbar"
                      aria-valuenow={progressPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  {summary ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <StatCard
                        label="Calls (S/R)"
                        value={`${summary.calls.S}/${summary.calls.R}`}
                        sub={`mean p(R) = ${summary.meanPR.toFixed(3)}`}
                      />
                      <StatCard
                        label="Agreement with EUCAST label"
                        value={fmtPct(summary.agreementWithLabel, 1)}
                        sub={`${summary.nLabelled} labelled isolates`}
                        accent="emerald"
                      />
                      <StatCard
                        label="Conformal set covers label"
                        value={fmtPct(summary.setCoverageVsLabel, 1)}
                        sub="target ≥ 90% (α = 0.10)"
                        accent={summary.setCoverageVsLabel != null && summary.setCoverageVsLabel >= 0.9 ? "emerald" : "amber"}
                      />
                      <StatCard
                        label="M0 vs model agreement"
                        value={summary.m0ModelAgreement != null ? fmtPct(summary.m0ModelAgreement, 1) : "—"}
                        sub="catalogue rule vs fitted model"
                        accent="zinc"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">
                      Processing in chunks of 20 isolates per poll — each tick is real engine computation on this server.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(summary?.conformalSets ?? {}).map(([k, v]) => (
                      <span key={k} className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/40 px-2 py-1 text-[11px] text-zinc-400">
                        <LabelBadge label={k} /> × {v}
                      </span>
                    ))}
                  </div>
                  {job.status === "complete" ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-950 text-xs text-zinc-300 hover:border-emerald-800 hover:text-emerald-300" onClick={exportPredictions}>
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Predictions CSV
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {results.length > 0 ? (
                <Card className="border-zinc-800 bg-zinc-900/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {job.status === "complete" ? "Scored isolates (latest 5 of " + job.n + ")" : "Scoring… (latest results)"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-72 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-zinc-900">
                          <tr className="border-b border-zinc-800 text-left text-zinc-500">
                            <th className="px-3 py-2 font-medium">Isolate</th>
                            <th className="px-3 py-2 font-medium">p(R)</th>
                            <th className="px-3 py-2 font-medium">Call</th>
                            <th className="px-3 py-2 font-medium">Conformal</th>
                            <th className="px-3 py-2 font-medium">M0</th>
                            <th className="px-3 py-2 font-medium">Label</th>
                            <th className="px-3 py-2 font-medium">Det.</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-zinc-300">
                          {results
                            .slice()
                            .reverse()
                            .map((r) => (
                              <tr key={r.isolate} className="border-b border-zinc-800/60">
                                <td className="px-3 py-1.5">{r.isolate}</td>
                                <td className="px-3 py-1.5 tabular-nums">{r.pR.toFixed(3)}</td>
                                <td className="px-3 py-1.5">
                                  <LabelBadge label={r.call} />
                                </td>
                                <td className="px-3 py-1.5">
                                  <LabelBadge label={r.conformalSet} />
                                </td>
                                <td className="px-3 py-1.5 text-zinc-500">{r.m0Call}</td>
                                <td className="px-3 py-1.5 text-zinc-500">{r.label ?? "—"}</td>
                                <td className="px-3 py-1.5 text-zinc-500">{r.determinants}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </>
          )}

          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent batch jobs</CardTitle>
              <CardDescription>Every job and every scored isolate lands in the audit trail.</CardDescription>
            </CardHeader>
            <CardContent>
              {jobs === null ? (
                <LoadingBlock lines={2} />
              ) : jobs.length === 0 ? (
                <p className="text-xs text-zinc-500">No batches yet.</p>
              ) : (
                <div className="max-h-48 space-y-1.5 overflow-y-auto">
                  {jobs.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => {
                        setJob({ id: j.id, label: j.label, drug: j.drug, modelType: j.modelType, n: j.n, done: j.done, status: j.status as BatchState["status"] });
                        poll(j.id);
                      }}
                      className="flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5 text-left text-xs hover:border-zinc-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-400">{j.createdAt.slice(0, 19).replace("T", " ")}</span>
                        <span className="text-zinc-300">{j.label}</span>
                        <span className="font-mono text-[11px] text-zinc-500">{j.drug} · {j.modelType}</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-500">
                        {j.done}/{j.n} · {j.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
