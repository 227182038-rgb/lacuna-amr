#!/usr/bin/env python3
"""Stage 3a-c: acquire E. coli cohort. Protocol-governed:
- seeded shuffle (20261101) of the E. coli antibiogram pool;
- fetch BioSample records in batches, parse antibiogram tables;
- a record QUALIFIES if it has >=1 primary-rule row (quantitative mg/L, dilution-family
  method, non-automated platform, non-gradient) for any target drug;
- stop at TARGET_QUALIFYING unique BioSamples;
- link assemblies (RefSeq preferred), apply stats QC, download FASTA + sha256.
Resume-safe via data/stage3_state.json. All retrievals snapshotted + hashed."""
import gzip
import hashlib
import json
import random
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
ASM = ROOT / "data" / "assemblies"
ASM.mkdir(parents=True, exist_ok=True)
LED = ROOT / "provenance" / "ledger.tsv"
STATE_F = ROOT / "data" / "stage3_state.json"
UA = "lacuna-amr-stage3/0.1 (research cohort acquisition; provenance-captured)"
BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
DRUGS = ["ciprofloxacin", "meropenem", "gentamicin"]
TARGET_QUALIFYING = 650
SEED = 20261101
DILUTION = {"broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
            "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
            "mic", "dilution"}
AUTOMATED = ("vitek", "phoenix", "microscan")
GRADIENT = ("e-test", "etest", "gradient")


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def http_get(url, dest, timeout=180, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                data = r.read()
            Path(dest).write_bytes(data)
            return data
        except Exception as e:  # noqa: BLE001
            if attempt == retries - 1:
                raise
            time.sleep(3 * (attempt + 1))


def ledger(key, value, source, sha):
    with open(LED, "a") as fh:
        fh.write(f"{key}\t{value}\t{source}\t{now()}\t{sha}\n")


def load_state():
    if STATE_F.exists():
        return json.loads(STATE_F.read_text())
    return {"fetched_uids": [], "records": [], "qualifying": [], "batches_done": 0, "phase": "fetch"}


state = load_state()
BP = json.loads((ROOT / "results" / "tables" / "breakpoints_eucast_v16_1.json").read_text())


def bp_values(drug):
    def num(x):
        m = re.search(r"\d+(?:\.\d+)?", str(x))
        return float(m.group(0)) if m else None
    d = BP["breakpoints"][drug]
    return num(d["S_le_mg_L"]), num(d["R_gt_mg_L"])


def classify_row(cells_map):
    """Return row classification for target drugs."""
    ab = (cells_map.get("ab") or "").lower().strip()
    if ab not in DRUGS:
        return None
    unit = (cells_map.get("unit") or "").lower().strip()
    meas = (cells_map.get("meas") or "").strip()
    method = (cells_map.get("method") or "").lower().strip()
    plat = (cells_map.get("plat") or "").lower().strip()
    std = (cells_map.get("std") or "").strip()
    phen = (cells_map.get("phen") or "").strip()
    sign = (cells_map.get("sign") or "").strip()
    if unit != "mg/l" or not meas:
        return dict(drug=ab, kind="not_quantitative", unit=unit, method=method, platform=plat,
                    standard=std, submitter_phenotype=phen, sign=sign, measurement=meas)
    automated = any(a in plat for a in AUTOMATED) or any(a in method for a in AUTOMATED)
    gradient = any(g in plat or g in method for g in GRADIENT)
    tray = plat in {"sensititre", "96-well plate", "96 well plate"} or method in {"sensititre", "96-well plate", "96 well plate"}
    dilution = method in DILUTION
    if automated or gradient:
        kind = "quant_excluded_platform"
    elif dilution or tray or (not plat and not method) or (not plat and dilution):
        kind = "primary_rule"
    elif not plat:
        kind = "primary_rule" if dilution else "quant_excluded_platform"
    else:
        kind = "quant_excluded_platform" if not dilution else "primary_rule"
    return dict(drug=ab, kind=kind, unit=unit, method=method, platform=plat or "missing",
                standard=std, submitter_phenotype=phen, sign=sign, measurement=meas)


def parse_record(bs):
    """Extract metadata + all target-drug AST rows from one BioSample element."""
    rec = dict(
        uid=bs.get("id"), accession=bs.get("accession"),
        organism=bs.findtext(".//OrganismName") or "",
        sample_name="", strain="", collection_date="", geo_loc="", isolation_source="",
        host="", source_type="", owner="", rows=[])
    for attr in bs.findall(".//Attribute"):
        h = attr.get("harmonized_name") or ""
        v = (attr.text or "").strip()
        if h == "strain":
            rec["strain"] = v
        elif h == "collection_date":
            rec["collection_date"] = v
        elif h == "geo_loc_name":
            rec["geo_loc"] = v
        elif h == "isolation_source":
            rec["isolation_source"] = v
        elif h == "host":
            rec["host"] = v
        elif h == "source_type":
            rec["source_type"] = v
    rec["owner"] = (bs.findtext(".//Owner/Name") or "").strip()
    for idel in bs.findall("./Ids/Id"):
        if idel.get("db_label") == "Sample name":
            rec["sample_name"] = (idel.text or "").strip()
    qualifies = False
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
            cm = {k: (cells[j] if j is not None and j < len(cells) else "") for k, j in idx.items()}
            info = classify_row(cm)
            if info is None:
                continue
            rec["rows"].append(info)
            if info["kind"] == "primary_rule":
                qualifies = True
    rec["qualifies"] = qualifies
    return rec


# ---------- phase 1: fetch + parse ----------
if state["phase"] == "fetch":
    pool = [l.strip() for l in (ROOT / "data" / "ecoli_antibiogram_pool_uids.tsv").read_text().splitlines()[1:] if l.strip()]
    rng = random.Random(SEED)
    order = pool[:]
    rng.shuffle(order)
    fetched = set(state["fetched_uids"])
    records = state["records"]
    qualifying = [r for r in records if r.get("qualifies")]
    print(f"resuming: fetched={len(fetched)} records={len(records)} qualifying={len(qualifying)}")
    bi = state["batches_done"]
    for start in range(0, len(order), 100):
        batch = [u for u in order[start:start + 100] if u not in fetched]
        if not batch:
            continue
        if len(qualifying) >= TARGET_QUALIFYING:
            break
        dest = SNAP / f"stage3_ecoli_batch_{bi:03d}.xml"
        q = urllib.parse.urlencode({"db": "biosample", "id": ",".join(batch)})
        try:
            data = http_get(BASE + "efetch.fcgi?" + q, dest)
        except Exception as e:  # noqa: BLE001
            print(f"batch {bi} FAILED {type(e).__name__}; skipping")
            bi += 1
            continue
        n_new = 0
        try:
            root = ET.fromstring(data)
        except ET.ParseError:
            bi += 1
            continue
        for bs in root.findall(".//BioSample"):
            rec = parse_record(bs)
            if rec["uid"] in fetched:
                continue
            fetched.add(rec["uid"])
            records.append(rec)
            n_new += 1
        qualifying = [r for r in records if r.get("qualifies")]
        bi += 1
        if bi % 3 == 0 or len(qualifying) >= TARGET_QUALIFYING:
            print(f"batch {bi}: +{n_new} records, total {len(records)}, qualifying {len(qualifying)} ({now()})")
        state.update(fetched_uids=sorted(fetched), records=records, batches_done=bi,
                     phase="fetch" if len(qualifying) < TARGET_QUALIFYING else "link")
        STATE_F.write_text(json.dumps(state))
        time.sleep(0.45)
    state["phase"] = "link"
    STATE_F.write_text(json.dumps(state))
    print(f"PHASE 1 DONE: {len(records)} records, {len(qualifying)} qualifying")

qualifying = [r for r in state["records"] if r.get("qualifies")]
print(f"qualifying BioSamples: {len(qualifying)}")

# ---------- phase 2: assembly linking ----------
if state.get("phase") in ("link", "select"):
    links = {}
    for i, rec in enumerate(qualifying):
        acc = rec["accession"]
        if acc in state.get("links_done", []):
            continue
        q = urllib.parse.urlencode({"db": "assembly", "term": acc})
        dest = SNAP / f"stage3_asmsearch_{acc}.xml"
        try:
            root = ET.fromstring(http_get(BASE + "esearch.fcgi?" + q, dest))
            ids = [e.text for e in root.findall(".//Id")]
        except Exception:  # noqa: BLE001
            ids = []
        links[acc] = ids
        state.setdefault("links_done", []).append(acc)
        state.setdefault("asm_links", {})[acc] = ids
        if i % 50 == 0:
            print(f"link {i}/{len(qualifying)}: {acc} -> {ids}")
            STATE_F.write_text(json.dumps(state))
        time.sleep(0.4)
    # esummary in batches
    all_ids = sorted({i for v in state["asm_links"].values() for i in v})
    print(f"assembly UIDs to summarize: {len(all_ids)}")
    summaries = {}
    for j in range(0, len(all_ids), 150):
        chunk = [i for i in all_ids[j:j + 150]]
        q = urllib.parse.urlencode({"db": "assembly", "id": ",".join(chunk)})
        dest = SNAP / f"stage3_asmsummary_{j}.xml"
        if not dest.exists():
            try:
                http_get(BASE + "esummary.fcgi?" + q, dest)
                time.sleep(0.45)
            except Exception:  # noqa: BLE001
                continue
    # parse ALL saved esummary files locally (idempotent), keyed by assembly UID
    for dest in sorted(SNAP.glob("stage3_asmsummary_*.xml")):
        try:
            root = ET.fromstring(dest.read_bytes())
        except ET.ParseError:
            continue
        for ds in root.findall(".//DocumentSummary"):
            uid = ds.get("uid") or ds.findtext("GbUid") or ""
            acc = ds.findtext("AssemblyAccession") or ""
            meta = ds.findtext("Meta") or ""
            def meta_num(key):
                m = re.search(key + r"['\"]>([0-9,.]+)<", meta)
                if not m:
                    m = re.search(rf"{key}:?\s*([0-9,.]+)", meta)
                return m.group(1).replace(",", "") if m else ""
            bpacc = ""
            for tag in ("RS_BioProjects", "GB_BioProjects"):
                el = ds.find(f"{tag}")
                if el is not None:
                    m = re.search(r"PRJ[A-Z]+\d+", "".join(el.itertext()))
                    if m:
                        bpacc = m.group(0)
                        break
            summaries[uid] = {
                "uid": uid,
                "accession": acc,
                "organism": ds.findtext("Organism") or "",
                "asm_name": ds.findtext("AssemblyName") or "",
                "submission_date": ds.findtext("SubmissionDate") or "",
                "ftp_refseq": ds.findtext("FtpPath_RefSeq") or "",
                "ftp_genbank": ds.findtext("FtpPath_GenBank") or "",
                "assembly_status": ds.findtext("AssemblyStatus") or "",
                "submitter_org": ds.findtext("SubmitterOrganization") or "",
                "excl_from_refseq": ds.findtext("ExclFromRefSeq") or "",
                "n50": ds.findtext("ContigN50") or "",
                "coverage": ds.findtext("Coverage") or "",
                "biosample_accn": ds.findtext("BioSampleAccn") or "",
                "bioproject": bpacc,
            }
    state["asm_summaries"] = summaries
    print(f"assembly summaries: {len(summaries)}")
    state["phase"] = "select"
    STATE_F.write_text(json.dumps(state))

# ---------- phase 3: selection + download ----------
summaries = state.get("asm_summaries", {})
sel = []
unlinkable = []
for rec in qualifying:
    acc = rec["accession"]
    ids = state["asm_links"].get(acc, [])
    cands = [summaries[i] for i in ids if i in summaries]
    if not cands:
        unlinkable.append(acc)
        continue
    pref = [c for c in cands if c["ftp_refseq"]] or cands
    c = sorted(pref, key=lambda x: x["submission_date"])[-1]
    sel.append({"biosample": acc, "uid": rec["uid"], "assembly": c["accession"],
                "ftp": (c["ftp_refseq"] or c["ftp_genbank"]).replace("ftp://", "https://"),
                "bioproject": c["bioproject"], "submitter_org": c["submitter_org"],
                "assembly_status": c["assembly_status"], "n50": c["n50"],
                "coverage": c["coverage"]})
print(f"linkable: {len(sel)}  unlinkable: {len(unlinkable)}")

import shutil
DOWNLOAD_CAP = 450  # session-scale disk/time guard; seeded-order sample (deviation D-010)
to_dl = sel[:DOWNLOAD_CAP]
done = state.get("downloaded", {})
fail = []
for k, s in enumerate(to_dl):
    out = ASM / f"{s['biosample']}.fna.gz"
    if s["biosample"] in done and out.exists():
        continue
    if shutil.disk_usage(str(ROOT)).free < 3.5e9:
        print(f"DISK GUARD: stopping downloads at {k}")
        break
    base = s["ftp"].rstrip("/")
    fname = base.split("/")[-1]
    url = f"{base}/{fname}_genomic.fna.gz"
    try:
        data = http_get(url, out, timeout=240)
        sha = hashlib.sha256(data).hexdigest()
        done[s["biosample"]] = {"assembly": s["assembly"], "url": url, "sha256": sha,
                                "bytes": len(data)}
        ledger(f"assembly_{s['biosample']}", f"{s['assembly']} {len(data)}B", url, sha)
    except Exception as e:  # noqa: BLE001
        fail.append((s["biosample"], type(e).__name__))
        out.unlink(missing_ok=True)
    if k % 50 == 0:
        print(f"download {k}/{len(to_dl)} done={len(done)} fail={len(fail)} ({now()})")
        state["downloaded"] = done
        STATE_F.write_text(json.dumps(state))
state["downloaded"] = done
state["phase"] = "done"
STATE_F.write_text(json.dumps(state))
print(f"downloads: {len(done)} ok, {len(fail)} failed; failures: {fail[:5]}")

with open(ROOT / "data" / "manifest.tsv", "w") as fh:
    fh.write("biosample\tassembly\tftp\tbioproject\tsubmitter_org\tassembly_status\tn50\tcoverage\tdownloaded\tsha256\n")
    for s in sel:
        d = done.get(s["biosample"], {})
        fh.write("\t".join([s["biosample"], s["assembly"], s["ftp"], s["bioproject"],
                             s["submitter_org"], s["assembly_status"], s["n50"], s["coverage"],
                             "yes" if d else "no", d.get("sha256", "")]) + "\n")
(ROOT / "data" / "stage3_selection.json").write_text(json.dumps(
    {"n_qualifying": len(qualifying), "n_linkable": len(sel), "n_unlinkable": len(unlinkable),
     "n_downloaded": len(done), "n_download_failed": len(fail),
     "unlinkable_examples": unlinkable[:20]}, indent=2))
print("stage 3a-c complete")
