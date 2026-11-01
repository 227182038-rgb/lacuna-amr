#!/usr/bin/env python3
"""Stage 1a: verify seed references from the project brief against live
Crossref, doi.org and PubMed. Raw responses are snapshotted + hashed in
provenance/ledger.tsv; results go to provenance/reference_verification.tsv.
'expected' values are quoted from the project brief (leads, not facts) and are
used only as comparison targets."""
import hashlib
import json
import subprocess
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
SNAP.mkdir(parents=True, exist_ok=True)
LED = ROOT / "provenance" / "ledger.tsv"
TSV = ROOT / "provenance" / "reference_verification.tsv"
UA = "lacuna-amr-stage1a/0.1 (provenance-capturing research script)"

SEED = [
    # ref_id, doi, expected_first_author_or_None, expected_year, expected_venue, title_must_contain_or_None
    ("R01", "10.1038/s41598-021-91456-0", "Feldgarden", 2021, "Scientific Reports", "AMRFinderPlus"),
    ("R02", "10.1371/journal.pbio.3003539", "Yu", 2025, "PLoS Biology", None),
    ("R03", "10.3389/fcimb.2021.610348", None, 2021, "Frontiers in Cellular and Infection Microbiology", "Learning From Limited Data"),
    ("R04", "10.64898/2026.06.28.734076", None, 2026, "bioRxiv", None),
    ("R06", "10.1128/mbio.03431-25", "Inda-Diaz", 2026, "mBio", None),
    ("R07", "10.3389/fmicb.2022.997769", "Pei", 2022, "Frontiers in Microbiology", None),
    ("R08", "10.3389/fmicb.2023.1242693", "Cornacchia", 2023, "Frontiers in Microbiology", None),
    ("R09", "10.1016/j.cmi.2019.03.007", "Cusack", 2019, "Clinical Microbiology and Infection", None),
    ("R10", "10.1038/s41592-021-01205-4", "Walsh", 2021, "Nature Methods", "DOME"),
    ("R11", "10.1136/bmj-2023-078378", "Collins", 2024, "BMJ", "TRIPOD"),
    ("R12", "10.1093/bioinformatics/bty539", "Lees", 2018, "Bioinformatics", "pyseer"),
    ("R13", "10.1371/journal.pgen.1007758", "Jaillard", 2018, "PLOS Genetics", None),
]


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def ledger(key: str, value: str, source: str, snapshot: Path):
    sha = sha256_file(snapshot) if snapshot.exists() else "EMPTY"
    with open(LED, "a") as fh:
        fh.write(f"{key}\t{value}\t{source}\t{now()}\t{sha}\n")


def http_get(url: str, dest: Path) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    dest.write_bytes(data)
    return data


def doi_org_status(doi: str) -> str:
    r = subprocess.run(
        ["curl", "-sI", "-o", "/dev/null", "-w", "%{http_code}", "-m", "30", f"https://doi.org/{doi}"],
        capture_output=True, text=True)
    return r.stdout.strip()


def pubmed_pmid(doi: str, ref_id: str) -> tuple[str, Path]:
    q = urllib.parse.urlencode({"db": "pubmed", "term": f'"{doi}"[DOI]'})
    url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" + q
    dest = SNAP / f"stage1a_pubmed_{ref_id}.xml"
    try:
        http_get(url, dest)
        root = ET.fromstring(dest.read_text())
        count = root.findtext(".//Count") or "0"
        ids = [e.text for e in root.findall(".//Id")]
        return (f"{count}:{','.join(ids)}" if ids else "0:", dest)
    except Exception as e:  # noqa: BLE001
        return f"ERR:{type(e).__name__}", dest


rows = []
print(f"=== stage1a reference verification {now()} ===")
for ref_id, doi, exp_auth, exp_year, exp_venue, title_needle in SEED:
    rec = dict(ref_id=ref_id, doi=doi)
    # Crossref
    cr_dest = SNAP / f"stage1a_crossref_{ref_id}.json"
    cr_ok, cr_title, cr_auth, cr_year, cr_type, cr_venue = False, "", "", "", "", ""
    try:
        url = "https://api.crossref.org/works/" + urllib.parse.quote(doi, safe="")
        http_get(url, cr_dest)
        msg = json.loads(cr_dest.read_text())["message"]
        cr_ok = True
        cr_title = (msg.get("title") or [""])[0]
        cr_auth = ((msg.get("author") or [{}])[0].get("family", ""))
        cr_year = str((msg.get("issued", {}).get("date-parts", [[None]])[0][0]) or "")
        cr_type = msg.get("type", "")
        cr_venue = (msg.get("container-title") or [""])[0]
    except Exception as e:  # noqa: BLE001
        cr_ok = False
        cr_dest.write_text(f"FETCH_ERROR {type(e).__name__}: {e}")
    time.sleep(0.3)
    pmid, pm_dest = pubmed_pmid(doi, ref_id)
    time.sleep(0.4)
    dstat = doi_org_status(doi)
    # verdict
    checks = []
    if cr_ok:
        if exp_auth:
            checks.append(("author", exp_auth.lower() in cr_auth.lower()))
        checks.append(("year", str(exp_year) == cr_year))
        if title_needle:
            checks.append(("title", title_needle.lower() in cr_title.lower()))
    verdict = "UNVERIFIED"
    if cr_ok and dstat in ("200", "302", "303", "307", "308") and all(c for _, c in checks):
        verdict = "VERIFIED"
    elif cr_ok:
        verdict = "MISMATCH"
    rec.update(doi_resolves=dstat, crossref_ok=cr_ok, crossref_title=cr_title[:110],
               crossref_first_author=cr_auth, crossref_year=cr_year, crossref_type=cr_type,
               crossref_venue=cr_venue, pubmed=pmid, verdict=verdict)
    rows.append(rec)
    ledger(f"ref_{ref_id}", f"{verdict} doi={doi} pmid={pmid}", f"https://api.crossref.org/works/{doi}", cr_dest)
    print(f"{ref_id} {verdict:10} doi:{dstat} cr:{'OK' if cr_ok else 'NO':2} "
          f"| {cr_auth:<14} {cr_year:<4} | {cr_title[:60]} | pmid={pmid[:14]}")

cols = ["ref_id", "doi", "doi_resolves", "crossref_ok", "crossref_title", "crossref_first_author",
        "crossref_year", "crossref_type", "crossref_venue", "pubmed", "verdict"]
with open(TSV, "w") as fh:
    fh.write("\t".join(cols) + "\n")
    for r in rows:
        fh.write("\t".join(str(r.get(c, "")) for c in cols) + "\n")
print(f"--- wrote {TSV.relative_to(ROOT)} ({len(rows)} refs)")
