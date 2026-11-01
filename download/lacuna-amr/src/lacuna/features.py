"""AMRFinderPlus feature extraction and the M0 catalogue mapping.

Features are ``gene:<symbol>`` / ``mut:<symbol>`` presence flags built from
AMRFinderPlus TSV reports (public-domain software; the user runs it with a
frozen database version and lacuna consumes the output — lacuna never bundles
or downloads the database).

The M0 catalogue mapping is derived from AMRFinderPlus's own ``Class`` /
``Subclass`` annotation columns by drug-specific keyword match, so the
catalogue rule stays anchored to the tool's curated ontology rather than to a
hand-written gene list.
"""
from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path
from typing import Iterable, Mapping, Sequence

from .errors import SchemaError

# Drug-specific keywords matched (uppercase, substring) against BOTH the Class
# and Subclass fields of AMRFinderPlus output. Gentamicin matches the drug name
# only: aminoglycoside enzymes whose Subclass names another drug (aadA =
# STREPTOMYCIN, aph(3') = KANAMYCIN) do not confer gentamicin resistance.
DEFAULT_M0_KEYWORDS: dict[str, list[str]] = {
    "ciprofloxacin": ["QUINOLONE"],
    "gentamicin": ["GENTAMICIN"],
    "meropenem": ["CARBAPENEM"],
    "ceftazidime": ["CEPHALOSPORIN", "CARBAPENEM", "CEFTAZIDIME"],
    "colistin": ["COLISTIN", "PHOSPHOETHANOLAMINE"],
    "cefotaxime": ["CEPHALOSPORIN", "CARBAPENEM", "CEFOTAXIME"],
    "ciprofloxacin-meningitis": ["QUINOLONE"],
}


def parse_amrfinder_tsv(path: str | Path) -> tuple[set[str], dict[str, set[str]], str]:
    """Parse one AMRFinderPlus TSV report.

    Returns (feature_ids, feature_id -> {Class, Subclass...}, isolate_key).
    The isolate key is the report's ``Name`` column (``--name`` value) when
    present, else the file stem (the project convention: one report named
    ``<biosample>.tsv`` per isolate).
    """
    path = Path(path)
    with open(path, newline="") as fh:
        rdr = csv.DictReader(fh, delimiter="\t")
        if not rdr.fieldnames or "Element symbol" not in rdr.fieldnames:
            raise SchemaError(
                f"{path}: not an AMRFinderPlus TSV (no 'Element symbol' column; "
                "expected the default tabular report of NCBI AMRFinderPlus).")
        feats: set[str] = set()
        meta: dict[str, set[str]] = defaultdict(set)
        name = ""
        for r in rdr:
            el = (r.get("Element symbol") or "").strip()
            etype = (r.get("Element type") or r.get("Type") or "").strip()
            if not el:
                continue
            fid = f"mut:{el}" if etype == "POINT" else f"gene:{el}"
            feats.add(fid)
            for col in ("Class", "Subclass"):
                v = (r.get(col) or "").strip()
                if v:
                    meta[fid].add(v)
            if not name:
                name = (r.get("Name") or "").strip()
        return feats, dict(meta), name or path.stem


def features_from_amrfinder(tsv_paths: Iterable[Path]) -> dict[str, set[str]]:
    """Element/mutation presence sets per isolate from AMRFinderPlus TSVs."""
    out: dict[str, set[str]] = defaultdict(set)
    for p in tsv_paths:
        feats, _, key = parse_amrfinder_tsv(p)
        out[key] |= feats
    return dict(out)


def amrfinder_metadata(tsv_paths: Iterable[Path]) -> dict[str, set[str]]:
    """feature_id -> {Class, Subclass strings} across all reports."""
    meta: dict[str, set[str]] = defaultdict(set)
    for p in tsv_paths:
        _, m, _ = parse_amrfinder_tsv(p)
        for fid, fields in m.items():
            meta[fid] |= fields
    return dict(meta)


