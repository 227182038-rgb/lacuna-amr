#!/usr/bin/env python3
"""Stage 1b: license audit. Fetches license texts / policy pages live, hashes
them, extracts local dependency licenses, and writes provenance/license_audit.tsv.
Classification policy: standard permissive OSS = PERMITTED; custom/ambiguous or
non-commercial = EXCLUDED; documents free-to-use-with-attribution but not
resellable (EUCAST) = REFERENCE-ONLY (never bundled)."""
import hashlib
import json
import re
import time
import urllib.request
from email import message_from_string
from pathlib import Path

import importlib.metadata as im

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
LIC = ROOT / "provenance" / "licenses"
LIC.mkdir(parents=True, exist_ok=True)
TSV = ROOT / "provenance" / "license_audit.tsv"
LED = ROOT / "provenance" / "ledger.tsv"
UA = "lacuna-amr-stage1b/0.1 (provenance-capturing research script)"


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def sha256_file(p):
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def http_get(url, dest, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    Path(dest).write_bytes(data)
    return data


rows = []


def audit(name, version, license_note, source, snapshot, classification, notes=""):
    sha = sha256_file(snapshot) if Path(snapshot).exists() else "EMPTY"
    rows.append(dict(component=name, version=version, license=license_note[:160],
                     source=source, sha256=sha, classification=classification, notes=notes[:200]))
    with open(LED, "a") as fh:
        fh.write(f"license_{name}\t{classification}\t{source}\t{now()}\t{sha}\n")
    print(f"{classification:14} {name:<16} {version or '-':<12} {license_note[:60]}")


print(f"=== stage1b license audit {now()} ===")

# 1) raw.githubusercontent license/source files
RAW = [
    ("amrfinderplus", "ncbi/amr", "master", ["LICENSE", "README.md"]),
    ("pyseer", "mgalardini/pyseer", "master", ["LICENSE", "README.md"]),
    ("mash_marbl", "marbl/mash", "master", ["LICENSE", "README.md"]),
    ("sourmash", "sourmash-bio/sourmash", "main", ["LICENSE", "README.md"]),
    ("snakemake", "snakemake/snakemake", "main", ["LICENSE", "README.md"]),
]
for name, repo, branch, files in RAW:
    for f in files:
        url = f"https://raw.githubusercontent.com/{repo}/{branch}/{f}"
        dest = LIC / f"{name}_{f.replace('.', '_')}"
        try:
            data = http_get(url, dest)
            if f == "LICENSE":
                head = " ".join(data.decode("utf-8", "replace").split())[:110]
                print(f"RAW-OK  {repo}/{f}: {head[:100]}")
                audit(name, "", head, url, dest, "PENDING-REVIEW", "raw license text captured")
        except Exception as e:  # noqa: BLE001
            print(f"RAW-ERR {repo}/{f}: {type(e).__name__}")
        time.sleep(0.3)

# 2) PyPI metadata (license + latest version)
for pkg in ["sourmash", "pyseer", "snakemake", "amrfinderplus"]:
    dest = LIC / f"pypi_{pkg}.json"
    try:
        data = http_get(f"https://pypi.org/pypi/{pkg}/json", dest)
        info = json.loads(data)["info"]
        lic = info.get("license_expression") or (info.get("license") or "")[:110]
        audit(f"pypi:{pkg}", info.get("version", ""), lic, f"https://pypi.org/pypi/{pkg}/json", dest,
              "PENDING-REVIEW", f"name={info.get('name')}")
    except Exception as e:  # noqa: BLE001
        print(f"PYPI-ERR {pkg}: {type(e).__name__}")
    time.sleep(0.3)

# 3) CARD about page
dest = LIC / "card_about.html"
try:
    data = http_get("https://card.mcmaster.ca/about", dest, timeout=90)
    txt = re.sub(r"<[^>]+>", " ", data.decode("utf-8", "replace"))
    txt = " ".join(txt.split())
    m = re.search(r".{0,200}(?:commercial|license)[^.]{0,300}\.", txt, re.I)
    print("CARD about excerpt:", (m.group(0) if m else txt[:300])[:400])
    audit("card-data-rgi", "", "see captured about page (commercial licensing)", "https://card.mcmaster.ca/about",
          dest, "EXCLUDED", "commercial license required for CARD data/RGI; only ARO is CC BY 4.0 (verify ARO page)")
except Exception as e:  # noqa: BLE001
    print(f"CARD-ERR {type(e).__name__}: {e}")

# 4) CLSI M100 page (documenting it is a paid standard)
dest = LIC / "clsi_m100.html"
try:
    http_get("https://www.clsi.org/standards/products/microbiology/documents/m100/", dest, timeout=90)
    audit("clsi-m100", "", "CLSI document page (paid standard)", "https://www.clsi.org/standards/products/microbiology/documents/m100/",
          dest, "EXCLUDED", "copyrighted paid standard; values never embedded")
except Exception as e:  # noqa: BLE001
    print(f"CLSI-ERR {type(e).__name__}")

# 5) NCBI policies page: extract data-use statements
pol = ROOT / "provenance" / "snapshots" / "stage0_ncbi_policies.out"
if pol.exists():
    txt = re.sub(r"<[^>]+>", " ", pol.read_text(errors="replace"))
    txt = " ".join(txt.split())
    for pat in [r".{0,80}GenBank.{0,200}", r".{0,80}(?:no restrictions|without restriction).{0,150}"]:
        m = re.search(pat, txt, re.I)
        if m:
            print("NCBI policies excerpt:", m.group(0)[:300])
            break
    audit("ncbi-data-policies", "", "NCBI website policies page", "https://www.ncbi.nlm.nih.gov/home/about/policies/",
          pol, "PERMITTED", "NCBI-hosted data; check submitter claims per record")

# 6) EUCAST: find terms/copyright links from the home snapshot
home = ROOT / "provenance" / "snapshots" / "stage0_eucast_home.out"
if home.exists():
    links = sorted(set(re.findall(r'href="([^"]+)"', home.read_text(errors="replace"))))
    cand = [l for l in links if re.search(r"(terms|copyright|disclaimer|use|policies)", l, re.I)][:12]
    print("EUCAST candidate terms links:", *cand, sep="\n  ")
    audit("eucast-site", "", "EUCAST website home snapshot", "https://www.eucast.org/", home, "REFERENCE-ONLY",
          "breakpoint tables not bundled; user supplies table; cite EUCAST")

# 7) GitHub releases reachability test (HTML, not API)
dest = LIC / "github_amr_releases.html"
try:
    http_get("https://github.com/ncbi/amr/releases", dest, timeout=90)
    found = sorted(set(re.findall(r'href="([^"]*releases/download[^"]*)"', dest.read_text(errors="replace"))))[:8]
    print(f"GitHub releases HTML OK; asset links found: {len(found)}")
    for f in found:
        print("   ", f)
except Exception as e:  # noqa: BLE001
    print(f"GH-REL-ERR {type(e).__name__}: {e}")

# 8) OpenReview API for the NeurIPS conformal paper
dest = LIC.parent / "snapshots" / "openreview_RBZSoNdztV.json"
try:
    data = http_get("https://api2.openreview.net/notes?forum=RBZSoNdztV&limit=25", dest, timeout=60)
    notes = json.loads(data).get("notes", [])
    for n in notes:
        c = n.get("content", {})
        title = c.get("title", {})
        if isinstance(title, dict):
            title = title.get("value", "")
        if title:
            authors = c.get("authors", {})
            if isinstance(authors, dict):
                authors = authors.get("value", [])
            venue = c.get("venue", {})
            if isinstance(venue, dict):
                venue = venue.get("value", "")
            print(f"OpenReview note: {title[:80]} | venue={venue} | authors={'; '.join(authors)[:80]}")
    print(f"OpenReview notes retrieved: {len(notes)}")
except Exception as e:  # noqa: BLE001
    print(f"OPENREVIEW-ERR {type(e).__name__}: {e}")

# 9) Local python dependency licenses
print("-- local python packages:")
for dist_name in ["numpy", "scipy", "scikit-learn", "pandas", "matplotlib", "openpyxl", "biopython",
                  "joblib", "statsmodels", "pytest", "python-dateutil", "pytz", "six"]:
    try:
        d = im.distribution(dist_name)
        meta = d.metadata
        lic = meta.get("License", "") or ""
        if not lic:
            lic = "; ".join(c for c in meta.get_all("Classifier", []) if c.startswith("License"))[:120]
        audit(f"py:{dist_name}", d.version, lic, f"local site-packages metadata ({d._path})", Path(d._path), "PENDING-REVIEW", "")
    except im.PackageNotFoundError:
        print(f"   {dist_name}: not installed")

# write TSV
cols = ["component", "version", "license", "source", "sha256", "classification", "notes"]
with open(TSV, "w") as fh:
    fh.write("\t".join(cols) + "\n")
    for r in rows:
        fh.write("\t".join(r[c] for c in cols) + "\n")
print(f"--- wrote {TSV.relative_to(ROOT)} rows={len(rows)}")
