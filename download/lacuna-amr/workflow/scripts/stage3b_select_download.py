#!/usr/bin/env python3
"""Stage 3b: re-parse saved assembly esummary XMLs (uid-keyed, correct fields),
select RefSeq-preferred assemblies for qualifying BioSamples, download capped
FASTAs with disk guard. Resume-safe."""
import hashlib
import json
import re
import shutil
import time
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SNAP = ROOT / "provenance" / "snapshots"
ASM = ROOT / "data" / "assemblies"
ASM.mkdir(parents=True, exist_ok=True)
LED = ROOT / "provenance" / "ledger.tsv"
STATE_F = ROOT / "data" / "stage3_state.json"
UA = "lacuna-amr-stage3b/0.1"
DOWNLOAD_CAP = 450


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


state = json.loads(STATE_F.read_text())
qualifying = [r for r in state["records"] if r.get("qualifies")]

# 1) re-parse all saved esummary XMLs, keyed by assembly UID
summaries = {}
for dest in sorted(SNAP.glob("stage3_asmsummary_*.xml")):
    try:
        root = ET.fromstring(dest.read_bytes())
    except ET.ParseError:
        continue
    for ds in root.findall(".//DocumentSummary"):
        uid = ds.get("uid") or ds.findtext("GbUid") or ""
        if not uid:
            continue
        bpacc = ""
        for tag in ("RS_BioProjects", "GB_BioProjects"):
            el = ds.find(tag)
            if el is not None:
                m = re.search(r"PRJ[A-Z]+\d+", "".join(el.itertext()))
                if m:
                    bpacc = m.group(0)
                    break
        summaries[uid] = {
            "uid": uid, "accession": ds.findtext("AssemblyAccession") or "",
            "submission_date": ds.findtext("SubmissionDate") or "",
            "ftp_refseq": ds.findtext("FtpPath_RefSeq") or "",
            "ftp_genbank": ds.findtext("FtpPath_GenBank") or "",
            "assembly_status": ds.findtext("AssemblyStatus") or "",
            "submitter_org": ds.findtext("SubmitterOrganization") or "",
            "n50": ds.findtext("ContigN50") or "",
            "coverage": ds.findtext("Coverage") or "",
            "bioproject": bpacc,
        }
print(f"summaries re-parsed: {len(summaries)} (uid-keyed); sample uid: {next(iter(summaries))}")

# 2) selection
sel, unlinkable = [], []
for rec in qualifying:
    acc = rec["accession"]
    ids = state["asm_links"].get(acc, [])
    cands = [summaries[i] for i in ids if i in summaries]
    if not cands:
        unlinkable.append(acc)
        continue
    pref = [c for c in cands if c["ftp_refseq"]] or cands
    c = sorted(pref, key=lambda x: x["submission_date"])[-1]
    sel.append({"biosample": acc, "assembly": c["accession"],
                "ftp": (c["ftp_refseq"] or c["ftp_genbank"]).replace("ftp://", "https://"),
                "bioproject": c["bioproject"], "submitter_org": c["submitter_org"],
                "assembly_status": c["assembly_status"], "n50": c["n50"], "coverage": c["coverage"]})
print(f"linkable: {len(sel)}  unlinkable: {len(unlinkable)}")

# 3) downloads (resume-safe)
done = state.get("downloaded", {})
fail = []
to_dl = sel[:DOWNLOAD_CAP]
for k, s in enumerate(to_dl):
    out = ASM / f"{s['biosample']}.fna.gz"
    if s["biosample"] in done and out.exists():
        continue
    if shutil.disk_usage(str(ROOT)).free < 3.5e9:
        print(f"DISK GUARD: stop at {k}")
        break
    base = s["ftp"].rstrip("/")
    fname = base.split("/")[-1]
    url = f"{base}/{fname}_genomic.fna.gz"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=240) as r:
            data = r.read()
        out.write_bytes(data)
        sha = hashlib.sha256(data).hexdigest()
        done[s["biosample"]] = {"assembly": s["assembly"], "url": url, "sha256": sha, "bytes": len(data)}
        with open(LED, "a") as fh:
            fh.write(f"assembly_{s['biosample']}\t{s['assembly']}_{len(data)}B\t{url}\t{now()}\t{sha}\n")
    except Exception as e:  # noqa: BLE001
        fail.append((s["biosample"], type(e).__name__))
        out.unlink(missing_ok=True)
    if k % 50 == 0:
        print(f"download {k}/{len(to_dl)} done={len(done)} fail={len(fail)} ({now()})")
        state["downloaded"] = done
        STATE_F.write_text(json.dumps(state))
state["downloaded"] = done
state["selection"] = sel[:DOWNLOAD_CAP]
state["phase"] = "done"
STATE_F.write_text(json.dumps(state))
print(f"downloads: {len(done)} ok, {len(fail)} failed; {fail[:4]}")

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
print("stage 3b complete")
