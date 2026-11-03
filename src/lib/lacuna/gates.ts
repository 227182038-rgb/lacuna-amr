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
  // Look at verdict lines only, in file order; overall verdict = most severe mentioned
  const lines = text.split("\n");
  const verdictLines = lines.filter((l) => /verdict/i.test(l));
  const raw = verdictLines.map((l) => l.replace(/[*#]/g, "").trim()).join(" · ");
  const hasFail = verdictLines.some((l) => /\bFAIL\b/i.test(l));
  const hasNa = verdictLines.some((l) => /NOT ATTEMPTED/i.test(l));
  // G3-style files have per-drug verdict lines; treat FAIL as dominating
  const overall: GateEntry["verdict"] = hasFail ? "FAIL" : hasNa && verdictLines.length > 0 ? "NOT ATTEMPTED" : "PASS";
  return { verdict: overall, raw: raw || "PASS" };
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
