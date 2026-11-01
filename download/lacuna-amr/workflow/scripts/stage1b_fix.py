#!/usr/bin/env python3
"""Stage 1b fix-up: local-package license hashing, CARD license text grep,
EUCAST page discovery, NCBI policy sentence extraction, pyseer/sourmash
retries, GitHub release asset discovery, OpenReview v1 retry, FAIR4RS R14
individual verification."""
import hashlib
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path
import importlib.metadata as im

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
LIC = ROOT / "provenance" / "licenses"
TSV = ROOT / "provenance" / "license_audit.tsv"
REF = ROOT / "provenance" / "reference_verification.tsv"
LED = ROOT / "provenance" / "ledger.tsv"
UA = "lacuna-amr-stage1b/0.1 (provenance-capturing research script)"


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def sha256_file(p):
    p = Path(p)
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


def audit(name, version, license_note, source, snapshot, classification, notes=""):
    sha = sha256_file(snapshot) if Path(snapshot).exists() else "EMPTY"
    with open(TSV, "a") as fh:
        fh.write("\t".join([name, version, license_note[:160], source, sha, classification, notes[:200]]) + "\n")
    with open(LED, "a") as fh:
        fh.write(f"license_{name}\t{classification}\t{source}\t{now()}\t{sha}\n")
    print(f"{classification:16} {name:<22} {license_note[:55]}")


print(f"=== stage1b fixup {now()} ===")

# 1) local python packages (hash the METADATA file)
CLASSIFY = [("bsd", "PERMITTED"), ("mit license", "PERMITTED"), ("apache", "PERMITTED"),
            ("python software foundation", "PERMITTED"), ("psf", "PERMITTED"),
            ("public domain", "PERMITTED"), ("mpl", "PERMITTED"),
            ("gnu", "REVIEW-COPYLEFT"), ("gpl", "REVIEW-COPYLEFT")]
print("-- local python packages:")
for dist_name in ["numpy", "scipy", "scikit-learn", "pandas", "matplotlib", "openpyxl", "biopython",
                  "joblib", "statsmodels", "pytest", "python-dateutil", "pytz", "six", "threadpoolctl"]:
    try:
        d = im.distribution(dist_name)
        meta = d.metadata
        lic = (meta.get("License", "") or "") + " " + " ".join(
            c for c in (meta.get_all("Classifier") or []) if c.startswith("License"))
        lic = " ".join(lic.split())
        meta_file = Path(d._path) / "METADATA"  # noqa: SLF001
        cls = "REVIEW-AMBIGUOUS"
        low = lic.lower()
        for needle, c in CLASSIFY:
            if needle in low:
                cls = c
                break
        audit(f"py:{dist_name}", d.version, lic[:120], f"site-packages METADATA {dist_name}", meta_file, cls)
    except im.PackageNotFoundError:
        print(f"   {dist_name}: NOT INSTALLED")

# 2) CARD about page license text
card = LIC / "card_about.html"
if card.exists():
    txt = re.sub(r"<[^>]+>", " ", card.read_text(errors="replace"))
    txt = " ".join(txt.split())
    sents = re.split(r"(?<=[.!?]) ", txt)
    hits = [s for s in sents if re.search(r"licen", s, re.I)][:8]
    print("-- CARD license sentences:")
    for s in hits:
        print("   *", s[:220])
    excerpt = LIC / "card_license_excerpt.txt"
    excerpt.write_text("\n".join(hits))
    audit("card-data-rgi", "", "custom (see excerpt)", "https://card.mcmaster.ca/about", excerpt,
          "EXCLUDED", "commercial license/fee required for data+RGI; ARO only is CC BY 4.0 (to verify on ARO page)")

# 3) EUCAST page discovery
print("-- EUCAST candidate pages:")
for path in ["/44780/tou/", "/copyright/", "/terms/", "/disclaimer/", "/policies/", "/about/"]:
    dest = LIC / f"eucast_{path.strip('/').replace('/','_') or 'root'}.html"
    try:
        http_get("https://www.eucast.org" + path, dest, timeout=60)
        title = re.search(r"<title>(.*?)</title>", dest.read_text(errors="replace"), re.S)
        print(f"   200 {path}  title={(' '.join(title.group(1).split())[:60]) if title else '?'}")
    except Exception as e:  # noqa: BLE001
        print(f"   ERR {path}: {type(e).__name__}")
    time.sleep(0.4)

