// Gate registry — parses the gate evidence files (gates/G0.md … G11.md) and the
// deviations log into structured data for the UI. Verdicts are read from the
// files themselves, never hard-coded, so the UI can never disagree with evidence.

import { loadDeviations, loadGateFile } from "./data";

export interface GateEntry {
  id: string;
  title: string;
  verdict: "PASS" | "FAIL" | "NOT ATTEMPTED";
  verdictRaw: string;
  evidence: string;
  filePath: string;
}

const GATE_TITLES: Record<string, string> = {
  G0: "Environment + license audit",
  G1: "Prior art + census + data gate + protocol freeze",
  G2: "Label integrity (independent recompute)",
  G3: "Split integrity (leakage assertions)",
  G4: "Catalogue sanity (M0 carrier R-rates)",
  G5: "Model integrity (seed reproduction)",
  G6: "Conformal validity on S0",
  G7: "Phase B controls",
  G8: "Reproducibility (subset re-run)",
  G9: "Manuscript verification",
  G10: "Product (fresh install + tests + demo)",
  G11: "Red-team (numbers re-derived)",
};

function extractVerdict(text: string): { verdict: GateEntry["verdict"]; raw: string } {
  // Verdict semantics (D-039): an explicit status word directly after the "Verdict:" label
  // is authoritative ("Verdict: **PASS** (corrected after review of the first FAIL)" → PASS;
  // historical/contextual FAIL mentions elsewhere never override it). Verdict lines that
  // DEFER to per-item lines ("Verdict: see per-drug lines … (PASS requires …)") carry no
  // status of their own — for those the per-item failure markers decide: heading verdicts
  // ("## ciprofloxacin: FAIL (15 problems)"), explicit "- PROBLEM:" lines and tolerance
  // breaches ("… |diff|=0.0139 -> CHECK (tolerance 0.01)") are FAIL evidence.
  const lines = text.split("\n");
  const verdictLines = lines.filter((l) => /verdict/i.test(l));
  const raw = verdictLines.map((l) => l.replace(/[*#]/g, "").trim()).join(" · ");

  // 1. Explicit statuses on verdict lines (first status word after the label wins).
  const explicit: string[] = [];
  for (const l of verdictLines) {
    const m = l.match(/verdict:?\s*\**\s*(PASS|FAIL|NOT ATTEMPTED)/i);
    if (m) explicit.push(m[1].toUpperCase());
  }
  if (explicit.length > 0) {
    if (explicit.includes("FAIL")) return { verdict: "FAIL", raw: raw || "PASS" };
    if (explicit.includes("NOT ATTEMPTED")) return { verdict: "NOT ATTEMPTED", raw: raw || "PASS" };
    return { verdict: "PASS", raw: raw || "PASS" };
  }

  // 2. Deferring verdict lines → scan the body's per-item verdict markers.
  const itemFail =
    lines.some((l) => /^#+\s*[^:]+:\s*FAIL\b/i.test(l)) || // "## ciprofloxacin: FAIL (15 problems)"
    lines.some((l) => /^\s*-\s*PROBLEM:/i.test(l)) || // "- PROBLEM: S2: dedup-cluster overlap 23"
    lines.some((l) => /->\s*CHECK\b/i.test(l)) || // "… |diff|=0.0139 -> CHECK (tolerance 0.01)"
    lines.some((l) => /\bNOT OK\b/i.test(l));
  if (itemFail) return { verdict: "FAIL", raw: raw || "PASS" };

  const hasNa = verdictLines.some((l) => /NOT ATTEMPTED/i.test(l));
  return { verdict: hasNa ? "NOT ATTEMPTED" : "PASS", raw: raw || "PASS" };
}

export function loadGates(): GateEntry[] {
  const out: GateEntry[] = [];
  for (let i = 0; i <= 11; i++) {
    const id = `G${i}`;
    try {
      const text = loadGateFile(id);
      const { verdict, raw } = extractVerdict(text);
      out.push({
        id,
        title: GATE_TITLES[id] ?? id,
        verdict,
        verdictRaw: raw,
        evidence: text,
        filePath: `gates/${id}.md`,
      });
    } catch {
      // gate file missing — skip
    }
  }
  return out;
}

export interface DeviationEntry {
  id: string;
  utc: string;
  deviation: string;
  reason: string;
  consequence: string;
}

export function loadDeviationsParsed(): DeviationEntry[] {
  const text = loadDeviations();
  const lines = text.split("\n").filter((l) => /^D-\d{3}/.test(l.trim()));
  return lines.map((l) => {
    const parts = l.trim().split(" | ");
    return {
      id: parts[0] ?? "",
      utc: parts[1] ?? "",
      deviation: parts[2] ?? "",
      reason: parts[3] ?? "",
      consequence: parts[4] ?? "",
    };
  });
}
