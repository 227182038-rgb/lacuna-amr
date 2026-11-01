#!/usr/bin/env python3
"""Stage 1a part 2: accent-normalised recheck of R06; retrieve NeurIPS 2026
listing page; find the FAIR-for-research-software citation; run prior-art
searches for conformal prediction in AMR and lineage-shift coverage."""
import hashlib
import json
import time
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
SRCH = ROOT / "provenance" / "prior_art_searches"
SRCH.mkdir(parents=True, exist_ok=True)
LED = ROOT / "provenance" / "ledger.tsv"
UA = "lacuna-amr-stage1a/0.1 (provenance-capturing research script)"


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def ledger(key, value, source, snapshot: Path):
    sha = sha256_file(snapshot) if snapshot.exists() else "EMPTY"
    with open(LED, "a") as fh:
        fh.write(f"{key}\t{value}\t{source}\t{now()}\t{sha}\n")


def http_get(url, dest, headers=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    dest.write_bytes(data)
    return data


def fold(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if not unicodedata.combining(c)).lower()


print(f"=== stage1a part2 {now()} ===")

# 1) R06 accent-folded recheck
r06 = json.loads((SNAP / "stage1a_crossref_R06.json").read_text())["message"]
ok = fold("Inda-Diaz") in fold((r06.get("author") or [{}])[0].get("family", ""))
ledger("ref_R06_recheck", f"VERIFIED accent-folded author match={ok} venue={(r06.get('container-title') or [''])[0]}",
       "https://api.crossref.org/works/10.1128/mbio.03431-25", SNAP / "stage1a_crossref_R06.json")
print(f"R06 recheck: accent-folded author match = {ok}; venue = {(r06.get('container-title') or [''])[0]}; "
      f"type = {r06.get('type')}; year = {(r06.get('issued', {}).get('date-parts', [[None]])[0][0])}")

# R04 type check (preprint or not)
r04 = json.loads((SNAP / "stage1a_crossref_R04.json").read_text())["message"]
print(f"R04 type = {r04.get('type')}; venue = {(r04.get('container-title') or [''])[0]}; "
      f"first author = {(r04.get('author') or [{}])[0].get('family','')}")
ledger("ref_R04_type", f"type={r04.get('type')} venue={(r04.get('container-title') or [''])[0]}",
       "https://api.crossref.org/works/10.64898/2026.06.28.734076", SNAP / "stage1a_crossref_R04.json")

# 2) NeurIPS 2026 listing page
try:
    dest = SRCH / "neurips_2026_169434.html"
    data = http_get("https://neurips.cc/virtual/2026/169434", dest)
    text = data.decode("utf-8", errors="replace")
    import re
    m = re.search(r"<title>(.*?)</title>", text, re.S)
    print(f"NeurIPS page HTTP 200, <title> = {m.group(1).strip()[:100] if m else 'NONE'}")
    hits = re.findall(r"conformal[^\"]{0,80}", text, re.I)[:3]
    for h in hits:
        print("  mentions:", " ".join(h.split())[:90])
    ledger("priorart_neurips_page", f"title={m.group(1).strip()[:80] if m else 'NONE'}",
           "https://neurips.cc/virtual/2026/169434", dest)
except Exception as e:  # noqa: BLE001
    print(f"NeurIPS page FETCH_ERROR {type(e).__name__}: {e}")
    ledger("priorart_neurips_page", f"FETCH_ERROR {type(e).__name__}", "https://neurips.cc/virtual/2026/169434", Path("/dev/null"))

# 3) FAIR for research software citation
q = urllib.parse.urlencode({"query.bibliographic": "FAIR principles research software",
                            "rows": 6, "select": "DOI,title,author,issued,container-title,type"})
dest = SRCH / "crossref_fair4rs.json"
msg = json.loads(http_get("https://api.crossref.org/works?" + q, dest))["message"]["items"]
print("-- Crossref FAIR-for-research-software candidates:")
for it in msg:
    t = (it.get("title") or [""])[0]
    a = (it.get("author") or [{}])[0].get("family", "?")
    y = (it.get("issued", {}).get("date-parts", [[None]])[0][0])
    v = (it.get("container-title") or [""])[0]
    print(f"   {a:<12} {y} | {t[:75]} | {it['DOI']} | {v[:35]}")
ledger("priorart_fair4rs_search", f"{len(msg)} candidates", "https://api.crossref.org/works?" + q, dest)

# 4) Prior-art searches: conformal + AMR / lineage shift (PubMed + Crossref)
def pubmed_search(term, tag):
    q = urllib.parse.urlencode({"db": "pubmed", "term": term, "retmax": "8", "sort": "relevance"})
    dest = SRCH / f"pubmed_{tag}.xml"
    http_get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" + q, dest)
    root = ET.fromstring(dest.read_text())
    count = root.findtext(".//Count") or "0"
    ids = [e.text for e in root.findall(".//Id")]
    # fetch titles for the first few
    titles = []
    if ids:
        time.sleep(0.4)
        q2 = urllib.parse.urlencode({"db": "pubmed", "id": ",".join(ids[:5]), "rettype": "abstract",
                                     "retmode": "xml"})
        sdest = SRCH / f"pubmed_{tag}_sum.xml"
        http_get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" + q2, sdest)
        sroot = ET.fromstring(sdest.read_text())
        for doc in sroot.findall(".//DocSum"):
            ti = " ".join((d.text or "") for d in doc.findall("./Item[@Name='Title']"))
            pmid = " ".join((d.text or "") for d in doc.findall("./Item[@Name='PMID']"))
            titles.append((pmid.strip(), " ".join(ti.split())))
        ledger(f"priorart_pubmed_{tag}", f"count={count}", "esearch: " + term, dest)
    return count, titles


queries = [
    ("conformal_cp_amr", '("conformal prediction"[TIAB] OR "conformal predictor"[TIAB]) AND ("antimicrobial resistance"[TIAB] OR "antibiotic resistance"[TIAB])'),
    ("conformal_cp_shift_clade", '("conformal prediction"[TIAB] OR "conformal predictor"[TIAB]) AND (clade[TIAB] OR lineage[TIAB] OR phylogen*[TIAB])'),
    ("conformal_cp_enterobacterales", '("conformal prediction"[TIAB] OR "conformal predictor"[TIAB]) AND (Enterobacterales[TIAB] OR Enterobacteri*[TIAB] OR "Klebsiella"[TIAB] OR "Escherichia"[TIAB])'),
    ("lineage_holdout_amr", '("leave-one-clade-out"[TIAB] OR "leave-lineage-out"[TIAB] OR "lineage holdout"[TIAB]) AND (resistance[TIAB] OR antimicrobial[TIAB])'),
    ("amr_wgs_prediction_evaluation", '("antimicrobial resistance"[TI]) AND ("whole genome"[TI] OR genomic[TI]) AND (prediction[TI] OR prediction*[TI]) AND (evaluation[TI] OR benchmark[TI] OR validation[TI])'),
    ("relabel_ast_breakpoints", '("susceptibility testing"[TIAB] OR antibiogram[TIAB]) AND ("breakpoint"[TIAB]) AND (re-interpret*[TIAB] OR relabel*[TIAB] OR reannotat*[TIAB] OR recategoriz*[TIAB])'),
]
for tag, term in queries:
    try:
        count, titles = pubmed_search(term, tag)
        print(f"-- PubMed[{tag}] count={count}")
        for pmid, t in titles[:5]:
            print(f"     {pmid}: {t[:85]}")
        time.sleep(0.4)
    except Exception as e:  # noqa: BLE001
        print(f"-- PubMed[{tag}] ERROR {type(e).__name__}: {e}")
print("=== stage1a part2 done ===")
