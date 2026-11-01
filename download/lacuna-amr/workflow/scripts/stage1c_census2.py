#!/usr/bin/env python3
"""Stage 1c-2: eligibility census on a sample of real K. pneumoniae antibiogram
BioSample records. PRE-REGISTRATION SAFE: reads only the PRESENCE of fields
(antibiotic name, phenotype, measurement sign/value/unit, method, standard),
never MIC values. Writes results/tables/census_eligibility.{tsv,json}."""
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
UA = "lacuna-amr-census2/0.1 (field-presence counting only, no MIC values read)"
BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
DRUGS = ["ciprofloxacin", "meropenem", "colistin", "gentamicin", "ceftazidime"]
DILUTION = {"broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
            "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
            "mic", "dilution"}
# automated AST systems (excluded from primary analysis per brief 4.3; sensitivity analysis only)
AUTOMATED = {"vitek", "vitek 2", "phoenix", "microscan", "sensititre"}
N_SAMPLE = 250

def classify_platform(p):
    p = p.lower()
    for a in AUTOMATED:
        if a in p:
            return a
    return p or "missing"


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def http_get(url, dest, timeout=120):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    Path(dest).write_bytes(data)
    return data


# 1) full pool of K. pneumoniae antibiogram UIDs
q = urllib.parse.urlencode({"db": "biosample", "term": 'antibiogram[filter] AND "Klebsiella pneumoniae"[Organism]', "retmax": 3000})
dest = SNAP / "census_kp_pool_esearch.xml"
root = ET.fromstring(http_get(BASE + "esearch.fcgi?" + q, dest))
pool = [e.text for e in root.findall(".//Id")]
print(f"pool size: {len(pool)}")
(ROOT / "data" / "kp_antibiagram_pool_uids.tsv").write_text("uid\n" + "\n".join(pool) + "\n")

