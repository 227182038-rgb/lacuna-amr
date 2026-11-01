#!/usr/bin/env python3
"""Stage 1c-5: eligibility census (field-presence classifier, no MIC values)
for Escherichia coli and Acinetobacter baumannii pools, to apply the DG
organism fallback rule. Saves batches + writes
results/tables/census_eligibility_all_organisms.json."""
import hashlib
import json
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
OUT = ROOT / "results" / "tables"
LED = ROOT / "provenance" / "ledger.tsv"
UA = "lacuna-amr-census5/0.1 (field-presence classification only, no MIC values read)"
BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
DRUGS = ["ciprofloxacin", "meropenem", "colistin", "gentamicin", "ceftazidime"]
DILUTION = {"broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
            "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
            "mic", "dilution"}
AUTOMATED = {"vitek", "phoenix", "microscan"}
GRADIENT = {"e-test", "etest", "gradient"}
TRAY = {"sensititre", "96-well plate", "96 well plate"}
N_SAMPLE = 250


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def http_get(url, dest, timeout=120):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    Path(dest).write_bytes(data)
    return data


def classify(plat, meth, unit):
    p, m = plat.lower(), meth.lower()
    if any(a in p for a in AUTOMATED) or any(a in m for a in AUTOMATED):
        return "automated"
    if p in TRAY or m in TRAY or any(t in p for t in TRAY) or any(t in m for t in TRAY):
        return "tray_bmd"
    if "in-house" in p:
        return "in-house"
    if not p:
        return "platform_missing"
    return f"other:{p[:20]}"


def parse_batches(paths):
    per_drug = {d: Counter() for d in DRUGS}
    n_rec = 0
    for f in paths:
        for bs in ET.fromstring(f.read_bytes()).findall(".//BioSample"):
            n_rec += 1
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
                    ab = g("ab").lower().strip()
                    if ab not in DRUGS:
                        continue
                    platcls = classify(g("plat"), g("method"), g("unit"))
                    unit = g("unit").lower()
                    grad = any(x in g("plat").lower() or x in g("method").lower() for x in GRADIENT)
                    d = ab
                    per_drug[d]["exact_rows"] += 1
                    if unit == "mg/l" and g("meas"):
                        per_drug[d]["quant_mg_L"] += 1
                        per_drug[d][f"plat_{platcls}"] += 1
                        if platcls == "automated" or grad:
                            per_drug[d]["quant_automated_or_gradient"] += 1
                        else:
                            per_drug[d]["quant_primary_rule"] += 1
                        if g("method").lower() in DILUTION:
                            per_drug[d]["quant_explicit_dilution"] += 1
                    elif unit == "mm":
                        per_drug[d]["disk_mm"] += 1
    return per_drug, n_rec


results = {}
for org, tag in [("Escherichia coli", "ecoli"), ("Acinetobacter baumannii", "abau")]:
    q = urllib.parse.urlencode({"db": "biosample", "term": f'antibiogram[filter] AND "{org}"[Organism]', "retmax": 20000})
    dest = SNAP / f"census_{tag}_pool_esearch.xml"
    root = ET.fromstring(http_get(BASE + "esearch.fcgi?" + q, dest))
    pool = [e.text for e in root.findall(".//Id")]
    step = max(1, len(pool) // N_SAMPLE)
    sample = pool[::step][:N_SAMPLE]
    print(f"\n=== {org}: pool={len(pool)}, systematic every {step}th -> n={len(sample)} ===")
    paths = []
    for i in range(0, len(sample), 50):
        q2 = urllib.parse.urlencode({"db": "biosample", "id": ",".join(sample[i:i + 50])})
        dest = SNAP / f"census_{tag}_batch_{i//50}.xml"
        http_get(BASE + "efetch.fcgi?" + q2, dest)
        paths.append(dest)
        time.sleep(0.5)
    per_drug, n_rec = parse_batches(paths)
    print(f"records parsed: {n_rec}")
    est = {}
    for d in DRUGS:
        c = per_drug[d]
        prim = c["quant_primary_rule"]
        est[d] = {"sample_exact_rows": c["exact_rows"], "sample_quant": c["quant_mg_L"],
                  "sample_primary_rule": prim, "est_pool_primary": round(prim / len(sample) * len(pool)),
                  "est_pool_quant_any": round(c["quant_mg_L"] / len(sample) * len(pool))}
        print(f"   {d:<15} rows={c['exact_rows']:>3} quant={c['quant_mg_L']:>3} primary={prim:>3} "
              f"-> est_pool_primary={est[d]['est_pool_primary']:>5} (any-quant {est[d]['est_pool_quant_any']})")
        for k in sorted(c):
            if k.startswith("plat_") and c[k]:
                print(f"        {k:<28} {c[k]}")
    (ROOT / "data" / f"{tag}_antibiogram_pool_uids.tsv").write_text("uid\n" + "\n".join(pool) + "\n")
    results[org] = {"pool_size": len(pool), "sample_n": len(sample), "estimates": est}

doc = {"retrieved_utc": now(), "note": "field-presence classification only; no MIC values read before protocol freeze",
       "organisms": results}
(OUT / "census_eligibility_all_organisms.json").write_text(json.dumps(doc, indent=2))
with open(LED, "a") as fh:
    fh.write(f"census_eligibility_orgs\tDONE_ecoli_abau\tEUtils\t{now()}\t{hashlib.sha256((OUT / 'census_eligibility_all_organisms.json').read_bytes()).hexdigest()}\n")
print("\nwrote results/tables/census_eligibility_all_organisms.json")
