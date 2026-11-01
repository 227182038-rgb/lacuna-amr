"""lacuna: license-clean local auditing of genome-based antimicrobial-resistance
predictions.

Core library. Every scientific rule implemented here mirrors the frozen
protocol (protocol/PROTOCOL.md): EUCAST-label derivation with censored-interval
semantics, AMRFinderPlus feature extraction, catalogue rule M0, lineage-aware
splits, calibrated models and Mondrian split-conformal prediction sets.
Research use only. No clinical claims.
"""
from __future__ import annotations

import csv
import hashlib
import json
import random
import re
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Mapping, Sequence

__version__ = "0.1.0"

RUO = "RESEARCH USE ONLY. Not for clinical decision-making."


# ---------------------------------------------------------------- breakpoints
@dataclass
class Breakpoints:
    """User-supplied breakpoint table (documented schema: TSV with columns
    drug, organism_group, S_le_mg_L, R_gt_mg_L, source, version)."""

    rows: dict[str, tuple[float, float, str, str]]  # drug -> (S<=, R>, source, version)

    @classmethod
    def load(cls, path: str | Path) -> "Breakpoints":
        rows = {}
        with open(path) as fh:
            rdr = csv.DictReader(fh, delimiter="\t")
            for r in rdr:
                rows[r["drug"].strip().lower()] = (
                    float(r["S_le_mg_L"]), float(r["R_gt_mg_L"]),
                    r.get("source", ""), r.get("version", ""))
        return cls(rows)

    def label(self, drug: str, sign: str, measurement: float | str) -> str:
        """EUCAST label with censored-interval semantics (protocol S5)."""
        if drug.lower() not in self.rows:
            return "NO_BREAKPOINT"
        s_bp, r_bp, _, _ = self.rows[drug.lower()]
        v = float(measurement)
        s = (sign or "").strip()
        if s in ("=", "", "=="):
            if v <= s_bp:
                return "S"
            if v > r_bp:
                return "R"
            return "I"
        if s == ">":
            return "R" if v >= r_bp else "INDETERMINATE_CENSORED"
        if s == ">=":
            return "R" if v > r_bp else "INDETERMINATE_CENSORED"
        if s in ("<", "<="):
            return "S" if v <= s_bp else "INDETERMINATE_CENSORED"
        return "INVALID_SIGN"


# ---------------------------------------------------------------- AST parsing
DILUTION_METHODS = {
    "broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
    "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
    "mic", "dilution"}
AUTOMATED_PLATFORMS = ("vitek", "phoenix", "microscan")
GRADIENT_MARKERS = ("e-test", "etest", "gradient")
TRAY_PLATFORMS = {"sensititre", "96-well plate", "96 well plate"}


def classify_ast_row(method: str, platform: str, unit: str, measurement: str) -> str:
    """primary_rule | excluded_platform | not_quantitative (protocol S5)."""
    m, p = (method or "").lower().strip(), (platform or "").lower().strip()
    if (unit or "").lower() != "mg/l" or not (measurement or "").strip():
        return "not_quantitative"
    if any(a in m or a in p for a in AUTOMATED_PLATFORMS):
        return "excluded_platform"
    if any(g in m or g in p for g in GRADIENT_MARKERS):
        return "excluded_platform"
    if m in DILUTION_METHODS or p in TRAY_PLATFORMS or (not m and not p):
        return "primary_rule"
    return "excluded_platform" if not m else "primary_rule"


def parse_biosample_antibiogram(xml_text: str) -> dict:
    """Parse one BioSampleSet (or single BioSample) XML document into metadata
    + AST rows. Verbatim-compatible with NCBI efetch output (Table class
    Antibiogram.*)."""
    root = ET.fromstring(xml_text)
    if root.tag == "BioSample":
        samples = [root]
    else:
        samples = root.findall(".//BioSample")
    out = []
    for bs in samples:
        rec = {"accession": bs.get("accession", ""), "rows": [], "attributes": {}}
        for attr in bs.findall(".//Attribute"):
            rec["attributes"][attr.get("harmonized_name") or ""] = (attr.text or "").strip()
        for table in bs.findall(".//Table"):
            if "antibiogram" not in (table.get("class") or "").lower():
                continue
            header = [ "".join(c.itertext()).strip().lower()
                       for c in table.findall(".//Header/Cell") ]
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
                def g(k):
                    j = idx.get(k)
                    return cells[j] if j is not None and j < len(cells) else ""
                rec["rows"].append({
                    "antibiotic": g("ab"), "phenotype": g("phen"), "sign": g("sign"),
                    "measurement": g("meas"), "unit": g("unit"), "method": g("method"),
                    "platform": g("plat"), "standard": g("std"),
                    "row_class": classify_ast_row(g("method"), g("plat"), g("unit"), g("meas"))})
        out.append(rec)
    return {"samples": out}


def derive_labels(sample: dict, bps: Breakpoints,
                  drugs: Sequence[str]) -> dict[str, dict]:
    """Per-drug analysis labels + submitter labels (agreement rule, protocol S5)."""
    res = {}
    for drug in drugs:
        rows = [r for r in sample["rows"] if r["antibiotic"].lower().strip() == drug.lower()]
        prim = [r for r in rows if r["row_class"] == "primary_rule"]
        entry = {"n_rows": len(rows), "n_primary": len(prim), "label": None,
                 "submitter_labels": sorted({r["phenotype"] for r in rows if r["phenotype"]}),
                 "standards": sorted({r["standard"] for r in rows if r["standard"]})}
        if prim:
            labs = {bps.label(drug, r["sign"], r["measurement"]) for r in prim}
            entry["label"] = labs.pop() if len(labs) == 1 else "CONFLICTED"
        res[drug] = entry
    return res


