#!/usr/bin/env python3
"""Stage 1c-4: re-analysis of the saved census sample batches (no refetch).
Classifies each study-drug AST row by unit, platform and method evidence, and
estimates eligibility under two candidate primary-cohort rules. Field-presence
and categorical metadata only; no MIC values are read (R6-safe)."""
import json
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
OUT = ROOT / "results" / "tables"
DRUGS = ["ciprofloxacin", "meropenem", "colistin", "gentamicin", "ceftazidime"]
DILUTION = {"broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
            "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
            "mic", "dilution"}
AUTOMATED = {"vitek", "phoenix", "microscan"}
GRADIENT = {"e-test", "etest", "gradient"}
TRAY = {"sensititre", "96-well plate", "96 well plate"}
POOL_N = 2518
N = 250


def classify(plat, meth, unit):
    p, m = plat.lower(), meth.lower()
    if p in AUTOMATED or any(a in p for a in AUTOMATED) or any(a in m for a in AUTOMATED):
        platcls = "automated"
    elif p in TRAY or m in TRAY or any(t in p for t in TRAY) or any(t in m for t in TRAY):
        platcls = "tray_bmd"
    elif p == "in-house" or "in-house" in p:
        platcls = "in-house"
    elif not p and not m:
        platcls = "both_missing"
    elif not p:
        platcls = "platform_missing_method_given"
    else:
        platcls = f"other:{p[:20]}"
    if unit.lower() == "mg/l":
        u = "mg/L"
    elif unit.lower() == "mm":
        u = "mm"
    else:
        u = "other/missing"
    grad = any(g in p or g in m for g in GRADIENT)
    return platcls, u, grad


per_drug = {d: Counter() for d in DRUGS}
records = 0
for f in sorted(SNAP.glob("census_kp_batch_*.xml")):
    for bs in ET.fromstring(f.read_bytes()).findall(".//BioSample"):
        records += 1
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
                elif "testing standard" in h:
                    idx["std"] = j
                elif "platform" in h:
                    idx["plat"] = j
            for row in table.findall(".//Row"):
                cells = [ "".join(c.itertext()).strip() for c in row.findall("./Cell") ]
                def g(k):
                    j = idx.get(k)
                    return cells[j] if j is not None and j < len(cells) else ""
                ab = g("ab").lower().strip()
                if ab not in DRUGS:
                    continue
                platcls, u, grad = classify(g("plat"), g("method"), g("unit"))
                d = ab
                per_drug[d]["exact_rows"] += 1
                per_drug[d][f"unit_{u}"] += 1
                per_drug[d][f"plat_{platcls}"] += 1
                if grad:
                    per_drug[d]["gradient"] += 1
                quant = bool(g("meas")) and u == "mg/L"
                if quant:
                    per_drug[d]["quant_mg_L"] += 1
                    if platcls == "automated" or grad:
                        per_drug[d]["quant_automated_or_gradient"] += 1
                    elif platcls == "tray_bmd" or platcls == "in-house":
                        per_drug[d]["quant_tray_or_inhouse"] += 1
                    elif platcls == "both_missing":
                        per_drug[d]["quant_method_unverifiable"] += 1
                    else:
                        per_drug[d][f"quant_other"] += 1
                    if g("method").lower() in DILUTION:
                        per_drug[d]["quant_explicit_dilution_method"] += 1
                if g("phen").lower() in ("resistant", "susceptible", "intermediate", "nonsusceptible",
                                         "susceptible-dose dependent", "not defined", "sensitive"):
                    per_drug[d]["has_valid_phenotype"] += 1

print(f"records parsed: {records}")
print("\ndrug\tstat\tcount (sample n=250, pool=2518)")
for d in DRUGS:
    c = per_drug[d]
    print(f"\n{d}:")
    for k in sorted(c):
        print(f"   {k:<36} {c[k]:>5}   est_pool={round(c[k]/N*POOL_N):>5}")
    ruleA = c["quant_tray_or_inhouse"] + c.get("quant_explicit_dilution_method", 0)
    ruleB = c["quant_mg_L"] - c["quant_automated_or_gradient"]
    print(f"   >>> RULE-A (explicit dilution/tray evidence) sample={ruleA} est_pool={round(ruleA/N*POOL_N)}")
    print(f"   >>> RULE-B (any non-automated non-gradient quant MIC) sample={ruleB} est_pool={round(ruleB/N*POOL_N)}")

doc = {d: dict(per_drug[d]) for d in DRUGS}
doc["_meta"] = {"records": records, "sample_n": N, "pool_n": POOL_N,
                "note": "presence/categorical classification only; no MIC values read"}
(OUT / "census_eligibility_classified.json").write_text(json.dumps(doc, indent=2))
print("\nwrote results/tables/census_eligibility_classified.json")
