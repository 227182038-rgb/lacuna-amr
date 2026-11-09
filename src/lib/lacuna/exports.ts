// Export builders for the compliance/interoperability layer.
// - FHIR R4 Bundle of Observation resources (HL7 v3-ObservationInterpretation
//   S/R codes; no LOINC codes are asserted — we do not invent identifiers)
// - GLASS-style aggregate resistance proportions with Wilson 95% CIs,
//   computed live from the real pilot AST table
// - CSV serialization for predictions, audit trail and batch results

import { db } from "@/lib/db";
import { loadAstTable, loadCohortTable, RUO_NOTICE } from "./data";

// ---------------------------------------------------------------------------
// Wilson score interval for a binomial proportion
// ---------------------------------------------------------------------------

export function wilson(k: number, n: number, z = 1.96): [number, number] {
  if (n === 0) return [0, 1];
  const p = k / n;
  const denom = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return [Math.max(0, centre - half), Math.min(1, centre + half)];
}

// ---------------------------------------------------------------------------
// FHIR R4 export
// ---------------------------------------------------------------------------

export interface FhirExport {
  filename: string;
  mime: string;
  content: string;
  n: number;
}

export async function buildFhirExport(runId?: string, limit = 50, organizationId?: string | null): Promise<FhirExport> {
  // Tenant scoping: only runs from the caller's workspace are exportable.
  const orgFilter = { organizationId: organizationId ?? null };
  const runs = runId
    ? await db.predictRun.findMany({ where: { id: runId, ...orgFilter }, take: 1 })
    : await db.predictRun.findMany({ where: orgFilter, orderBy: { createdAt: "desc" }, take: limit });

  const entries = runs.map((r) => {
    const out = JSON.parse(r.output) as {
      determinants?: string[];
      conformalSetMondrian?: string;
      quantiles?: unknown;
    };
    return {
      fullUrl: `urn:uuid:${r.id}`,
      resource: {
        resourceType: "Observation",
        id: r.id,
        status: "preliminary",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "laboratory",
              },
            ],
          },
        ],
        code: {
          text: `Genome-based predicted antimicrobial susceptibility - ${r.drug} (LACUNA-AMR ${r.modelType}, research use only)`,
        },
        subject: r.isolate
          ? { identifier: { system: "https://www.ncbi.nlm.nih.gov/biosample", value: r.isolate } }
          : { identifier: { value: "manual-feature-input" } },
        effectiveDateTime: r.createdAt.toISOString(),
        valueCodeableConcept: {
          text: `Predicted ${r.call ?? "N/A"} (calibrated p(R) = ${r.pR != null ? Number(r.pR).toFixed(3) : "N/A"})`,
        },
        interpretation: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                code: r.call ?? "S",
              },
            ],
            text: r.call === "R" ? "Resistant (predicted)" : "Susceptible (predicted)",
          },
        ],
        note: [
          {
            text: `${RUO_NOTICE} Conformal prediction set (Mondrian, alpha=0.10): ${out.conformalSetMondrian ?? "N/A"}. Determinants: ${(out.determinants ?? []).join(", ") || "none"}.`,
          },
        ],
      },
    };
  });

  const bundle = {
    resourceType: "Bundle",
    type: "collection",
    timestamp: new Date().toISOString(),
    meta: {
      tag: [
        {
          system: "https://lacuna-amr.local/fhir",
          code: "RUO",
          display: RUO_NOTICE,
        },
      ],
    },
    entry: entries,
  };

  return {
    filename: `lacuna-fhir-${runId ? runId.slice(0, 8) : "latest"}-${new Date().toISOString().slice(0, 10)}.json`,
    mime: "application/fhir+json",
    content: JSON.stringify(bundle, null, 2),
    n: entries.length,
  };
}

// ---------------------------------------------------------------------------
// GLASS-style aggregate export (computed from the real AST table)
// ---------------------------------------------------------------------------

export interface GlassRow {
  drug: string;
  group: string; // "ALL" | country | BioProject
  nTested: number;
  nS: number;
  nR: number;
  pctR: number;
  ciLow: number;
  ciHigh: number;
  nCensored: number;
}

