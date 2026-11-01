#!/usr/bin/env python3
"""Stage 3c-3: unified label file for all four evaluated drugs (ciprofloxacin,
meropenem, gentamicin, ceftazidime) parsed directly from saved BioSample batch
XMLs for the downloaded cohort. Single code path used by all downstream
analysis. Writes results/tables/ast_labels_all.tsv + labels_summary_all.json."""
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
OUT = ROOT / "results" / "tables"
DRUGS = {"ciprofloxacin": (0.25, 0.5), "meropenem": (2.0, 8.0),
         "gentamicin": (2.0, 2.0), "ceftazidime": (1.0, 4.0)}  # (S<=, R>) EUCAST v16.1 Enterobacterales
DILUTION = {"broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
            "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
            "mic", "dilution"}
AUTOMATED = ("vitek", "phoenix", "microscan")
GRADIENT = ("e-test", "etest", "gradient")
state = json.loads((ROOT / "data" / "stage3_state.json").read_text())
downloaded = set(state["downloaded"].keys())
sel = {s["biosample"]: s for s in state["selection"]}


def label_from(sign, meas, s_bp, r_bp):
    try:
        v = float(meas)
    except (TypeError, ValueError):
        return "INVALID_VALUE"
    sign = (sign or "").strip()
    if sign in ("=", "", "=="):
        if v <= s_bp:
            return "S"
        if v > r_bp:
            return "R"
        return "I"
    if sign == ">":
        return "R" if v >= r_bp else "INDETERMINATE_CENSORED"
    if sign == ">=":
        return "R" if v > r_bp else "INDETERMINATE_CENSORED"
    if sign in ("<", "<="):
        return "S" if v <= s_bp else "INDETERMINATE_CENSORED"
    return "INVALID_SIGN"


def year_from(d):
    if not d:
        return ""
    m = re.search(r"(1[89]\d\d|20\d\d)", str(d))
    return m.group(1) if m else ""


accs = {}
for f in sorted(SNAP.glob("stage3_ecoli_batch_*.xml")):
    try:
        root = ET.fromstring(f.read_bytes())
    except ET.ParseError:
        continue
    for bs in root.findall(".//BioSample"):
        acc = bs.get("accession")
        if acc in downloaded:
            accs[acc] = bs

rows_out = []
summary = Counter()
for acc, bs in accs.items():
    meta = {"year": "", "country": "", "source": "", "strain": ""}
    for attr in bs.findall(".//Attribute"):
        h = attr.get("harmonized_name") or ""
        v = (attr.text or "").strip()
        if h == "collection_date":
            meta["year"] = year_from(v)
        elif h == "geo_loc_name":
            meta["country"] = v
        elif h == "isolation_source":
            meta["source"] = v
        elif h == "strain":
            meta["strain"] = v
    drugrows = {d: [] for d in DRUGS}
    for table in bs.findall(".//Table"):
        if "antibiogram" not in (table.get("class") or "").lower():
            continue
        header = [ "".join(c.itertext()).strip().lower() for c in table.findall(".//Header/Cell") ]
        idx = {}
        for j, h in enumerate(header):
            if "antibiotic" in h:
                idx["ab"] = j
            elif "resistance phenotype" in h:
                idx["phen"] = j
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
            elif "testing standard" in h:
                idx["std"] = j
        for row in table.findall(".//Row"):
            cells = [ "".join(c.itertext()).strip() for c in row.findall("./Cell") ]
            def g(k):
                j = idx.get(k)
                return cells[j] if j is not None and j < len(cells) else ""
            ab = g("ab").lower().strip()
            if ab not in DRUGS:
                continue
            if g("unit").lower() != "mg/l" or not g("meas"):
                continue
            method, plat = g("method").lower(), g("plat").lower()
            if any(a in method or a in plat for a in AUTOMATED) or any(x in method or x in plat for x in GRADIENT):
                kind = "excluded_platform"
            elif method in DILUTION or plat in {"sensititre", "96-well plate", "96 well plate"} or (not plat and not method):
                kind = "primary_rule"
            else:
                kind = "primary_rule" if method in DILUTION else "excluded_platform"
            drugrows[ab].append({"kind": kind, "sign": g("sign"), "meas": g("meas"),
                                 "method": g("method"), "plat": g("plat"), "std": g("std"),
                                 "phen": g("phen")})
    for drug, dr in drugrows.items():
        if not dr:
            continue
        s_bp, r_bp = DRUGS[drug]
        prim = [r for r in dr if r["kind"] == "primary_rule"]
        other = [r for r in dr if r["kind"] != "primary_rule"]
        if not prim:
            lab = "NO_PRIMARY_ROW"
        else:
            labs = {label_from(r["sign"], r["meas"], s_bp, r_bp) for r in prim}
            lab = labs.pop() if len(labs) == 1 else "CONFLICTED"
        summary[f"{drug}_{lab}"] += 1
        rows_out.append({
            "biosample": acc, "drug": drug, "label_eucast": lab, "n_primary_rows": len(prim),
            "primary_rows": " ; ".join(f"{r['sign']}{r['meas']}[{r['method']}|{r['plat']}|{r['std']}|{r['phen']}]" for r in prim),
            "other_rows_count": len(other),
            "other_labels": "|".join(sorted({r["phen"] for r in other if r["phen"]})),
            "submitter_phenotypes": "|".join(sorted({r["phen"] for r in dr if r["phen"]})),
            "standards": "|".join(sorted({r["std"] for r in dr if r["std"]})),
            "year": meta["year"], "country": meta["country"], "source": meta["source"][:40],
            "strain": meta["strain"][:40],
            "bioproject": sel.get(acc, {}).get("bioproject", ""),
            "submitter_org": sel.get(acc, {}).get("submitter_org", ""),
        })

keys = ["biosample", "drug", "label_eucast", "n_primary_rows", "primary_rows", "other_rows_count",
        "other_labels", "submitter_phenotypes", "standards", "year", "country", "source", "strain",
        "bioproject", "submitter_org"]
with open(OUT / "ast_labels_all.tsv", "w") as fh:
    fh.write("\t".join(keys) + "\n")
    for r in rows_out:
        fh.write("\t".join(str(r[k]).replace("\t", " ") for k in keys) + "\n")
(OUT / "labels_summary_all.json").write_text(json.dumps(
    {"label_counts": dict(summary), "n_isolates": len(downloaded)}, indent=2))
print("=== unified label summary (n=450 downloaded) ===")
for k in sorted(summary):
    print(f"   {k:<36} {summary[k]}")
print("wrote results/tables/ast_labels_all.tsv")
