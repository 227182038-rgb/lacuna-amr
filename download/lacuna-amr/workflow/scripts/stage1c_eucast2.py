#!/usr/bin/env python3
"""Stage 1c-1b: EUCAST v16.1 structure discovery pass 2 - dump species labels in
column A of the Enterobacterales sheet, find Klebsiella rows, dump generic
Enterobacterales rows for the study drugs, capture headers and notes."""
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[2]
XLSX = ROOT / "data" / "external" / "eucast" / "EUCAST_v16.1_Breakpoint_Tables.xlsx"
DRUGS = ["ciprofloxacin", "meropenem", "colistin", "gentamicin", "ceftazidime"]

wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
ws = wb["Enterobacterales"]

colA = []
rows_all = []
for row in ws.iter_rows():
    vals = [(c.coordinate, str(c.value)) for c in row if c.value is not None]
    rows_all.append(vals)
    if vals:
        first = vals[0][1]
        colA.append(first)

print("=== distinct column-A values (species groups) in 'Enterobacterales' sheet ===")
seen = []
for v in colA:
    if v not in seen:
        seen.append(v)
print(seen)

print("\n=== rows whose column A mentions Klebsiella (any spelling) ===")
kleb = [vals for vals in rows_all if vals and re.search(r"kleb", str(vals[0][1]), re.I)]
print(f"{len(kleb)} rows")
for vals in kleb[:25]:
    print("   " + " || ".join(f"{a}={b[:38]}" for a, b in vals))

print("\n=== rows for study drugs, generic species (col A == Enterobacterales or similar) ===")
for vals in rows_all:
    if not vals:
        continue
    spec = str(vals[0][1])
    if any(d.lower() in str(vals[1][1]).lower() for d in DRUGS if len(vals) > 1) and \
       re.search(r"enterobacter", spec, re.I):
        print("   " + " || ".join(f"{a}={b[:38]}" for a, b in vals))

print("\n=== header rows (first 14 rows of sheet) ===")
for i, vals in enumerate(rows_all[:14]):
    if vals:
        print(f"  R{i+1}: " + " | ".join(f"{a}={b[:26]}" for a, b in vals))

print("\n=== Content sheet (first 30 rows) ===")
ws2 = wb["Content"]
for i, row in enumerate(ws2.iter_rows(max_row=30)):
    vals = [(c.coordinate, str(c.value)) for c in row if c.value is not None]
    if vals:
        print(f"  R{i+1}: " + " | ".join(f"{a}={b[:60]}" for a, b in vals))

print("\n=== copyright scan across sheets ===")
for wsx in wb.worksheets:
    for row in wsx.iter_rows():
        for c in row:
            if c.value and re.search(r"copyright|resale|reproduce", str(c.value), re.I):
                print(f"  [{wsx.title}] {c.coordinate}: {str(c.value)[:200]}")

# website reuse statement
page = ROOT / "provenance" / "snapshots" / "eucast_breakpoints_page.html"
if page.exists():
    import html as H
    txt = H.unescape(re.sub(r"<[^>]+>", " ", page.read_text(errors="replace")))
    txt = " ".join(txt.split())
    for m in re.finditer(r"[^.]{0,120}(?:copyright|reproduce|resale|reference the source)[^.]{0,140}", txt, re.I):
        print("  [webpage]", m.group(0).strip()[:240])
