// Manifest payload builder — extracted verbatim from the console
// /api/manifest route in v0.4.0 so the versioned API (/api/v1/manifest) and
// the MCP server (get_manifest tool) return exactly the same shape. The
// console route's response is unchanged.

import {
  loadBreakpoints,
  loadClaimsLedger,
  loadReferenceVerification,
  loadRequirementsLock,
  loadSbom,
  loadSplitsManifest,
  RUO_NOTICE,
} from "./data";

export function buildManifestPayload() {
  const sbom = loadSbom();
  const refs = loadReferenceVerification();
  const breakpoints = loadBreakpoints();
  const splits = loadSplitsManifest();
  const ledger = loadClaimsLedger();
  const lock = loadRequirementsLock();

  const refRows = refs.rows.map((r) => {
    const i = (n: string) => refs.header.indexOf(n);
    return {
      refId: r[i("ref_id")],
      doi: r[i("doi")],
      resolves: r[i("doi_resolves")],
      crossrefOk: r[i("crossref_ok")],
      title: r[i("crossref_title")],
      firstAuthor: r[i("crossref_first_author")],
      year: r[i("crossref_year")],
      venue: r[i("crossref_venue")],
      verdict: r[i("verdict")],
    };
  });

  // Summarise the pinned toolchain from requirements.lock + known external tools
  const lockLines = lock
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  return {
    notice: RUO_NOTICE,
    reproduction: {
      command: "snakemake -j 2",
      seeds: { primary: 20261101, reproduction: 42 },
      protocolSha256File: "protocol/PROTOCOL.sha256",
      externalTools: [
        { name: "AMRFinderPlus", version: "4.2.7", db: "2026-08-07.1", license: "public domain (US Gov)" },
        { name: "BLAST+", version: "2.17.0" },
        { name: "HMMER", version: "3.4" },
        { name: "sourmash", version: "4.9.4", license: "BSD-3" },
        { name: "pyseer", license: "Apache-2.0", role: "phase B engine (blocked in pilot)" },
      ],
      excludedTools: [
        { name: "CARD/RGI", reason: "commercial license + fee" },
        { name: "CLSI M100", reason: "paid standard" },
      ],
    },
    splits: { sealedUtc: splits.sealed_utc, sha256: splits.sha256, note: splits.note },
    breakpointsProvenance: {
      version: breakpoints.version,
      sourceUrl: breakpoints.source_url,
      sourceSha256: breakpoints.source_sha256,
      citation: breakpoints.citation_statement,
      bundling: "Reference-only: the EUCAST xlsx is never bundled in the web app or release archives.",
    },
    references: refRows,
    sbom: {
      spdxVersion: sbom.spdxVersion,
      name: sbom.name,
      creationInfo: sbom.creationInfo,
      packages: (sbom.packages ?? []).map((p) => ({ name: p.name, version: p.versionInfo, license: p.licenseConcluded })),
    },
    pythonLock: lockLines.slice(0, 40),
    claimsLedger: ledger.rows.map((r) => ({
      claimId: r[ledger.header.indexOf("claim_id")],
      summary: r[ledger.header.indexOf("sentence_summary")],
      resultKey: r[ledger.header.indexOf("result_key_or_reference")],
    })),
  };
}
