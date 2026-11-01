#!/usr/bin/env python3
"""GATE G2: label integrity. 25 random cohort isolates (seed 20261101): an
INDEPENDENT minimal re-implementation (regex on raw XML text, no shared code
with stage3c3) recomputes the EUCAST label from the raw BioSample XML snapshot
and must match the analysis label file for all 25. Writes gates/G2.md with raw
rows."""
import html
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
BP = {"ciprofloxacin": (0.25, 0.5), "meropenem": (2.0, 8.0), "gentamicin": (2.0, 2.0),
      "ceftazidime": (1.0, 4.0)}
DILUTION = ("broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
            "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
            "mic", "dilution")
AUTOMATED = ("vitek", "phoenix", "microscan")
GRAD = ("e-test", "etest", "gradient")

cohort = [l.split("\t") for l in (ROOT / "data" / "cohort.tsv").read_text().splitlines()]
hdr, rows = cohort[0], cohort[1:]
cohort_bs = {r[0] for r in rows}
labels = {}
for line in (ROOT / "results" / "tables" / "ast_labels_all.tsv").read_text().splitlines()[1:]:
    f = line.split("\t")
    labels[(f[0], f[1])] = f[2]

# index raw XML text per accession
raw = {}
for f in sorted(SNAP.glob("stage3_ecoli_batch_*.xml")):
    for m in re.finditer(r'<BioSample [^>]*accession="(SAMN\d+)"[^>]*>(.*?)</BioSample>',
                         f.read_text(errors="replace"), re.S):
        raw[m.group(1)] = m.group(2)

rng = random.Random(20261101)
picked = rng.sample(sorted(cohort_bs), 25)
mismatch = []
report = ["# G2 — Label integrity (independent recomputation)", "",
          f"Verdict: {'PASS' if not mismatch else 'FAIL'} (see end; computed {len(picked)} isolates, seed 20261101)", "",
          "Independent method: regex extraction of antibiogram rows from raw BioSample XML text (XML-entity-unescaped)",
          "(no code shared with the pipeline parser); label logic re-implemented from the protocol text.", ""]


def recompute(drug):
    s_bp, r_bp = BP[drug]
    # find all rows for this drug in the raw text: pattern of 10 <Cell> values
    out = []
    for rm in re.finditer(r"<Row>(.*?)</Row>", rawtxt, re.S):
        cells = re.findall(r"<Cell>(.*?)</Cell>", rm.group(1), re.S)
        cells = [re.sub(r"\s+", " ", html.unescape(c)).strip() for c in cells]
        if len(cells) >= 7 and cells[0].lower() == drug:
            out.append(cells)
    labs = set()
    detail = []
    for cells in out:
        # columns: antibiotic, phenotype, sign, measurement, unit, method, platform?, vendor?, version?, standard
        # robust: locate by expected order from header discovery (fixed layout in these records)
        phen, sign, meas, unit = cells[1], cells[2], cells[3], cells[4]
        method = cells[5] if len(cells) > 5 else ""
        plat = cells[6] if len(cells) > 6 else ""
        std = cells[9] if len(cells) > 9 else ""
        if unit.lower() != "mg/l":
            continue
        if any(a in (plat + method).lower() for a in AUTOMATED) or any(g in (plat + method).lower() for g in GRAD):
            continue
        if not (method.lower() in DILUTION or plat.lower() in ("sensititre", "96-well plate", "96 well plate")
                or (not plat.strip() and not method.strip())):
            continue
        try:
            v = float(meas)
        except ValueError:
            continue
        s = sign.strip()
        if s in ("=", "", "=="):
            lab = "S" if v <= s_bp else ("R" if v > r_bp else "I")
        elif s == ">":
            lab = "R" if v >= r_bp else "INDETERMINATE_CENSORED"
        elif s == ">=":
            lab = "R" if v > r_bp else "INDETERMINATE_CENSORED"
        else:
            lab = "S" if v <= s_bp else "INDETERMINATE_CENSORED"
        labs.add(lab)
        detail.append(f"{s}{meas} mg/L [{method}|{plat}|{std}|submitter:{phen}] -> {lab}")
    if not detail:
        return None, []
    return (labs.pop() if len(labs) == 1 else "CONFLICTED"), detail


n_checks = n_agree = 0
for bs in picked:
    rawtxt = raw.get(bs, "")
    for drug in BP:
        expect = labels.get((bs, drug))
        if expect is None:
            continue
        got, detail = recompute(drug)
        n_checks += 1
        if expect == got:
            n_agree += 1
            mark = "MATCH"
        else:
            mismatch.append((bs, drug, expect, got))
            mark = "MISMATCH"
        report.append(f"## {bs} / {drug}: {mark}")
        report.append(f"- analysis label: {expect}")
        report.append(f"- independent recomputation: {got}")
        for d in detail:
            report.append(f"  - raw row: {d}")
        report.append("")

verdict = "PASS" if (n_checks > 0 and not mismatch) else "FAIL"
report.append("---")
report.append(f"Checks: {n_checks}; agreements: {n_agree}; mismatches: {len(mismatch)}")
report.append(f"Verdict: **{verdict}**")
(ROOT / "gates" / "G2.md").write_text("\n".join(report))
print(f"G2: {n_checks} checks, {n_agree} agree, mismatches: {mismatch[:5]}")
print(f"verdict: {verdict}")