# ---------------------------------------------------------------- features
def features_from_amrfinder(tsv_paths: Iterable[Path]) -> dict[str, set[str]]:
    """Element/mutation presence sets per isolate from AMRFinderPlus TSVs.
    Isolate key = the report's Name column (the --name value) when present,
    else the file stem."""
    out: dict[str, set[str]] = defaultdict(set)
    for p in tsv_paths:
        with open(p) as fh:
            rdr = csv.DictReader(fh, delimiter="\t")
            for r in rdr:
                el = (r.get("Element symbol") or "").strip()
                etype = (r.get("Element type") or r.get("Type") or "").strip()
                if not el:
                    continue
                fid = f"mut:{el}" if etype == "POINT" else f"gene:{el}"
                key = (r.get("Name") or "").strip() or Path(p).stem
                out[key].add(fid)
    return dict(out)


def m0_mapping(feature_metadata: Mapping[str, set[str]], keywords: Mapping[str, Sequence[str]]
               ) -> dict[str, list[str]]:
    """Catalogue mapping from AMRFinderPlus Class/Subclass strings."""
    out = {}
    for drug, keys in keywords.items():
        fids = []
        for fid, fields in feature_metadata.items():
            if any(any(k in f.upper() for k in keys) for f in fields):
                fids.append(fid)
        out[drug] = sorted(fids)
    return out


# ---------------------------------------------------------------- splits
def s1_groups(ids: Sequence[str], lineage: Mapping[str, object], min_size: int = 25
              ) -> dict[str, list[str]]:
    sizes = Counter(lineage[i] for i in ids)
    big = {k for k, v in sizes.items() if v >= min_size}
    groups = defaultdict(list)
    for i in ids:
        groups[str(lineage[i]) if lineage[i] in big else "OTHER"].append(i)
    return {k: sorted(v) for k, v in groups.items()}


def assert_no_leakage(train: Sequence[str], test: Sequence[str],
                      clusters: Mapping[str, object]) -> None:
    """Raise if any isolate or clonal cluster is on both sides (G3 rule)."""
    ti, te = set(train), set(test)
    if ti & te:
        raise AssertionError(f"isolate leakage: {sorted(ti & te)[:5]}")
    tc = {clusters[i] for i in train}
    ec = {clusters[i] for i in test}
    if tc & ec:
        raise AssertionError(f"cluster leakage: {sorted(tc & ec)[:5]}")


# ---------------------------------------------------------------- metrics
def ca_vme_me(y: Sequence[int], pred: Sequence[int]) -> dict:
    y, pred = list(y), list(pred)
    r = [i for i in range(len(y)) if y[i] == 1]
    s = [i for i in range(len(y)) if y[i] == 0]
    return {
        "CA": sum(pred[i] == y[i] for i in range(len(y))) / max(1, len(y)),
        "VME": (sum(pred[i] == 0 for i in r) / len(r)) if r else None,
        "ME": (sum(pred[i] == 1 for i in s) / len(s)) if s else None,
        "n_R": len(r), "n_S": len(s),
    }


def conformal_quantiles(scores: Sequence[float], alpha: float = 0.10) -> float:
    n = len(scores)
    if n == 0:
        return 2.0
    k = min(max(int(__import__("math").ceil((n + 1) * (1 - alpha))) - 1, 0), n - 1)
    return float(sorted(scores)[k])


def mondrian_quantiles(p_cal, y_cal, alpha: float = 0.10) -> dict:
    import numpy as np
    p_cal = np.asarray(p_cal)
    y_cal = np.asarray(y_cal)
    scores = 1.0 - p_cal[np.arange(len(y_cal)), y_cal]
    return {"marginal": conformal_quantiles(scores, alpha),
            "mondrian": {c: conformal_quantiles(scores[y_cal == c], alpha) for c in (0, 1)}}


def conformal_set(p_row, quantiles: dict, variant: str = "mondrian") -> list[int]:
    out = []
    for c in (0, 1):
        thr = quantiles["marginal"] if variant == "marginal" else quantiles["mondrian"][c]
        if 1.0 - p_row[c] <= thr:
            out.append(c)
    return out


def abstain_or_predict(sets: Sequence[list[int]]) -> list[int | None]:
    """Single-element sets -> class; empty -> None (abstain)."""
    return [s[0] if len(s) == 1 else None for s in sets]


def risk_coverage_curve(y: Sequence[int], p: Sequence[float]) -> list[dict]:
    order = sorted(range(len(p)), key=lambda i: -p[i])
    out = []
    seen, errors = 0, 0
    for k, i in enumerate(order, 1):
        if p[i] >= 0.5 and y[i] == 0:
            errors += 1
        seen += 1
        out.append({"coverage": k / len(p), "risk": errors / k})
    return out


def provenance_hash(path: str | Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def write_manifest(paths: Iterable[Path], out_path: str | Path, base: Path | None = None) -> None:
    base = base or Path(".")
    with open(out_path, "w", newline="") as fh:
        w = csv.writer(fh, delimiter="\t")
        w.writerow(["path", "sha256", "bytes"])
        for p in sorted(paths):
            w.writerow([str(Path(p).relative_to(base)), provenance_hash(p), Path(p).stat().st_size])
