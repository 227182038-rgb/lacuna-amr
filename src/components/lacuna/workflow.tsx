"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CircleCheck, CircleX, Lock, PauseCircle } from "lucide-react";
import { ErrorBox, LoadingBlock, SectionHeader, VerdictBadge } from "./ui-bits";

interface GateLite {
  id: string;
  title: string;
  verdict: string;
}

interface Stage {
  n: number;
  title: string;
  phase: "core" | "commercial";
  what: string;
  gates: string[];
  artifacts: string[];
  nav: string; // section id to open
  navLabel: string;
}

const STAGES: Stage[] = [
  {
    n: 1,
    title: "Ingest & verify",
    phase: "core",
    what: "Environment probe, license audit (Apache-2.0 code, public-domain AMRFinderPlus determinants, EUCAST tables user-supplied), source manifest and SBOM pinned by hash.",
    gates: ["G0", "G1"],
    artifacts: ["SBOM (SPDX)", "requirements.lock", "source manifest"],
    nav: "provenance",
    navLabel: "Provenance",
  },
  {
    n: 2,
    title: "Label audit (data gates)",
    phase: "core",
    what: "AST table audited for standards, methods and phenotype vocabulary; censored-MIC accounting; DG thresholds checked per drug (fail-closed: a drug that misses a threshold never reaches modelling).",
    gates: ["DG"],
    artifacts: ["labels summary", "per-drug verdicts"],
    nav: "audit",
    navLabel: "Dataset Audit",
  },
  {
    n: 3,
    title: "Clone dedup & lineage-aware splits",
    phase: "core",
    what: "Sketch-distance clonality check, max 3 isolates per clone-cluster per BioProject, then S0 (random) / S1 (lineage hold-out) / S2 (forward-time) / S3 (site hold-out) splits sealed and hashed before any metric is computed.",
    gates: ["G2", "G3"],
    artifacts: ["cohort.tsv", "sealed splits + hashes"],
    nav: "cohort",
    navLabel: "Cohort",
  },
  {
    n: 4,
    title: "Train M0 / M1 / M2",
    phase: "core",
    what: "M0 catalogue rule baseline; M1 regularised logistic regression; M2 boosted stumps — all deterministic (fixed seeds), with sigmoid calibration on a held-out calibration split.",
    gates: ["G4"],
    artifacts: ["fitted models", "thresholds", "model card"],
    nav: "predict",
    navLabel: "Predict",
  },
  {
    n: 5,
    title: "Conformal calibration",
    phase: "core",
    what: "Mondrian (per-class) and marginal conformal quantiles at alpha = 0.10 — every prediction can return S, R, S+R or ABSTAIN with a measured 90% coverage target, so uncertainty is explicit instead of hidden.",
    gates: ["G4"],
    artifacts: ["per-model quantiles", "coverage diagnostics"],
    nav: "predict",
    navLabel: "Predict",
  },
  {
    n: 6,
    title: "Validation across S0–S3",
    phase: "core",
    what: "AUROC / AUPRC / CA / VME / ME with cluster-bootstrap 95% CIs on every split; calibration (Brier, ECE); conformal coverage per class. Leakage re-audit runs before any metric is trusted.",
    gates: ["G6"],
    artifacts: ["main_results.json", "risk-coverage curves"],
    nav: "validate",
    navLabel: "Validate",
  },
  {
    n: 7,
    title: "Reporting & claims discipline",
    phase: "core",
    what: "DOME and TRIPOD+AI checklists, claims ledger mapping every public claim to its evidence file, model card, and a manuscript package with dual-journal author-guideline and banned-phrase audits.",
    gates: ["G7"],
    artifacts: ["FINAL_REPORT.md", "claims_ledger.tsv", "MODEL_CARD.md"],
    nav: "report",
    navLabel: "Report",
  },
  {
    n: 8,
    title: "Reproducibility & release",
    phase: "core",
    what: "Fixed seeds, locked dependencies, SBOM, reference DOI re-verification, and a manifest subcommand so any run can be re-derived from artifacts alone — gates G8–G11 close the loop.",
    gates: ["G8", "G9", "G10", "G11"],
    artifacts: ["manifest", "reference_verification.tsv"],
    nav: "provenance",
    navLabel: "Provenance",
  },
  {
    n: 9,
    title: "Market fit (researched, cited)",
    phase: "commercial",
    what: "Commercial features are chosen from externally-cited demand signals — the CDSS transparency gap, 820k-analyses demand for web AMR tools, hospital batch volumes, FHIR/GLASS interoperability, benchmarked pricing — never from invented market claims.",
    gates: [],
    artifacts: ["market research brief", "cited sources"],
    nav: "market",
    navLabel: "Market",
  },
  {
    n: 10,
    title: "Batch scoring",
    phase: "commercial",
    what: "Queue a whole labelled cohort per drug; staged processing with live progress, aggregate QA (agreement, conformal set coverage vs EUCAST labels) and CSV export — the hospital-lab throughput pattern.",
    gates: [],
    artifacts: ["batch jobs", "aggregate summary", "predictions CSV"],
    nav: "batch",
    navLabel: "Batch",
  },
  {
    n: 11,
    title: "Interoperability & compliance",
    phase: "commercial",
    what: "FHIR R4 Observation exports (v3-ObservationInterpretation codes), GLASS-style surveillance aggregates with Wilson CIs, hash-chained 21 CFR Part 11-style audit trail, and per-sample-credit API keys for LIMS integration.",
    gates: [],
    artifacts: ["FHIR bundles", "GLASS-style CSV", "audit trail"],
    nav: "compliance",
    navLabel: "Compliance",
  },
  {
    n: 12,
    title: "Service SKUs",
    phase: "commercial",
    what: "S1 Dataset Audit and S2 Validation Audit run under the same audited SOP as the pilot; S3 unexplained-resistance triage stays blocked behind a G5-equivalent pass on client data (fail-closed).",
    gates: ["G5"],
    artifacts: ["SKU sheets", "SOPs", "regulatory memo (unverified)"],
    nav: "services",
    navLabel: "Services",
  },
];

