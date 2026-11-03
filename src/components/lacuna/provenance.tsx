"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ErrorBox, KeyValue, LoadingBlock, SectionHeader } from "./ui-bits";
import type { ManifestResponse } from "@/lib/lacuna/api-types";

export function ProvenanceSection() {
  const [data, setData] = useState<ManifestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/manifest")
      .then((r) => r.json())
      .then((d: ManifestResponse) => setData(d))
      .catch(() => setError("Failed to load manifest."));
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <LoadingBlock lines={6} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="lacuna manifest"
        title="Provenance, licences & reproducibility"
        description="Everything a reviewer needs to re-derive the run: pinned toolchain, sealed split hashes, DOI-verified references, SPDX SBOM, claims ledger, and the never-bundle posture for EUCAST tables."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Reproduction</CardTitle>
            <CardDescription>From the research repository root.</CardDescription>
          </CardHeader>
          <CardContent>
            <KeyValue k="Command" v={<span className="text-emerald-300">{data.reproduction.command}</span>} />
            <KeyValue k="Primary seed" v={data.reproduction.seeds.primary} />
            <KeyValue k="Reproduction seed" v={data.reproduction.seeds.reproduction} />
            <KeyValue k="Protocol SHA-256" v="frozen in protocol/PROTOCOL.sha256" />
            <div className="mt-3 space-y-1.5">
              {data.reproduction.externalTools.map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5">
                  <span className="font-mono text-xs text-zinc-200">
                    {t.name}
                    {t.version ? <span className="text-zinc-500"> {t.version}</span> : null}
                    {t.db ? <span className="text-zinc-500"> · DB {t.db}</span> : null}
                  </span>
                  <span className="text-[11px] text-zinc-500">{t.license ?? t.role ?? ""}</span>
                </div>
              ))}
              {data.reproduction.excludedTools.map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded-md border border-red-900/40 bg-red-950/20 px-2.5 py-1.5">
                  <span className="font-mono text-xs text-red-300/80">{t.name}</span>
                  <span className="text-[11px] text-red-300/60">excluded — {t.reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Sealed splits &amp; breakpoints</CardTitle>
            <CardDescription>Hashed before any model was fitted; breakpoints user-supplied.</CardDescription>
          </CardHeader>
          <CardContent>
            <KeyValue k="Splits sealed (UTC)" v={data.splits.sealedUtc} />
            {Object.entries(data.splits.sha256).map(([drug, hash]) => (
              <KeyValue key={drug} k={`sha256 ${drug}`} v={<span className="break-all text-[10px]">{hash}</span>} />
            ))}
            <div className="mt-3 rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
              <div className="mb-1 text-[11px] uppercase tracking-wider text-zinc-500">EUCAST source</div>
              <KeyValue k="Version" v={data.breakpointsProvenance.version} />
              <KeyValue k="Source SHA-256" v={<span className="break-all text-[10px]">{data.breakpointsProvenance.sourceSha256}</span>} />
              <KeyValue k="URL" v={<span className="break-all text-[10px]">{data.breakpointsProvenance.sourceUrl}</span>} />
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">{data.breakpointsProvenance.bundling}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-base">References — DOI-verified in-run</CardTitle>
          <CardDescription>
            Crossref + PubMed re-verification captured as snapshots during the run (provenance/reference_verification.tsv).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 text-[11px] text-zinc-500">
                  <TableHead>ID</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>DOI</TableHead>
                  <TableHead>Venue / year</TableHead>
                  <TableHead>Verdict</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.references.map((r) => (
                  <TableRow key={r.refId} className="border-zinc-800/60">
                    <TableCell className="font-mono text-xs text-emerald-400">{r.refId}</TableCell>
                    <TableCell className="max-w-[320px] text-xs text-zinc-300">
                      <span className="font-medium text-zinc-200">{r.firstAuthor} {r.year}</span> — {r.title.slice(0, 90)}
                      {r.title.length > 90 ? "…" : ""}
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-zinc-400">{r.doi}</TableCell>
                    <TableCell className="text-xs text-zinc-400">{r.venue || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          r.verdict === "VERIFIED"
                            ? "border-emerald-800 bg-emerald-950/50 text-emerald-300"
                            : "border-amber-800 bg-amber-950/50 text-amber-300"
                        }
                      >
                        {r.verdict}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">
            R06 (Inda-Díaz 2026) is recorded MISMATCH — retrieved metadata did not match the expected title/author pair; the
            claim ledger carries the caveat.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">SBOM (SPDX {data.sbom.spdxVersion})</CardTitle>
            <CardDescription>Generated programmatically at release time (sbom.spdx.json).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {data.sbom.packages.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5">
                  <span className="font-mono text-xs text-zinc-200">{p.name}</span>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {p.version} · {p.license}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-base">Claims ledger</CardTitle>
            <CardDescription>Every quantitative claim maps to a result file or verified reference (paper/claims_ledger.tsv).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {data.claimsLedger.map((c) => (
                <div key={c.claimId} className="rounded-md border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-emerald-400">{c.claimId}</span>
                    <span className="truncate pl-2 font-mono text-[10px] text-zinc-500">{c.resultKey}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-400">{c.summary}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-base">Python stack — pinned (requirements.lock excerpt)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {data.pythonLock.map((l, i) => (
              <span key={i} className="rounded border border-zinc-800 bg-zinc-950/40 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                {l}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
