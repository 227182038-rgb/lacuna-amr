#!/usr/bin/env python3
"""Stage 3c-2: ceftazidime labels for the downloaded cohort (reserve drug),
re-parsed from saved BioSample batch XMLs (ceftazidime rows were not retained
in the acquisition state because the acquisition targeted 3 drugs)."""
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
OUT = ROOT / "results" / "tables"
S_BP, R_BP = 1.0, 4.0  # EUCAST v16.1 Enterobacterales ceftazidime (results/tables/breakpoints_eucast_v16_1.json)
DILUTION = {"broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
            "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
            "mic", "dilution"}
AUTOMATED = ("vitek", "phoenix", "microscan")
GRADIENT = ("e-test", "etest", "gradient")
state = json.loads((ROOT / "data" / "stage3_state.json").read_text())
downloaded = set(state["downloaded"].keys())


def label_from(sign, meas):
    try:
        v = float(meas)
    except (TypeError, ValueError):
        return "INVALID_VALUE"
    sign = (sign or "").strip()
    if sign in ("=", "", "=="):
        if v <= S_BP:
            return "S"
        if v > R_BP:
            return "R"
        return "I"
    if sign == ">":
        return "R" if v >= R_BP else "INDETERMINATE_CENSORED"
    if sign == ">=":
        return "R" if v > R_BP else "INDETERMINATE_CENSORED"
    if sign in ("<", "<="):
        return "S" if v <= S_BP else "INDETERMINATE_CENSORED"
    return "INVALID_SIGN"


accs = {}
for f in sorted(SNAP.glob("stage3_ecoli_batch_*.xml")):
    try:
        root = ET.fromstring(f.read_bytes())
    except ET.ParseError:
        continue
    for bs in root.findall(".//BioSample"):
        accs[bs.get("accession")] = bs

summary = Counter()
rows = []
for acc, bs in accs.items():
    if acc not in downloaded:
        continue
    for table in bs.findall(".//Table"):
        if "antibiogram" not in (table.get("class") or "").lower():
            continue
        header = [ "".join(c.itertext()).strip().lower() for c in table.findall(".//Header/Cell") ]
        idx = {}
        for j, h in enumerate(header):
            if "antibiotic" in h:
                idx["ab"] = j
            elif "measurement sign" in h:
                idx["sign"] = j
            elif h == "measurement":
                idx["meas"] = j
            elif "unit" in h:
                idx["unit"] = j
            elif "typing method" in h and "version" not in h:
                idx["method"] = j
            elif "platform" in h:
                idx["plat"] = j
        for row in table.findall(".//Row"):
            cells = [ "".join(c.itertext()).strip() for c in row.findall("./Cell") ]
            def g(k):
                j = idx.get(k)
                return cells[j] if j is not None and j < len(cells) else ""
            if g("ab").lower().strip() != "ceftazidime":
                continue
            if g("unit").lower() != "mg/l" or not g("meas"):
                continue
            method, plat = g("method").lower(), g("plat").lower()
            if any(a in method or a in plat for a in AUTOMATED) or any(x in method or x in plat for x in GRADIENT):
                kind = "excluded_platform"
            elif method in DILUTION or plat in {"sensititre", "96-well plate", "96 well plate"} or (not plat and not method):
                kind = "primary_rule"
            else:
                kind = "excluded_platform" if not method else "primary_rule"
            lab = label_from(g("sign"), g("meas")) if kind == "primary_rule" else "n/a"
            rows.append((acc, kind, g("sign"), g("meas"), lab))
            if kind == "primary_rule":
                summary[lab] += 1

# aggregate multi-rows per isolate (agreement rule as in stage3c)
per_iso = {}
for acc, kind, sign, meas, lab in rows:
    if kind == "primary_rule":
        per_iso.setdefault(acc, set()).add(lab)
final = Counter()
for acc, labs in per_iso.items():
    final[labs.pop() if len(labs) == 1 else "CONFLICTED"] += 1
print("=== ceftazidime labels (downloaded cohort n=%d) ===" % len(downloaded))
for k in sorted(final):
    print(f"   {k:<24} {final[k]}")
n_labeled = sum(final.values())
print(f"labeled isolates: {n_labeled}; R fraction = "
      f"{final.get('R',0)/max(1,n_labeled):.3f}")
(OUT / "ceftazidime_labels_summary.json").write_text(json.dumps(
    {"label_counts": dict(final), "n_downloaded": len(downloaded)}, indent=2))