function worstVerdict(gates: GateLite[]): string | null {
  const vs = gates.map((g) => g.verdict.toUpperCase());
  if (vs.length === 0) return null;
  if (vs.includes("FAIL")) return "FAIL";
  if (vs.includes("BLOCKED")) return "BLOCKED";
  if (vs.includes("NOT ATTEMPTED")) return "NOT ATTEMPTED";
  if (vs.every((v) => v === "PASS")) return "PASS";
  return vs[0];
}

export function WorkflowSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [gates, setGates] = useState<GateLite[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gates")
      .then((r) => r.json())
      .then((d) => setGates(d.gates ?? []))
      .catch(() => setError("Could not load gate verdicts."));
  }, []);

  const gateById = new Map((gates ?? []).map((g) => [g.id, g]));
  const coreStages = STAGES.filter((s) => s.phase === "core");
  const commercialStages = STAGES.filter((s) => s.phase === "commercial");

  const renderStage = (s: Stage) => {
    const stageGates = s.gates.map((g) => gateById.get(g)).filter((g): g is GateLite => Boolean(g));
    const v = worstVerdict(stageGates);
    return (
      <Card key={s.n} className="border-zinc-800 bg-zinc-900/60">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 font-mono text-xs font-semibold text-zinc-300">
                {s.n}
              </span>
              <span className="text-sm font-semibold text-zinc-100">{s.title}</span>
            </div>
            {v ? (
              <VerdictBadge verdict={v} />
            ) : (
              <span className="rounded border border-emerald-800 bg-emerald-950/50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">LIVE</span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">{s.what}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stageGates.map((g) => (
              <span
                key={g.id}
                title={g.title}
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                  g.verdict.toUpperCase() === "PASS"
                    ? "bg-emerald-950/60 text-emerald-300"
                    : g.verdict.toUpperCase() === "FAIL"
                      ? "bg-red-950/60 text-red-300"
                      : "bg-amber-950/60 text-amber-300"
                }`}
              >
                {g.id} {g.verdict.toUpperCase()}
              </span>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-zinc-600">artifacts: {s.artifacts.join(" · ")}</div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 h-7 border-zinc-700 bg-zinc-950 text-[11px] text-zinc-300 hover:border-emerald-800 hover:text-emerald-300"
            onClick={() => onNavigate(s.nav)}
          >
            {s.navLabel} <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  const passCount = (gates ?? []).filter((g) => g.verdict.toUpperCase() === "PASS").length;
  const failCount = (gates ?? []).filter((g) => g.verdict.toUpperCase() === "FAIL").length;
  const blockedCount = (gates ?? []).filter((g) => g.verdict.toUpperCase() === "BLOCKED").length;

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="optimized workflow"
        title="End-to-end pipeline: scientific core, then commercial layer"
        description="The workflow that produced this pilot — and the commercial layer built on top of it. The scientific core is fail-closed: any gate FAIL stops downstream stages. The commercial layer (RUO) only exposes what the core has already earned. Stage statuses are the live gate verdicts from this run."
      />

      {error ? <ErrorBox message={error} /> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardContent className="flex items-center gap-3 p-4">
            <CircleCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="font-mono text-lg font-semibold text-emerald-300">{gates ? passCount : "—"}</div>
              <div className="text-[11px] text-zinc-500">gates PASS</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardContent className="flex items-center gap-3 p-4">
            <CircleX className="h-5 w-5 text-red-400" />
            <div>
              <div className="font-mono text-lg font-semibold text-red-300">{gates ? failCount : "—"}</div>
              <div className="text-[11px] text-zinc-500">gates FAIL (fail-closed: downstream blocked)</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardContent className="flex items-center gap-3 p-4">
            <PauseCircle className="h-5 w-5 text-amber-400" />
            <div>
              <div className="font-mono text-lg font-semibold text-amber-300">{gates ? blockedCount : "—"}</div>
              <div className="text-[11px] text-zinc-500">blocked / not attempted (honest scope)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-emerald-500" />
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-500">Phase A — scientific core (fail-closed gates)</h3>
        </div>
        {gates === null && !error ? <LoadingBlock lines={4} /> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{coreStages.map(renderStage)}</div>}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-amber-500">Phase B — commercial layer (research use only)</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{commercialStages.map(renderStage)}</div>
      </div>

      <Card className="border-amber-900/40 bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-amber-200">Why this order</CardTitle>
        </CardHeader>
        <CardContent className="text-xs leading-relaxed text-amber-200/70">
          Commercial features sit downstream of the audited core by design: a batch score, a FHIR export or an SKU deliverable
          can only ever expose models, splits and metrics that already passed their gates. If a gate fails on new data, the
          pipeline stops before any commercial surface can overstate what the evidence supports — the same conservatism the
          market research identifies as the missing ingredient in antimicrobial decision support.
        </CardContent>
      </Card>
    </div>
  );
}
