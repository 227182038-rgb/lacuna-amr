"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Ban, Clock3, FileCheck2, Microscope, Send, TrendingUp } from "lucide-react";
import { ErrorBox, LoadingBlock, SectionHeader } from "./ui-bits";
import type { ServiceRequestRecord, ServiceResponse } from "@/lib/lacuna/api-types";
import { PLAN_TIERS } from "@/lib/lacuna/market";

const SKUS = [
  {
    id: "S1",
    name: "Dataset Audit",
    icon: FileCheck2,
    status: "Available (pilot SOP demonstrated)" as const,
    inputs: "Client isolate collection (assemblies or accessions), AST table (documented schema), user-supplied breakpoint table.",
    outputs:
      "Label-heterogeneity report (standards/platforms/methods/phenotype vocabulary, censored-MIC counts), clonality report (sketch distances, cluster sizes, dedup plan), lineage-phenotype confounding diagnostics, M0 explained/unexplained fractions per drug, recommended S0–S3 evaluation protocol with feasibility flags.",
    turnaround: "t ≈ N × c_audit + a hours; c_audit ≈ 0.01 analyst-hours/isolate + compute at ~15–30 s/isolate (measured on a 2-core machine).",
  },
  {
    id: "S2",
    name: "Validation Audit",
    icon: Microscope,
    status: "Available (pilot SOP demonstrated)" as const,
    inputs: "Developer's genome-based AMR model (callable), their labelled dataset, breakpoint table.",
    outputs:
      "Independent re-evaluation under S0/S1/S2/S3 splits (lineage/time/site hold-outs): AUROC/AUPRC/CA/VME/ME with cluster-bootstrap CIs, calibration (Brier/ECE/reliability), conformal coverage diagnostics (per-unit R-class coverage, shortfall units), risk-coverage curves, written report.",
    turnaround: "Protocol addendum frozen → test lists sealed (hashed) → containerised run → report; G3-style leakage assertions mandatory before any metric.",
  },
  {
    id: "S3",
    name: "Unexplained-Resistance Triage",
    icon: Ban,
    status: "BLOCKED — gated on G5 (phase B not attempted)" as const,
    inputs: "Planned: client's resistant isolates + features (per protocol §12).",
    outputs:
      "Planned: association testing (pyseer LMM) with permutation calibration; candidates delivered as computational hypotheses labelled 'previously reported (PMIDs)' or 'no prior report found by these queries on date D' — never 'novel' or 'mechanism'. No wet-lab instructions.",
    turnaround: "Only after an internal G5-equivalent passes on the client's data (fail-closed).",
  },
];