def m0_mapping(feature_metadata: Mapping[str, set[str]],
               keywords: Mapping[str, Sequence[str]] | None = None
               ) -> dict[str, list[str]]:
    """Catalogue mapping: AMRFinderPlus Class/Subclass keyword match per drug."""
    keywords = keywords or DEFAULT_M0_KEYWORDS
    out = {}
    for drug, keys in keywords.items():
        fids = []
        for fid, fields in feature_metadata.items():
            if any(any(k in f.upper() for k in keys) for f in fields):
                fids.append(fid)
        out[drug] = sorted(fids)
    return out


def load_m0_mapping(path: str | Path) -> tuple[dict[str, list[str]], dict]:
    """Load a previously frozen M0 mapping (``results/m0_mapping.json`` layout:
    ``{"mapping_keywords": {...}, "feature_sets": {...}}``)."""
    doc = json.loads(Path(path).read_text())
    if "feature_sets" not in doc:
        raise SchemaError(f"{path}: M0 mapping file lacks 'feature_sets' key")
    return doc["feature_sets"], doc.get("mapping_keywords", {})


# ---------------------------------------------------------------- matrix I/O
def load_feature_matrix(path: str | Path) -> dict[str, dict[str, int]]:
    """Load a feature matrix TSV (header row of feature ids, first column
    ``biosample``) into {isolate: {feature: 0/1}}."""
    import numpy as np  # noqa: F401  (kept for dtype consistency downstream)
    path = Path(path)
    with open(path, newline="") as fh:
        rdr = csv.reader(fh, delimiter="\t")
        try:
            header = next(rdr)
        except StopIteration:
            raise SchemaError(f"{path}: empty feature matrix")
        if not header or header[0] != "biosample":
            raise SchemaError(
                f"{path}: feature matrix must start with a 'biosample' column header")
        cols = header[1:]
        mat: dict[str, dict[str, int]] = {}
        for ln, row in enumerate(rdr, start=2):
            if not row or not row[0].strip():
                continue
            if len(row) != len(header):
                raise SchemaError(f"{path}:{ln}: row has {len(row)} fields, "
                                  f"expected {len(header)}")
            iso = row[0]
            if iso in mat:
                raise SchemaError(f"{path}:{ln}: duplicate isolate row {iso}")
            mat[iso] = {c: int(v != "0") for c, v in zip(cols, row[1:]) if v not in ("", "0")}
    if not mat:
        raise SchemaError(f"{path}: feature matrix contains no isolate rows")
    return mat


def matrix_from_sets(sets: Mapping[str, set[str]],
                     order: Sequence[str] | None = None) -> dict[str, dict[str, int]]:
    """Feature sets -> matrix dict (feature vocabulary = union, sorted)."""
    vocab = sorted({f for s in sets.values() for f in s}) if order is None else list(order)
    return {iso: {f: 1 for f in (sets.get(iso) or set()) & set(vocab)} for iso in sets}


def matrix_to_arrays(mat: Mapping[str, dict[str, int]],
                     feature_order: Sequence[str]):
    """(isolates, X) with columns in ``feature_order``; unknown features
    ignored. Rows may be dicts (feature -> value) or sets (presence)."""
    import numpy as np
    isos = sorted(mat)
    fpos = {f: j for j, f in enumerate(feature_order)}
    X = np.zeros((len(isos), len(feature_order)), dtype=np.float64)
    for i, iso in enumerate(isos):
        row = mat[iso]
        pairs = row.items() if isinstance(row, dict) else ((f, 1) for f in row)
        for f, v in pairs:
            j = fpos.get(f)
            if j is not None:
                X[i, j] = float(v)
    return isos, X


def write_feature_matrix(mat: Mapping[str, dict[str, int]], path: str | Path,
                         feature_order: Sequence[str] | None = None) -> None:
    feature_order = list(feature_order) if feature_order is not None else sorted(
        {f for d in mat.values() for f in d})
    with open(path, "w", newline="") as fh:
        w = csv.writer(fh, delimiter="\t")
        w.writerow(["biosample"] + feature_order)
        for iso in sorted(mat):
            w.writerow([iso] + [mat[iso].get(f, 0) for f in feature_order])