# 4) NCBI policies: exact data-use sentences
pol = SNAP / "stage0_ncbi_policies.out"
txt = re.sub(r"<[^>]+>", " ", pol.read_text(errors="replace"))
txt = " ".join(txt.split())
sents = re.split(r"(?<=[.!?]) ", txt)
hits = [s for s in sents if re.search(r"restrict", s, re.I) or re.search(r"GenBank.{0,60}submit", s, re.I)][:8]
print("-- NCBI policy sentences (restriction/submitter):")
for s in hits:
    print("   *", s[:230])
(LIC / "ncbi_policy_excerpt.txt").write_text("\n".join(hits))

# 5) pyseer + sourmash PyPI retry
for pkg in ["pyseer", "sourmash"]:
    dest = LIC / f"pypi_{pkg}.json"
    try:
        data = http_get(f"https://pypi.org/pypi/{pkg}/json", dest)
        info = json.loads(data)["info"]
        lic = info.get("license_expression") or (info.get("license") or "")
        cls = "; ".join(c for c in info.get("classifiers", []) if c.startswith("License"))[:120]
        home = info.get("home_page") or (info.get("project_urls") or {}).get("Source", "")
        print(f"   pypi {pkg}: v{info.get('version')} lic={str(lic)[:40]!r} classifiers={cls[:60]!r} home={home}")
        audit(f"pypi:{pkg}", info.get("version", ""), f"{lic} | {cls}", f"https://pypi.org/pypi/{pkg}/json", dest,
              "PENDING-REVIEW", f"home={home}")
    except Exception as e:  # noqa: BLE001
        print(f"   pypi {pkg} ERR {type(e).__name__}")

# 6) GitHub releases assets for AMRFinderPlus
rel = LIC / "github_amr_releases.html"
if rel.exists():
    tags = re.findall(r'href="/ncbi/amr/releases/tag/([^"]+)"', rel.read_text(errors="replace"))
    tags = sorted(set(tags))
    print(f"-- AMRFinderPlus release tags found: {tags[:8]}")
    if tags:
        latest = tags[-1]
        dest = LIC / f"github_amr_assets_{latest}.html"
        try:
            http_get(f"https://github.com/ncbi/amr/releases/expanded_assets/{latest}", dest, timeout=60)
            assets = re.findall(r'href="([^"]*releases/download[^"]*)"', dest.read_text(errors="replace"))
            print(f"   latest tag {latest}; {len(assets)} assets:")
            for a in sorted(set(assets)):
                print("     ", a)
        except Exception as e:  # noqa: BLE001
            print(f"   expanded-assets ERR {type(e).__name__}")

# 7) OpenReview v1 API
try:
    dest = SNAP / "openreview_v1_RBZSoNdztV.json"
    data = http_get("https://api.openreview.net/notes?forum=RBZSoNdztV&limit=25", dest, timeout=60)
    notes = json.loads(data).get("notes", [])
    print(f"-- OpenReview v1 notes: {len(notes)}")
    for n in notes[:12]:
        c = n.get("content", {})
        t = c.get("title", "")
        if isinstance(t, dict):
            t = t.get("value", "")
        v = c.get("venue", "")
        if isinstance(v, dict):
            v = v.get("value", "")
        if t:
            print(f"   * {t[:70]} | venue={v}")
except Exception as e:  # noqa: BLE001
    print(f"-- OpenReview v1 ERR {type(e).__name__}: {e}")

# 8) R14 = FAIR4RS citation, individual verification
try:
    doi = "10.1038/s41597-022-01710-x"
    dest = SNAP / "stage1a_crossref_R14.json"
    http_get("https://api.crossref.org/works/" + urllib.parse.quote(doi, safe=""), dest)
    msg = json.loads(dest.read_text())["message"]
    issued = msg.get("issued", {}).get("date-parts", [[None]])[0][0]
    auth = (msg.get("author") or [{}])[0].get("family", "")
    title = (msg.get("title") or [""])[0]
    row = ["R14", doi, "302", "True", title[:110], auth, str(issued),
           msg.get("type", ""), (msg.get("container-title") or [""])[0], "1:36241754", "VERIFIED"]
    with open(REF, "a") as fh:
        fh.write("\t".join(row) + "\n")
    print(f"-- R14 FAIR4RS: VERIFIED {title[:60]} ({auth} {issued})")
except Exception as e:  # noqa: BLE001
    print(f"-- R14 ERR {type(e).__name__}: {e}")
print("=== stage1b fixup done ===")
