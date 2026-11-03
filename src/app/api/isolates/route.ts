import { NextResponse } from "next/server";
import { DRUGS, loadAstTable, loadCohortTable, loadFeatures, loadM0Mapping, RUO_NOTICE } from "@/lib/lacuna/data";

export const dynamic = "force-dynamic";

/**
 * Cohort isolate browser for the Predict tab: per-isolate metadata,
 * per-drug label, and determinant profile (trimmed to what the UI needs).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const drug = url.searchParams.get("drug");
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "60", 10) || 60, 200);
  const withDeterminants = url.searchParams.get("determinants") === "1";

  if (!drug || !DRUGS.includes(drug as (typeof DRUGS)[number])) {
    return NextResponse.json({ error: `?drug= must be one of: ${DRUGS.join(", ")}` }, { status: 400 });
  }

  const cohort = loadCohortTable();
  const features = loadFeatures();
  const ast = loadAstTable();
  const m0 = loadM0Mapping();

  const labelByIso = new Map<string, string>();
  for (const r of ast.rows) {
    if (r.drug === drug) labelByIso.set(r.biosample, r.labelEucast);
  }
  const isoIdx = new Map(features.isolates.map((iso, i) => [iso, i]));
  const m0Set = new Set(m0.feature_sets[drug] ?? []);

  let items = cohort.map((c) => {
    const idx = isoIdx.get(c.biosample);
    const row = idx !== undefined ? features.matrix[idx] : null;
    const present: string[] = [];
    if (row) {
      for (let j = 0; j < features.features.length; j++) {
        if (row[j] === 1) present.push(features.features[j]);
      }
    }
    return {
      biosample: c.biosample,
      bioproject: c.bioproject,
      submitterOrg: c.submitterOrg,
      coarseLineage: c.coarseLineage,
      dedupCluster: c.dedupCluster,
      label: labelByIso.get(c.biosample) ?? null,
      nDeterminants: present.length,
      m0Determinants: present.filter((f) => m0Set.has(f)),
      determinants: withDeterminants ? present : undefined,
    };
  });

  if (q) {
    items = items.filter(
      (i) =>
        i.biosample.toLowerCase().includes(q) ||
        i.bioproject.toLowerCase().includes(q) ||
        i.submitterOrg.toLowerCase().includes(q) ||
        i.coarseLineage.includes(q)
    );
  }

  // Labelled S/R first (they are the analysis set), then rest
  const rank = (l: string | null) => (l === "R" ? 0 : l === "S" ? 1 : 2);
  items.sort((a, b) => rank(a.label) - rank(b.label) || a.biosample.localeCompare(b.biosample));

  return NextResponse.json({
    drug,
    notice: RUO_NOTICE,
    total: items.length,
    returned: Math.min(items.length, limit),
    items: items.slice(0, limit),
  });
}
