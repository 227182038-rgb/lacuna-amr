#!/usr/bin/env python3
"""Stage 1c-1: extract current EUCAST breakpoints for the study drugs from the
official v16.1 xlsx (downloaded, hashed). Discovery pass prints structure;
extraction pass writes results/tables/breakpoints_eucast_v16_1.json with exact
source cell coordinates. Also captures the colistin method note and any
copyright/reuse statement inside the file."""
import hashlib
import json
import time
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[2]
XLSX = ROOT / "data" / "external" / "eucast" / "EUCAST_v16.1_Breakpoint_Tables.xlsx"
OUT = ROOT / "results" / "tables"
OUT.mkdir(parents=True, exist_ok=True)
LED = ROOT / "provenance" / "ledger.tsv"
DRUGS = ["ciprofloxacin", "meropenem", "colistin", "gentamicin", "ceftazidime"]
TS = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

sha = hashlib.sha256(XLSX.read_bytes()).hexdigest()
print(f"EUCAST v16.1 xlsx sha256={sha}")
wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
print("sheets:", wb.sheetnames)

# discovery: find sheets containing 'Klebsiella pneumoniae' and dump matching rows
hits = {}
notes = []
for ws in wb.worksheets:
    for row in ws.iter_rows():
        vals = [(c.coordinate, str(c.value)) for c in row if c.value is not None]
        if not vals:
            continue
        joined = " | ".join(v for _, v in vals)
        if "Klebsiella pneumoniae" in joined and any(d.lower() in joined.lower() for d in DRUGS):
            hits.setdefault(ws.title, []).append(vals)
        low = joined.lower()
        if ("colistin" in low and "broth" in low) or "copyright" in low or "resale" in low or "reuse" in low:
            notes.append((ws.title, vals))

print("\n=== Klebsiella pneumoniae x study-drug rows ===")
for sheet, rows in hits.items():
    print(f"--- sheet '{sheet}': {len(rows)} matching rows")
    for vals in rows:
        print("   " + " || ".join(f"{coord}={v[:40]}" for coord, v in vals))

print("\n=== notes (colistin+broth / copyright / reuse) ===")
for sheet, vals in notes[:12]:
    print(f"--- sheet '{sheet}':")
    for coord, v in vals:
        print(f"   {coord}={v[:180]}")

# header discovery: print first 12 rows of the first sheet that contains the hits
for sheet, rows in hits.items():
    ws = wb[sheet]
    print(f"\n=== header rows of sheet '{sheet}' ===")
    for i, row in enumerate(ws.iter_rows(max_row=12)):
        vals = [(c.coordinate, str(c.value)[:28]) for c in row if c.value is not None]
        if vals:
            print(f"  R{i+1}: " + " | ".join(f"{a}={b}" for a, b in vals))
    break

with open(LED, "a") as fh:
    fh.write(f"eucast_v16_1_extracted\tDISCOVERY_PASS_DONE\t{XLSX}\t{TS}\t{sha}\n")
print("\ndiscovery pass complete; extraction pass next")
