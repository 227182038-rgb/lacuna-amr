#!/usr/bin/env python3
"""Stage 1c-2: census via NCBI EUtils (db=biosample). Aggregate counts only:
per organism x drug, the number of BioSample records matching the antibiogram
filter. NO MIC values are read or stored at this stage (pre-registration
integrity). Also: discovery dump of one antibiogram BioSample XML to learn the
record structure, and fetch of the recognized-antibiotics table in text format.
Writes results/census.tsv and results/census_method.txt."""
import hashlib
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
CEN = ROOT / "results" / "tables"
CEN.mkdir(parents=True, exist_ok=True)
LED = ROOT / "provenance" / "ledger.tsv"
UA = "lacuna-amr-census/0.1 (aggregate counting only; no label values read)"
BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

ORGANISMS = ["Klebsiella pneumoniae", "Escherichia coli", "Acinetobacter baumannii"]
DRUGS = ["ciprofloxacin", "meropenem", "colistin", "gentamicin", "ceftazidime"]


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def http_get(url, dest, timeout=90):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    Path(dest).write_bytes(data)
    return data


def sha256_file(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def esearch(term, tag, retmax=0):
    q = urllib.parse.urlencode({"db": "biosample", "term": term, "retmax": retmax})
    dest = SNAP / f"census_esearch_{tag}.xml"
    data = http_get(BASE + "esearch.fcgi?" + q, dest)
    root = ET.fromstring(data)
    count = int(root.findtext(".//Count") or 0)
    ids = [e.text for e in root.findall(".//Id")]
    return count, ids, dest


print(f"=== stage1c census {now()} ===")
rows = [("organism", "drug", "n_org_antibiogram", "n_org_drug")]
for org in ORGANISMS:
    base = f'antibiogram[filter] AND "{org}"[Organism]'
    c0, _, _ = esearch(base, re.sub(r"[^A-Za-z]+", "_", org))
    print(f"{org}: total antibiogram records = {c0}")
    time.sleep(0.4)
    for drug in DRUGS:
        c, _, _ = esearch(f"{base} AND {drug}", re.sub(r"[^A-Za-z]+", "_", org) + "_" + drug)
        rows.append((org, drug, c0, c))
        print(f"   {drug:<15} {c}")
        time.sleep(0.4)

with open(CEN / "census.tsv", "w") as fh:
    for r in rows:
        fh.write("\t".join(str(x) for x in r) + "\n")
with open(CEN / "census_method.txt", "w") as fh:
    fh.write(
        "Census method: NCBI EUtils esearch, db=biosample.\n"
        "Base term: antibiogram[filter] AND \"<organism>\"[Organism]\n"
        "Drug term: base AND <drug name> (full-text match within record).\n"
        "Counts are candidate UPPER BOUNDS: they count records mentioning the drug name,\n"
        "not records with a quantitative dilution MIC for that drug.\n"
        "MIC-availability fractions are estimated separately from downloaded records.\n"
        "No MIC values were read or stored before protocol freeze (R6 integrity).\n"
        f"Retrieved {now()}.\n")
with open(LED, "a") as fh:
    fh.write(f"census_biosample\tDONE_{len(rows)-1}_drug_rows\tEUtils esearch\t{now()}\t{sha256_file(CEN / 'census.tsv')}\n")

# structure discovery: fetch 3 full BioSample records with antibiograms for K. pneumoniae
base_kp = 'antibiogram[filter] AND "Klebsiella pneumoniae"[Organism]'
c, ids, _ = esearch(base_kp, "kp_ids_discovery", retmax=3)
print(f"\ndiscovery: fetching {len(ids)} K. pneumoniae antibiogram records: {ids}")
if ids:
    q = urllib.parse.urlencode({"db": "biosample", "id": ",".join(ids)})
    dest = SNAP / "census_kp_sample_records.xml"
    data = http_get(BASE + "efetch.fcgi?" + q, dest)
    text = data.decode("utf-8", "replace")
    print(f"sample efetch bytes={len(data)} sha256={hashlib.sha256(data).hexdigest()[:16]}...")
    # structural summary: element tags + attribute names
    tags = {}
    for m in re.finditer(r"<(\w+)([^>]*)>", text):
        tag, attrs = m.group(1), m.group(2)
        tags.setdefault(tag, set())
        for am in re.finditer(r'(\w+)=', attrs):
            tags[tag].add(am.group(1))
    print("element tags found:")
    for t, at in sorted(tags.items()):
        print(f"   <{t}> attrs: {sorted(at)[:8]}")
    # find antibiogram-looking attributes
    for m in re.finditer(r'<Attribute[^>]*harmonized_name="([^"]*)"[^>]*>', text):
        pass
    harmonized = sorted(set(re.findall(r'harmonized_name="([^"]+)"', text)))
    print("harmonized attribute names present:", harmonized[:40])
    # does the XML contain 'antibiogram' at all?
    print("contains 'antibiogram':", "antibiogram" in text.lower(), "| contains 'Measurement':", "Measurement" in text)

# antibiotics table text link from the docs page
docs = SNAP / "ncbi_antibiogram_docs.html"
if docs.exists():
    m = re.search(r'href="([^"]+)"[^>]*>\s*(?:here|You can also get|Antibiotics table)', docs.read_text(errors="replace"))
    links = re.findall(r'href="([^"]*antibiotic[^"]*)"', docs.read_text(errors="replace"), re.I)
    print("antibiotic-table links on docs page:", links[:5])
    if links:
        url = urllib.parse.urljoin("https://www.ncbi.nlm.nih.gov/biosample/docs/antibiogram", links[0])
        dest = SNAP / "ncbi_antibiotics_table.txt"
        try:
            http_get(url, dest)
            print(f"antibiotics table fetched: {len(dest.read_bytes())} bytes")
            with open(LED, "a") as fh:
                fh.write(f"ncbi_antibiotics_table\tRETRIEVED\t{url}\t{now()}\t{sha256_file(dest)}\n")
        except Exception as e:  # noqa: BLE001
            print(f"antibiotics table fetch ERR {type(e).__name__}")
print("=== census phase A done ===")
