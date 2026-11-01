#!/usr/bin/env python3
"""Derive the flat raw AST table (documented CLI schema) from the research
labels table results/tables/ast_labels_all.tsv, by re-expanding its encoded
primary-rule rows ("<sign><value>[method|platform|standard|phenotype]; ...").
Every emitted row is a real captured record from the project run (no synthetic
values); derivation is deterministic and re-runnable.

Output: data/ast_table.tsv (biosample, drug, sign, measurement, unit, method,
platform, standard, submitter_phenotype, year, country, bioproject).
"""
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "results" / "tables" / "ast_labels_all.tsv"
OUT = ROOT / "data" / "ast_table.tsv"

ROW_RE = re.compile(r"^(==|>=|<=|>|<|=)?([0-9.]+)\[([^|\]]*)\|([^|\]]*)\|([^|\]]*)\|([^\]]*)\]$")

n_rows = 0
with open(SRC, newline="") as fh, open(OUT, "w", newline="") as out:
    rdr = csv.DictReader(fh, delimiter="\t")
    w = csv.writer(out, delimiter="\t", lineterminator="\n")
    w.writerow(["biosample", "drug", "sign", "measurement", "unit", "method",
                "platform", "standard", "submitter_phenotype", "year", "country",
                "bioproject"])
    for r in rdr:
        prim = r.get("primary_rows", "")
        if not prim:
            continue
        for chunk in prim.split("; "):
            m = ROW_RE.match(chunk.strip())
            if not m:
                continue
            sign, val, method, platform, std, phen = m.groups()
            w.writerow([r["biosample"], r["drug"], sign or "==", val, "mg/L",
                        method, platform, std, phen, r.get("year", ""),
                        r.get("country", ""), r.get("bioproject", "")])
            n_rows += 1
print(f"derived {n_rows} primary-rule AST rows -> {OUT}")
