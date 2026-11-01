#!/usr/bin/env python3
"""Stage 3c: EUCAST v16.1 labels for the downloaded cohort + assembly stats QC.
- labels: primary-rule rows only (protocol S5); multi-row agreement rule (D-009);
  censoring -> interval logic vs breakpoints; I excluded from primary sets.
- stats: contigs/length/N50 computed from the downloaded FASTA (local ground truth).
Outputs: results/tables/ast_labels_detail.tsv, results/tables/labels_summary.json,
data/assembly_stats.tsv."""
import gzip
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASM = ROOT / "data" / "assemblies"
OUT = ROOT / "results" / "tables"
BP = json.loads((OUT / "breakpoints_eucast_v16_1.json").read_text())["breakpoints"]
DRUGS = ["ciprofloxacin", "meropenem", "gentamicin"]
state = json.loads((ROOT / "data" / "stage3_state.json").read_text())
downloaded = set(state["downloaded"].keys())
sel = {s["biosample"]: s for s in state["selection"]}


def bp_num(x):
    m = re.search(r"\d+(?:\.\d+)?", str(x))
    return float(m.group(0)) if m else None


BPV = {d: (bp_num(BP[d]["S_le_mg_L"]), bp_num(BP[d]["R_gt_mg_L"])) for d in DRUGS}


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
    if sign == ">":  # open interval (v, inf): S impossible; R iff every member > r_bp
        return "R" if v >= r_bp else "INDETERMINATE_CENSORED"
    if sign == ">=":  # [v, inf)
        return "R" if v > r_bp else "INDETERMINATE_CENSORED"
    if sign == "<":  # (0, v): R impossible; S iff every member <= s_bp
        return "S" if v <= s_bp else "INDETERMINATE_CENSORED"
    if sign == "<=":  # (0, v]
        return "S" if v <= s_bp else "INDETERMINATE_CENSORED"
    return "INVALID_SIGN"


def year_from(d):
    if not d:
        return ""
    m = re.search(r"(1[89]\d\d|20\d\d)", str(d))
    return m.group(1) if m else ""


rows_out = []
summary = Counter()
for rec in state["records"]:
    bs = rec["accession"]
    if bs not in downloaded:
        continue
    year = year_from(rec.get("collection_date"))
    for drug in DRUGS:
        drows = [r for r in rec["rows"] if r["drug"] == drug]
        if not drows:
            continue
        prim = [r for r in drows if r["kind"] == "primary_rule"]
        other = [r for r in drows if r["kind"] != "primary_rule"]
        if not prim:
            lab = "NO_PRIMARY_ROW"
        else:
            labs = set()
            for r in prim:
                labs.add(label_from(r["sign"], r["measurement"], *BPV[drug]))
            lab = labs.pop() if len(labs) == 1 else "CONFLICTED"
        summary[f"{drug}_{lab}"] += 1
        rows_out.append({
            "biosample": bs, "drug": drug, "label_eucast": lab, "n_primary_rows": len(prim),
            "primary_rows": " ; ".join(f"{r['sign']}{r['measurement']}mg/L[{r['method']}|{r['platform']}|{r['standard']}|{r['submitter_phenotype']}]" for r in prim),
            "other_rows": " ; ".join(f"{r['kind']}:{r['sign']}{r['measurement']}[{r['submitter_phenotype']}]" for r in other),
            "submitter_phenotypes": "|".join(sorted({r["submitter_phenotype"] for r in drows if r["submitter_phenotype"]})),
            "standards": "|".join(sorted({r["standard"] for r in drows if r["standard"]})),
            "year": year, "country": rec.get("geo_loc", ""), "source": rec.get("isolation_source", ""),
            "host": rec.get("host", ""), "strain": rec.get("strain", ""),
        })

with open(OUT / "ast_labels_detail.tsv", "w") as fh:
    if rows_out:
        keys = list(rows_out[0].keys())
        fh.write("\t".join(keys) + "\n")
        for r in rows_out:
            fh.write("\t".join(str(r[k]).replace("\t", " ") for k in keys) + "\n")

print("=== label summary (downloaded cohort, n=%d) ===" % len(downloaded))
for k in sorted(summary):
    print(f"   {k:<28} {summary[k]}")

# assembly stats from FASTA
stats = {}
for f in sorted(ASM.glob("*.fna.gz")):
    bs = f.name.replace(".fna.gz", "")
    lengths = []
    cur = 0
    with gzip.open(f, "rt") as fh:
        for line in fh:
            if line.startswith(">"):
                if cur:
                    lengths.append(cur)
                cur = 0
            else:
                cur += len(line.strip())
    if cur:
        lengths.append(cur)
    lengths.sort(reverse=True)
    total = sum(lengths)
    half = total / 2
    run = 0
    n50 = 0
    for L in lengths:
        run += L
        if run >= half:
            n50 = L
            break
    stats[bs] = {"contigs": len(lengths), "total_length": total, "n50": n50,
                 "bioproject": sel.get(bs, {}).get("bioproject", ""),
                 "submitter_org": sel.get(bs, {}).get("submitter_org", ""),
                 "assembly": state["downloaded"].get(bs, {}).get("assembly", "")}
qc = Counter()
for bs, s in stats.items():
    ok = 4.0e6 <= s["total_length"] <= 7.0e6 and s["contigs"] <= 2000 and s["n50"] >= 10000
    s["qc"] = "pass" if ok else "fail"
    qc[s["qc"]] += 1
with open(ROOT / "data" / "assembly_stats.tsv", "w") as fh:
    fh.write("biosample\tassembly\tbioproject\tsubmitter_org\tcontigs\ttotal_length\tn50\tqc\n")
    for bs, s in sorted(stats.items()):
        fh.write("\t".join(str(x) for x in [bs, s["assembly"], s["bioproject"], s["submitter_org"],
                                            s["contigs"], s["total_length"], s["n50"], s["qc"]]) + "\n")
(OUT / "labels_summary.json").write_text(json.dumps({"label_counts": dict(summary),
                                                     "qc": dict(qc), "n_downloaded": len(downloaded)}, indent=2))
print(f"assembly stats QC: {dict(qc)}")
fails = [bs for bs, s in stats.items() if s["qc"] == "fail"]
if fails:
    print("QC fail examples:", fails[:8])
print("stage 3c done")
