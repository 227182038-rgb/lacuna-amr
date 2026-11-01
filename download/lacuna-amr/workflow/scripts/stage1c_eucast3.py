#!/usr/bin/env python3
"""Stage 1c-1c: FINAL EUCAST v16.1 extraction for K. pneumoniae study drugs
from the generic Enterobacterales rows, with exact source-cell coordinates,
plus an independent second extraction (pandas) as cross-check. Writes
results/tables/breakpoints_eucast_v16_1.json and .tsv and appends to ledger."""
import hashlib
import json
import time
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[2]
XLSX = ROOT / "data" / "external" / "eucast" / "EUCAST_v16.1_Breakpoint_Tables.xlsx"
OUT = ROOT / "results" / "tables"
LED = ROOT / "provenance" / "ledger.tsv"
TS = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

# exact row labels in the Enterobacterales sheet (discovered in pass 2)
TARGETS = {
    "ciprofloxacin": "Ciprofloxacin (indications other than meningitis)",
    "meropenem": "Meropenem (indications other than meningitis)",
    "colistin": "Colistin2",
    "gentamicin": "Gentamicin (systemic infections)",
    "ceftazidime": "Ceftazidime",
}

wb = openpyxl.load_workbook(XLSX, read_only=False, data_only=True)
ws = wb["Enterobacterales"]

# locate the header row for MIC breakpoints (B col 'S <=', C col 'R >')
header = {}
for row in ws.iter_rows(min_row=1, max_row=15):
    for c in row:
        if c.value is not None:
            v = str(c.value).strip()
            if v in ("S ≤", "S <=") or v.startswith("S ≤"):
                header["S"] = (c.column_letter, c.row)
            if v in ("R >", "R >") or v.startswith("R >"):
                header["R"] = (c.column_letter, c.row)
print("header cells:", header)

bp = {}
print("=== EUCAST v16.1 Enterobacterales rows for study drugs (K. pneumoniae uses generic rows) ===")
for drug, label in TARGETS.items():
    found = False
    for row in ws.iter_rows(min_col=1, max_col=9):
        a = row[0]
        if a.value is not None and str(a.value).strip() == label:
            s_cell = ws[f"{header['S'][0]}{a.row}"]
            r_cell = ws[f"{header['R'][0]}{a.row}"]
            notes_cell = ws[f"I{a.row}"]
            bp[drug] = {
                "row_label": label,
                "source_cells": {
                    "label": f"Enterobacterales!A{a.row}",
                    "S_le": f"Enterobacterales!{header['S'][0]}{a.row}",
                    "R_gt": f"Enterobacterales!{header['R'][0]}{a.row}",
                    "notes": f"Enterobacterales!I{a.row}",
                },
                "S_le_mg_L": s_cell.value,
                "R_gt_mg_L": r_cell.value,
                "notes": (str(notes_cell.value) if notes_cell.value is not None else ""),
            }
            print(f"{drug:<14} A{a.row}={label[:45]:<47} S≤={s_cell.value!r:8} R>={r_cell.value!r:8} notes={str(notes_cell.value)[:120]!r}")
            found = True
            break
    if not found:
        print(f"{drug:<14} ROW NOT FOUND for label {label!r}")
        bp[drug] = {"row_label": label, "error": "ROW NOT FOUND"}

# version + citation from Content sheet
content = wb["Content"]
ver_cell = content["A9"]
cite_cell = content["A11"]
title_cell = content["A8"]
print(f"\nversion cell A9: {ver_cell.value!r}")
print(f"citation cell A11: {cite_cell.value!r}")
print(f"title cell A8: {title_cell.value!r}")

# colistin notes full text
if bp.get("colistin", {}).get("notes"):
    print(f"\ncolistin notes (full): {bp['colistin']['notes']}")

# independent cross-check with pandas
import pandas as pd
df = pd.read_excel(XLSX, sheet_name="Enterobacterales", header=None)
mismatch = []
for drug, label in TARGETS.items():
    mask = df[0].astype(str).str.strip() == label
    if mask.any():
        i = df.index[mask][0]
        s2 = df.iloc[i, 1]  # col B
        r2 = df.iloc[i, 2]  # col C
        s1 = bp[drug].get("S_le_mg_L")
        r1 = bp[drug].get("R_gt_mg_L")
        ok = (str(s1) == str(s2)) and (str(r1) == str(r2))
        print(f"cross-check {drug}: openpyxl=({s1},{r1}) pandas=({s2},{r2}) match={ok}")
        if not ok:
            mismatch.append(drug)

doc = {
    "source_file": "data/external/eucast/EUCAST_v16.1_Breakpoint_Tables.xlsx",
    "source_sha256": hashlib.sha256(XLSX.read_bytes()).hexdigest(),
    "source_url": "https://www.eucast.org/fileadmin/eucast/pdf/breakpoints/v_16.1_Breakpoint_Tables.xlsx",
    "version": str(ver_cell.value),
    "document_title": str(title_cell.value),
    "citation_statement": str(cite_cell.value),
    "organism_scope": "Enterobacterales (generic rows apply to K. pneumoniae; no separate K. pneumoniae row for these drugs)",
    "breakpoints": bp,
    "cross_check": {"method": "pandas.read_excel second extraction", "mismatches": mismatch},
    "retrieved_utc": TS,
}
(OUT / "breakpoints_eucast_v16_1.json").write_text(json.dumps(doc, indent=2, ensure_ascii=False))
with open(OUT / "breakpoints_eucast_v16_1.tsv", "w") as fh:
    fh.write("drug\trow_label\tS_le_mg_L\tR_gt_mg_L\tsource_cells\tnotes\n")
    for drug, d in bp.items():
        fh.write(f"{drug}\t{d.get('row_label','')}\t{d.get('S_le_mg_L','')}\t{d.get('R_gt_mg_L','')}\t{json.dumps(d.get('source_cells',{}))}\t{str(d.get('notes',''))[:400]}\n")
with open(LED, "a") as fh:
    fh.write(f"eucast_breakpoints_extracted\tv16.1_{len(bp)}_drugs\t{XLSX}\t{TS}\t{hashlib.sha256((OUT / 'breakpoints_eucast_v16_1.json').read_bytes()).hexdigest()}\n")
print(f"\nwrote {OUT / 'breakpoints_eucast_v16_1.json'}; cross-check mismatches: {mismatch}")
