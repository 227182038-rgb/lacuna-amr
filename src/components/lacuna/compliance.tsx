"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, Download, FileJson, FileSpreadsheet, KeyRound, Link2, Loader2, Scale, ShieldCheck, Trash2 } from "lucide-react";
import { ErrorBox, LoadingBlock, SectionHeader } from "./ui-bits";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuditEntry {
  seq: number;
  actor: string;
  action: string;
  detail: string;
  hash: string;
  prevHash: string | null;
  createdAt: string;
}

interface Verification {
  ok: boolean;
  n: number;
  brokenAt: number | null;
  reason: string | null;
}

interface ApiKeyRow {
  id: string;
  label: string;
  keyPrefix: string;
  scope: string;
  credits: number;
  lastUsedAt: string | null;
  revokedAt: string | null;
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

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export function ComplianceSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="compliance & interoperability"
        title="Audit trail, exports and API access"
        description="The procurement-grade layer hospital and reference labs ask for: an append-only hash-chained record of every action (21 CFR Part 11-style, RUO), one-click FHIR R4 / GLASS-style / CSV exports, and per-sample-credit API keys for LIMS integration."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <AuditTrailPanel />
        <ExportsPanel />
      </div>
      <ApiKeysPanel />
      <LegalPackPanel />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase 1 legal pack pointer (templates; see DEVIATIONS.md D-047)
// ---------------------------------------------------------------------------

function LegalPackPanel() {
  const docs: [string, string][] = [
    ["Terms of Service", "deploy/legal/TERMS_OF_SERVICE.md"],
    ["Privacy Policy", "deploy/legal/PRIVACY_POLICY.md"],
    ["Data Processing Agreement", "deploy/legal/DATA_PROCESSING_AGREEMENT.md"],
    ["Incorporation checklist", "deploy/legal/INCORPORATION_CHECKLIST.md"],
  ];
  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
          <Scale className="h-4 w-4 text-emerald-400" /> Legal pack (Phase 1)
        </CardTitle>
        <CardDescription>
          Templates for the production terms, privacy policy, DPA and the incorporation checklist that unblocks real
          Stripe billing. They are drafts for counsel review — not in force, not legal advice; the sandbox cannot
          register a legal entity, so billing runs in sandbox provider mode until that lands (DEVIATIONS.md D-042/D-047).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {docs.map(([label, path]) => (
            <li key={path} className="flex items-center justify-between gap-2 rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs">
              <span className="text-zinc-300">{label}</span>
              <code className="font-mono text-[10px] text-zinc-500">{path}</code>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Audit trail
// ---------------------------------------------------------------------------

function AuditTrailPanel() {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [tip, setTip] = useState<{ seq: number; hash: string } | null>(null);
  const [verification, setVerification] = useState<Verification | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/audit-log?limit=50")
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.entries ?? []);
        setTip(d.tip ?? null);
      })
      .catch(() => setError("Could not load audit trail."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const verify = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/audit-log?verify=1&limit=50");
      const d = await res.json();
      setVerification(d.verification);
      if (d.verification?.ok) {
        toast({ title: "Chain verified", description: `${d.verification.n} entries recomputed — all hashes match.` });
      }
    } finally {
      setVerifying(false);
      load();
    }
  };

  const exportCsv = async () => {
    const res = await fetch("/api/exports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format: "audit" }),
    });
    const d = await res.json();
    if (!res.ok) {
      toast({ title: "Export failed", description: d.error, variant: "destructive" });
      return;
    }
    downloadFile(d.filename, d.mime, d.content);
    toast({ title: "Downloaded", description: `${d.n} audit entries (${d.filename})` });
    load();
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <CardTitle className="text-base">Hash-chained audit trail</CardTitle>
        </div>
        <CardDescription>
          Every console/API action lands here. hash(n) = sha256(n | hash(n−1) | actor | action | detail | timestamp) — any retroactive
          edit breaks every later hash.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" disabled={verifying} className="border-zinc-700 bg-zinc-950 text-xs text-zinc-300 hover:border-emerald-800 hover:text-emerald-300" onClick={verify}>
            {verifying ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Link2 className="mr-1.5 h-3.5 w-3.5" />} Verify chain
          </Button>
          <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-950 text-xs text-zinc-300 hover:border-emerald-800 hover:text-emerald-300" onClick={exportCsv}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> CSV
          </Button>
          {tip ? (
            <span className="font-mono text-[10px] text-zinc-600">
              tip #{tip.seq} …{tip.hash.slice(-12)}
            </span>
          ) : null}
        </div>

        {verification ? (
          verification.ok ? (
            <div className="rounded-md border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300">
              Chain intact — {verification.n} entries recomputed, every hash and link matches.
            </div>
          ) : (
            <div className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              CHAIN BROKEN at #{verification.brokenAt}: {verification.reason}
            </div>
          )
        ) : null}

        {error ? <ErrorBox message={error} /> : null}
        {entries === null ? (
          <LoadingBlock lines={4} />
        ) : entries.length === 0 ? (
          <p className="text-xs text-zinc-500">No entries yet — run a prediction or a batch and it will appear here.</p>
        ) : (
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {entries.map((e) => (
              <div key={e.seq} className="rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-zinc-600">#{e.seq}</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-300">{e.action}</span>
                    <span className="text-zinc-500">{e.actor}</span>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-zinc-600">{e.createdAt.slice(11, 19)}</span>
                </div>
                <div className="mt-0.5 truncate font-mono text-[10px] text-zinc-600" title={e.detail}>
                  {e.detail.length > 110 ? e.detail.slice(0, 110) + "…" : e.detail}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

function ExportsPanel() {
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ filename: string; content: string; n: number } | null>(null);

  const runExport = async (format: "fhir" | "glass" | "predictions") => {
    setBusy(format);
    setPreview(null);
    try {
      const res = await fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Export failed.");
      downloadFile(d.filename, d.mime, d.content);
      setPreview({ filename: d.filename, content: d.content, n: d.n });
      toast({ title: "Downloaded", description: `${d.filename} (${d.n} records)` });
    } catch (e) {
      toast({ title: "Export failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const EXPORTS = [
    {
      id: "fhir" as const,
      icon: FileJson,
      title: "FHIR R4 bundle",
      description: "Stored predictions as Observation resources with v3-ObservationInterpretation S/R codes and RUO flags. No LOINC codes asserted.",
    },
    {
      id: "glass" as const,
      icon: FileSpreadsheet,
      title: "GLASS-style aggregate",
      description: "Resistance % with Wilson 95% CIs by drug and country, computed live from the pilot AST table. Not an official WHO GLASS submission format.",
    },
    {
      id: "predictions" as const,
      icon: FileSpreadsheet,
      title: "Predictions CSV",
      description: "Every stored prediction run (manual + batch) with p(R), call, conformal set — the raw material for your own QA.",
    },
  ];

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileJson className="h-4 w-4 text-emerald-500" />
          <CardTitle className="text-base">Interoperability exports</CardTitle>
        </div>
        <CardDescription>EHR/LIMS and surveillance formats, generated from stored runs — research use only.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2.5">
          {EXPORTS.map((x) => (
            <div key={x.id} className="flex items-start justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
              <div>
                <div className="text-xs font-semibold text-zinc-200">{x.title}</div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">{x.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={busy !== null}
                className="shrink-0 border-zinc-700 bg-zinc-900 text-[11px] text-zinc-300 hover:border-emerald-800 hover:text-emerald-300"
                onClick={() => runExport(x.id)}
              >
                {busy === x.id ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1 h-3.5 w-3.5" />}
                Export
              </Button>
            </div>
          ))}
        </div>
        {preview ? (
          <div>
            <div className="mb-1 font-mono text-[10px] text-zinc-500">
              {preview.filename} — {preview.n} records, first lines:
            </div>
            <pre className="max-h-40 overflow-auto rounded-md border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-[10px] leading-relaxed text-zinc-400">
              {preview.content.split("\n").slice(0, 12).join("\n")}
            </pre>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// API keys
// ---------------------------------------------------------------------------

function ApiKeysPanel() {
  const [keys, setKeys] = useState<ApiKeyRow[] | null>(null);
  const [label, setLabel] = useState("LIMS integration key");
  const [busy, setBusy] = useState(false);
  const [issued, setIssued] = useState<{ key: string; id: string } | null>(null);

  const load = useCallback(() => {
    fetch("/api/keys")
      .then((r) => r.json())
      .then((d) => setKeys(d.keys ?? []))
      .catch(() => setKeys([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const issue = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, scope: "read+predict" }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Issue failed.");
      setIssued({ key: d.key, id: d.id });
      toast({ title: "Key issued", description: "Copy it now — it is never shown again." });
      load();
    } catch (err) {
      toast({ title: "Issue failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id: string) => {
    const res = await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Key revoked" });
      load();
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-emerald-500" />
          <CardTitle className="text-base">API keys — programmatic access with per-sample credits</CardTitle>
        </div>
        <CardDescription>
          Labs integrate via REST, not browsers. Keys authenticate batch submissions (x-api-key header on POST /api/batch) and carry
          credits aligned to the published US$0.50–7 per-sample compute benchmark. Only the SHA-256 hash is stored; the full key is
          shown once at issue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {issued ? (
          <div className="rounded-md border border-emerald-900 bg-emerald-950/30 p-3">
            <div className="mb-1.5 text-xs font-semibold text-emerald-300">Copy this key now — shown once</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 overflow-x-auto rounded bg-zinc-950 px-2 py-1.5 font-mono text-[11px] text-emerald-300">{issued.key}</code>
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-800 bg-zinc-950 text-emerald-300 hover:border-emerald-700"
                onClick={() => {
                  navigator.clipboard?.writeText(issued.key);
                  toast({ title: "Copied to clipboard" });
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : null}

        <form onSubmit={issue} className="flex flex-wrap items-end gap-2.5">
          <div className="min-w-[220px] flex-1 space-y-1.5">
            <Label htmlFor="key-label" className="text-xs text-zinc-500">
              Key label
            </Label>
            <Input id="key-label" value={label} maxLength={120} onChange={(e) => setLabel(e.target.value)} className="bg-zinc-950 text-xs" />
          </div>
          <Button type="submit" disabled={busy} className="bg-emerald-600 text-zinc-950 hover:bg-emerald-500">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />} Issue key (100 credits)
          </Button>
        </form>

        {keys === null ? (
          <LoadingBlock lines={2} />
        ) : keys.length === 0 ? (
          <p className="text-xs text-zinc-500">No keys issued yet.</p>
        ) : (
          <div className="space-y-1.5">
            {keys.map((k) => (
              <div
                key={k.id}
                className={`flex items-center justify-between gap-3 rounded-md border px-2.5 py-1.5 text-xs ${
                  k.revokedAt ? "border-zinc-800/60 bg-zinc-950/20 opacity-60" : "border-zinc-800 bg-zinc-950/40"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="font-mono text-zinc-400">{k.keyPrefix}…</span>
                  <span className="truncate text-zinc-300">{k.label}</span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">{k.scope}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2 font-mono text-[11px]">
                  <span className={k.credits > 20 ? "text-emerald-300" : "text-amber-300"}>{k.credits} cr</span>
                  {k.revokedAt ? (
                    <span className="text-zinc-600">revoked</span>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px] text-red-400 hover:bg-red-950/40 hover:text-red-300" onClick={() => revoke(k.id)}>
                      <Trash2 className="mr-1 h-3 w-3" /> Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-[10px] leading-relaxed text-zinc-500">
{`curl -X POST /api/batch \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: lacuna_live_…" \\
  -d '{"label":"Nightly LIMS sync","drug":"ciprofloxacin","modelType":"M1","n":120}'`}
        </pre>
      </CardContent>
    </Card>
  );
}