export function buildGlassRows(drug?: string): GlassRow[] {
  const ast = loadAstTable();
  const cohort = new Set(loadCohortTable().map((c) => c.biosample));
  const rows = ast.rows.filter((r) => cohort.has(r.biosample));

  const drugs = drug ? [drug] : Array.from(new Set(rows.map((r) => r.drug))).sort();
  const out: GlassRow[] = [];

  for (const d of drugs) {
    const drugRows = rows.filter((r) => r.drug === d);
    const labelled = drugRows.filter((r) => r.labelEucast === "S" || r.labelEucast === "R");
    const nR = labelled.filter((r) => r.labelEucast === "R").length;
    const nS = labelled.length - nR;
    const [lo, hi] = wilson(nR, labelled.length);
    out.push({
      drug: d,
      group: "ALL",
      nTested: labelled.length,
      nS,
      nR,
      pctR: labelled.length ? nR / labelled.length : 0,
      ciLow: lo,
      ciHigh: hi,
      nCensored: drugRows.length - labelled.length,
    });

    // per-country breakdown (only groups with >= 1 labelled isolate)
    const byCountry = new Map<string, { s: number; r: number; censored: number }>();
    for (const r of drugRows) {
      const key = r.country || "unknown";
      const agg = byCountry.get(key) ?? { s: 0, r: 0, censored: 0 };
      if (r.labelEucast === "R") agg.r++;
      else if (r.labelEucast === "S") agg.s++;
      else agg.censored++;
      byCountry.set(key, agg);
    }
    for (const [country, agg] of Array.from(byCountry.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
      const n = agg.s + agg.r;
      if (n < 1) continue; // groups with no labelled isolates carry no information
      const [lo2, hi2] = wilson(agg.r, n);
      out.push({
        drug: d,
        group: country,
        nTested: n,
        nS: agg.s,
        nR: agg.r,
        pctR: n ? agg.r / n : 0,
        ciLow: lo2,
        ciHigh: hi2,
        nCensored: agg.censored,
      });
    }
  }
  return out;
}

export function glassToCsv(rows: GlassRow[]): string {
  const header = ["drug", "group", "n_tested", "n_S", "n_R", "pct_R", "pct_R_ci95_low", "pct_R_ci95_high", "n_censored"];
  const lines = rows.map((r) =>
    [r.drug, r.group, r.nTested, r.nS, r.nR, (r.pctR * 100).toFixed(1), (r.ciLow * 100).toFixed(1), (r.ciHigh * 100).toFixed(1), r.nCensored].join(",")
  );
  return [
    "# GLASS-style aggregate computed from the LACUNA-AMR pilot cohort (240 isolates)",
    `# Generated ${new Date().toISOString()} - ${RUO_NOTICE}`,
    `# NOT an official WHO GLASS submission format; resistance proportions use EUCAST v16.1 user-supplied breakpoints`,
    header.join(","),
    ...lines,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Generic CSV helpers
// ---------------------------------------------------------------------------

export function csvEscape(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(header: string[], rows: unknown[][]): string {
  return [header.join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
}

export async function buildAuditCsv(): Promise<{ filename: string; mime: string; content: string; n: number }> {
  const entries = await db.auditLog.findMany({ orderBy: { seq: "asc" } });
  const header = ["seq", "timestamp", "actor", "action", "detail", "hash", "prev_hash"];
  const rows = entries.map((e) => [e.seq, e.createdAt.toISOString(), e.actor, e.action, e.detail, e.hash, e.prevHash ?? ""]);
  return {
    filename: `lacuna-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`,
    mime: "text/csv",
    content: toCsv(header, rows),
    n: entries.length,
  };
}

export async function buildPredictionsCsv(drug?: string, organizationId?: string | null): Promise<{ filename: string; mime: string; content: string; n: number }> {
  const orgFilter = drug ? { drug, organizationId: organizationId ?? null } : { organizationId: organizationId ?? null };
  const runs = await db.predictRun.findMany({
    where: orgFilter,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  const header = ["run_id", "timestamp", "drug", "isolate", "model", "m0_call", "p_R", "call", "conformal_set_mondrian"];
  const rows = runs.map((r) => [
    r.id,
    r.createdAt.toISOString(),
    r.drug,
    r.isolate ?? "manual",
    r.modelType,
    r.m0Call ?? "",
    r.pR != null ? Number(r.pR).toFixed(4) : "",
    r.call ?? "",
    r.conformalSet ?? "",
  ]);
  return {
    filename: `lacuna-predictions-${drug ?? "all"}-${new Date().toISOString().slice(0, 10)}.csv`,
    mime: "text/csv",
    content: `# ${RUO_NOTICE}\n` + toCsv(header, rows),
    n: runs.length,
  };
}
