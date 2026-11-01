#!/usr/bin/env python3
"""Stage 1a part 3: NeurIPS page details; precise FAIR-for-research-software
citation search; additional AMR cross-validation prior-art searches."""
import hashlib
import json
import re
import time
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


def sha256_file(p):
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def ledger(key, value, source, snapshot):
    sha = sha256_file(snapshot) if Path(snapshot).exists() else "EMPTY"
    with open(LED, "a") as fh:
        fh.write(f"{key}\t{value}\t{source}\t{now()}\t{sha}\n")


def http_get(url, dest, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    Path(dest).write_bytes(data)
    return data


print(f"=== stage1a part3 {now()} ===")

# 1) NeurIPS 2026 page: authors, links, acceptance status
html = (SRCH / "neurips_2026_169434.html").read_text(errors="replace")
authors = re.findall(r'<meta name="citation_author" content="([^"]+)"', html)
pdflinks = sorted(set(re.findall(r'href="([^"]*(?:pdf|openreview|forum)[^"]*)"', html, re.I)))
title = re.search(r'<meta name="citation_title" content="([^"]+)"', html)
print("NeurIPS paper title:", title.group(1)[:110] if title else "?")
print("Authors:", "; ".join(authors[:12]) or "?")
print("Links:", pdflinks[:6])
abstract = re.search(r'<meta name="citation_abstract" content="([^"]+)"', html) or \
           re.search(r'<div class="[^"]*abstract[^"]*"[^>]*>(.{50,1200}?)</div>', html, re.S)
if abstract:
    print("Abstract lead:", " ".join(abstract.group(1).split())[:220])
ledger("priorart_neurips_details", f"authors={'|'.join(authors)[:200]}", "https://neurips.cc/virtual/2026/169434",
       SRCH / "neurips_2026_169434.html")

# 2) FAIR for research software: precise searches
for tag, url in [
    ("fair4rs_crossref_biblio",
     "https://api.crossref.org/works?" + urllib.parse.urlencode(
         {"query.bibliographic": "FAIR4RS FAIR principles research software", "rows": 8,
          "select": "DOI,title,author,issued,container-title,type"})),
    ("fair4rs_crossref_title",
     "https://api.crossref.org/works?" + urllib.parse.urlencode(
         {"query.title": "FAIR principles for research software", "rows": 8,
          "filter": "type:journal-article", "select": "DOI,title,author,issued,container-title,type"})),
]:
    dest = SRCH / f"{tag}.json"
    try:
        items = json.loads(http_get(url, dest))["message"]["items"]
        print(f"-- {tag}:")
        for it in items:
            t = (it.get("title") or [""])[0]
            a = (it.get("author") or [{}])[0].get("family", "?")
            y = (it.get("issued", {}).get("date-parts", [[None]])[0][0])
            v = (it.get("container-title") or [""])[0]
            print(f"   {a:<12} {y} | {t[:70]} | {it['DOI']} | {v[:40]} | {it.get('type','')[:14]}")
        ledger(tag, f"{len(items)} items", url, dest)
    except Exception as e:  # noqa: BLE001
        print(f"-- {tag} ERROR {type(e).__name__}: {e}")
    time.sleep(0.3)

# PubMed software-FAIR
try:
    q = urllib.parse.urlencode({"db": "pubmed", "term": '"FAIR principles"[TI] AND software[TI]', "retmax": "5", "sort": "relevance"})
    dest = SRCH / "fair4rs_pubmed.xml"
    http_get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" + q, dest)
    root = ET.fromstring(dest.read_text())
    ids = [e.text for e in root.findall(".//Id")]
    count = root.findtext(".//Count")
    print(f"-- PubMed FAIR-software count={count} ids={ids}")
    if ids:
        time.sleep(0.4)
        q2 = urllib.parse.urlencode({"db": "pubmed", "id": ",".join(ids), "rettype": "abstract", "retmode": "xml"})
        sdest = SRCH / "fair4rs_pubmed_sum.xml"
        http_get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" + q2, sdest)
        sroot = ET.fromstring(sdest.read_text())
        for doc in sroot.findall(".//DocSum"):
            ti = " ".join(" ".join((d.text or "") for d in doc.findall("./Item[@Name='Title']")).split())
            ai = " ".join(" ".join((d.text or "") for d in doc.findall("./Item[@Name='Source']")).split())
            print(f"     {ti[:95]} [{ai[:30]}]")
    ledger("fair4rs_pubmed", f"count={count}", "esearch: FAIR principles software", dest)
except Exception as e:  # noqa: BLE001
    print(f"-- PubMed FAIR ERROR {type(e).__name__}: {e}")

# 3) Additional AMR CV prior-art searches
def pubmed_count(term, tag):
    q = urllib.parse.urlencode({"db": "pubmed", "term": term, "retmax": "5", "sort": "relevance"})
    dest = SRCH / f"pubmed_{tag}.xml"
    try:
        http_get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" + q, dest)
        root = ET.fromstring(dest.read_text())
        count = root.findtext(".//Count") or "0"
        ids = [e.text for e in root.findall(".//Id")]
        titles = []
        if ids:
            time.sleep(0.4)
            q2 = urllib.parse.urlencode({"db": "pubmed", "id": ",".join(ids), "rettype": "abstract", "retmode": "xml"})
            sdest = SRCH / f"pubmed_{tag}_sum.xml"
            http_get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" + q2, sdest)
            sroot = ET.fromstring(sdest.read_text())
            for doc in sroot.findall(".//DocSum"):
                ti = " ".join(" ".join((d.text or "") for d in doc.findall("./Item[@Name='Title']")).split())
                titles.append(ti)
        ledger(f"priorart_pubmed_{tag}", f"count={count}", "esearch: " + term, dest)
        return count, titles
    except Exception as e:  # noqa: BLE001
        return f"ERR:{type(e).__name__}", []


for tag, term in [
    ("popstruct_cv_amr", '("population structure"[TIAB]) AND ("cross-validation"[TIAB] OR "cross validation"[TIAB]) AND (antimicrobial[TIAB] OR antibiotic[TIAB])'),
    ("grouped_cv_genomic", '("grouped cross-validation"[TIAB] OR "clustered cross-validation"[TIAB] OR "blocked cross-validation"[TIAB]) AND (genomic[TIAB] OR genome[TIAB])'),
    ("genotype_phenotype_concordance_ncbi", '("genotype-phenotype"[TIAB] OR "genotype phenotype"[TIAB]) AND (concordance[TIAB] OR discordant[TIAB]) AND ("public database"[TIAB] OR NCBI[TIAB] OR surveillance[TIAB]) AND (resistance[TIAB])'),
    ("unexplained_resistance_kp", '("unexplained resistance"[TIAB] OR "cryptic resistance"[TIAB] OR "genotype-phenotype mismatch"[TIAB]) AND ("Klebsiella"[TIAB])'),
    ("amr_ml_benchmark_wgs", '("machine learning"[TIAB]) AND ("antimicrobial resistance"[TIAB]) AND ("whole-genome"[TIAB] OR "whole genome"[TIAB]) AND (benchmark[TIAB] OR "systematic evaluation"[TIAB])'),
]:
    count, titles = pubmed_count(term, tag)
    print(f"-- PubMed[{tag}] count={count}")
    for t in titles[:5]:
        print(f"     {t[:95]}")
    time.sleep(0.4)
print("=== stage1a part3 done ===")