export function ServicesSection() {
  const [requests, setRequests] = useState<ServiceRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    fetch("/api/service-request")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests ?? []))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="service layer + pricing"
        title="Research-use-only audit services"
        description="Three SKUs with SOPs, QA checks and limitations text (service/SKU_SHEETS.md). Client data is processed locally, never shared, deleted 30 days after delivery. Turnarounds derive from measured per-isolate costs. Market figures and pricing bands on this page come from cited public benchmarks (see the Market tab) — nothing is invented."
      />

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-emerald-500">
          <TrendingUp className="h-3.5 w-3.5" /> Plans — positioned against published benchmarks, not a price list
        </h3>
        <div className="grid gap-4 lg:grid-cols-3">
          {PLAN_TIERS.map((p) => (
            <Card key={p.id} className={`bg-zinc-900/60 ${p.accent === "emerald" ? "border-emerald-800/60" : p.accent === "amber" ? "border-amber-900/40" : "border-zinc-800"}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <CardDescription className="font-mono text-[11px] text-emerald-400">{p.positioning}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs leading-relaxed">
                <ul className="list-disc space-y-1 pl-5 text-zinc-400">
                  {p.includes.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <div className="space-y-1 border-t border-zinc-800 pt-2 text-[11px] text-zinc-500">
                  <div><span className="text-zinc-400">Best for:</span> {p.bestFor}</div>
                  <div><span className="text-zinc-400">Benchmark:</span> {p.benchmark}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
          Illustrative positioning only — commercial terms require legal review (commercial/ in the research repository contains the
          contract template, regulatory memo — India/EU/US, all UNVERIFIED — risk register and data-protection checklist).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {SKUS.map((sku) => (
          <Card key={sku.id} className={`bg-zinc-900/60 ${sku.id === "S3" ? "border-amber-900/40" : "border-zinc-800"}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <sku.icon className={`h-4 w-4 ${sku.id === "S3" ? "text-amber-400" : "text-emerald-500"}`} />
                  <span className="font-mono text-sm text-emerald-400">{sku.id}</span>
                </div>
                <span className={`rounded px-1.5 py-0.5 text-[10px] ${sku.id === "S3" ? "bg-amber-950/50 text-amber-300" : "bg-emerald-950/50 text-emerald-300"}`}>
                  {sku.id === "S3" ? "BLOCKED (G5)" : "available"}
                </span>
              </div>
              <CardTitle className="text-base">{sku.name}</CardTitle>
              <CardDescription>{sku.status}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed">
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Inputs</div>
                <p className="text-zinc-400">{sku.inputs}</p>
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Outputs</div>
                <p className="text-zinc-400">{sku.outputs}</p>
              </div>
              <div className="flex gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/40 p-2 text-[11px] text-zinc-500">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {sku.turnaround}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ServiceRequestForm onSubmitted={loadRequests} />
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Inquiry ledger</CardTitle>
            <CardDescription>Recorded locally by this console — nothing leaves the environment.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingBlock lines={3} />
            ) : requests.length === 0 ? (
              <p className="text-sm text-zinc-500">No inquiries yet.</p>
            ) : (
              <div className="max-h-64 space-y-1.5 overflow-y-auto">
                {requests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400">{r.sku}</span>
                      <span className="text-zinc-300">{r.name}</span>
                      {r.org ? <span className="text-zinc-500">· {r.org}</span> : null}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      {r.isolates != null ? <span>{r.isolates} isolates</span> : null}
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5">{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
              S3 inquiries are accepted but flagged: phase B is gated on a G5-equivalent pass and will not be scheduled.
              Contract template, regulatory memo (India/EU/US — all UNVERIFIED), risk register and data-protection checklist
              live in commercial/ of the research repository for lawyer review.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ServiceRequestForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState({ sku: "S1", name: "", email: "", org: "", isolates: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: form.sku,
          name: form.name,
          email: form.email,
          org: form.org || undefined,
          isolates: form.isolates ? parseInt(form.isolates, 10) : undefined,
          message: form.message || undefined,
        }),
      });
      const data: ServiceResponse & { error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");
      toast({ title: "Inquiry recorded", description: data.notice });
      setForm({ sku: form.sku, name: "", email: "", org: "", isolates: "", message: "" });
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Request an audit</CardTitle>
        <CardDescription>
          RUO engagement scoping only. A human responds; no automated processing of any attached data occurs via this form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="sku" className="text-xs text-zinc-500">
                SKU
              </Label>
              <select
                id="sku"
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 font-mono text-xs text-zinc-200"
              >
                <option value="S1">S1 — Dataset Audit</option>
                <option value="S2">S2 — Validation Audit</option>
                <option value="S3">S3 — Unexplained-Resistance Triage</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="isolates" className="text-xs text-zinc-500">
                Approx. collection size
              </Label>
              <Input
                id="isolates"
                type="number"
                min={0}
                placeholder="e.g. 1500"
                value={form.isolates}
                onChange={(e) => setForm((f) => ({ ...f, isolates: e.target.value }))}
                className="bg-zinc-950 font-mono text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-zinc-500">
                Name *
              </Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="bg-zinc-950 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-zinc-500">
                Email *
              </Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="bg-zinc-950 text-xs" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org" className="text-xs text-zinc-500">
              Organisation
            </Label>
            <Input id="org" value={form.org} onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))} className="bg-zinc-950 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs text-zinc-500">
              Context (organism, drugs, current workflow)
            </Label>
            <Textarea id="message" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="min-h-[72px] bg-zinc-950 text-xs" />
          </div>
          {error ? <ErrorBox message={error} /> : null}
          <Button type="submit" disabled={busy} className="w-full bg-emerald-600 text-zinc-950 hover:bg-emerald-500">
            <Send className="mr-2 h-4 w-4" /> {busy ? "Recording…" : "Record inquiry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