# systematic sample across the esearch-ordered pool (less order-dependent than the first N)
step = max(1, len(pool) // N_SAMPLE)
sample = pool[::step][:N_SAMPLE]
print(f"systematic sample: every {step}th uid -> n={len(sample)}")
agg = {d: Counter() for d in DRUGS}
rec_stats = Counter()
platform_dist = Counter()
standard_dist = Counter()
method_dist = Counter()

for i in range(0, len(sample), 50):
    ids = sample[i:i + 50]
    q = urllib.parse.urlencode({"db": "biosample", "id": ",".join(ids)})
    dest = SNAP / f"census_kp_batch_{i//50}.xml"
    data = http_get(BASE + "efetch.fcgi?" + q, dest)
    for bs in ET.fromstring(data).findall(".//BioSample"):
        rec_stats["records"] += 1
        # metadata presence
        has_date = bs.find(".//Attribute[@harmonized_name='collection_date']") is not None
        has_geo = bs.find(".//Attribute[@harmonized_name='geo_loc_name']") is not None
        bp = any("BioProject" in (l.get("target") or "") for l in bs.findall(".//Link"))
        rec_stats["with_collection_date"] += has_date
        rec_stats["with_geo_loc"] += has_geo
        rec_stats["with_bioproject_link"] += bp
        for table in bs.findall(".//Table"):
            if "antibiogram" not in (table.get("class") or "").lower():
                continue
            header = [ "".join(c.itertext()).strip().lower() for c in table.findall("./Header/Cell") ]
            idx = {}
            for j, h in enumerate(header):
                if "antibiotic" in h:
                    idx["ab"] = j
                elif "resistance phenotype" in h:
                    idx["phen"] = j
                elif "measurement sign" in h:
                    idx["sign"] = j
                elif h == "measurement" or h.startswith("measurement") and "sign" not in h and "unit" not in h:
                    idx["meas"] = j
                elif "unit" in h:
                    idx["unit"] = j
                elif "typing method" in h:
                    idx["method"] = j
                elif "testing standard" in h:
                    idx["std"] = j
                elif "platform" in h:
                    idx["plat"] = j
                elif "vendor" in h:
                    idx["vend"] = j
            for row in table.findall(".//Row"):
                cells = [ "".join(c.itertext()).strip() for c in row.findall("./Cell") ]
                def g(k):
                    j = idx.get(k)
                    return cells[j] if j is not None and j < len(cells) else ""
                ab = g("ab").lower()
                m = g("method").lower()
                plat = classify_platform(g("plat"))
                platform_dist[plat] += 1
                standard_dist[g("std") or "missing"] += 1
                method_dist[m or "missing"] += 1
                for d in DRUGS:
                    if ab == d or ab.startswith(d):
                        agg[d]["rows"] += 1
                        if g("meas"):
                            agg[d]["has_measurement"] += 1
                            if g("unit").lower() in ("mg/l", "µg/ml", "ug/ml", "microgram/milliliter"):
                                agg[d]["mg_per_L"] += 1
                            if m in DILUTION:
                                agg[d]["dilution"] += 1
                                if plat in AUTOMATED:
                                    agg[d]["dilution_automated_platform"] += 1
                                else:
                                    agg[d]["dilution_nonautomated"] += 1
                                if g("std"):
                                    agg[d]["dilution_with_standard"] += 1
                            elif "disk" in m:
                                agg[d]["disk"] += 1
                            elif not m:
                                agg[d]["no_method"] += 1
                            else:
                                agg[d]["other_method"] += 1
                            if g("phen"):
                                agg[d]["has_phenotype"] += 1
    time.sleep(0.5)

# count records with any antibiogram table (second pass on saved batches)
n_with_table = 0
for i in range(0, len(sample), 50):
    f = SNAP / f"census_kp_batch_{i//50}.xml"
    for bs in ET.fromstring(f.read_bytes()).findall(".//BioSample"):
        if any("antibiogram" in (t.get("class") or "").lower() for t in bs.findall(".//Table")):
            n_with_table += 1

print("\n=== sample of", len(sample), "K. pneumoniae antibiogram BioSamples ===")
print(f"records with an antibiogram table: {n_with_table}")
print(f"with collection_date: {rec_stats['with_collection_date']} | with geo_loc: {rec_stats['with_geo_loc']} | with BioProject link: {rec_stats['with_bioproject_link']}")
print("\ndrug\tpresence-of-field counts (sample): rows / has_meas / mg/L / dilution / disk / no_method / other / phen")
for d in DRUGS:
    c = agg[d]
    print(f"{d}\t{c['rows']}\t{c['has_measurement']}\t{c['mg_per_L']}\t{c['dilution']}\t{c['disk']}\t{c['no_method']}\t{c['other_method']}\t{c['has_phenotype']}")

# extrapolated eligibility (quant dilution mg/L measurement per drug)
pool_n = len(pool)
est = {}
for d in DRUGS:
    frac = agg[d]["dilution"] / len(sample)
    est[d] = {"sample_n_dilution": agg[d]["dilution"], "fraction": round(frac, 4),
              "estimated_pool": round(frac * pool_n)}
print("\nextrapolated to full pool (n=%d):" % pool_n)
print("two estimates per drug: any-dilution (incl. automated platforms) and non-automated dilution")
est2 = {}
for d in DRUGS:
    frac_auto = agg[d]["dilution"] / len(sample)
    frac_na = agg[d]["dilution_nonautomated"] / len(sample)
    est2[d] = {"any_dilution": round(frac_auto * pool_n), "nonautomated_dilution": round(frac_na * pool_n)}
    print(f"   {d}: any={est2[d]['any_dilution']} nonauto={est2[d]['nonautomated_dilution']} "
          f"(sample {agg[d]['dilution']}/{agg[d]['dilution_nonautomated']} of {len(sample)})")
print("\nplatform distribution (all drug rows):", dict(platform_dist.most_common(8)))
print("standard distribution (all drug rows):", dict(standard_dist.most_common(8)))
print("method distribution (all drug rows):", dict(method_dist.most_common(8)))

doc = {
    "sample_size": len(sample), "pool_size": pool_n, "sampling": f"systematic every {step}th uid",
    "records_with_antibiogram_table": n_with_table,
    "metadata_presence": {k: v for k, v in rec_stats.items() if k.startswith("with")},
    "per_drug_counts": {d: dict(agg[d]) for d in DRUGS},
    "extrapolated_eligible_any_dilution": est,
    "extrapolated_eligible_by_platform": est2,
    "platform_distribution": dict(platform_dist),
    "standard_distribution": dict(standard_dist),
    "method_distribution": dict(method_dist),
    "note": "field-presence counting only; no MIC values were read, parsed or stored before protocol freeze",
    "retrieved_utc": now(),
}
(OUT / "census_eligibility.json").write_text(json.dumps(doc, indent=2))
with open(OUT / "census_eligibility.tsv", "w") as fh:
    fh.write("drug\tsample_rows\thas_measurement\tmg_per_L\tdilution\tdisk\tno_method\tother\thas_phenotype\test_pool_eligible\n")
    for d in DRUGS:
        c = agg[d]
        fh.write(f"{d}\t{c['rows']}\t{c['has_measurement']}\t{c['mg_per_L']}\t{c['dilution']}\t{c['disk']}\t{c['no_method']}\t{c['other_method']}\t{c['has_phenotype']}\t{est[d]['estimated_pool']}\n")
with open(LED, "a") as fh:
    fh.write(f"census_eligibility\tDONE_sample_{len(sample)}\tEUtils efetch batches\t{now()}\t{hashlib.sha256((OUT / 'census_eligibility.json').read_bytes()).hexdigest()}\n")
print("wrote results/tables/census_eligibility.{json,tsv}")
