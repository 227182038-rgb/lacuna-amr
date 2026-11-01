"""Lineage-aware splits S0-S3 and leakage guards.

Split definitions (frozen protocol):
- S0 exchangeable: stratified random k-fold CV, repeated (both class orders
  shuffled with the frozen seed).
- S1 lineage shift: leave-coarse-lineage-out; lineages with < ``min_lineage``
  labelled isolates are merged into ``OTHER`` and never split apart.
- S2 time shift: forward-time hold-out by collection year (newest >=20% as
  test); infeasible when >30% of isolates lack a year or the test block has
  <5 R / <5 S.
- S3 origin shift: leave-(BioProject|submitter-org)-out; groups smaller than
  ``min_s3_group`` merge into ``OTHER_S3``.

Every produced split is assertion-checked for isolate and dedup-cluster
disjointness (no clonal leakage, gate G3 rule).
"""
from __future__ import annotations

import json
import random
from collections import Counter, defaultdict
from pathlib import Path
from typing import Mapping, Sequence

from .errors import SchemaError

COHORT_COLUMNS = ("biosample", "bioproject", "submitter_org", "dedup_cluster",
                  "coarse_lineage")


def s1_groups(ids: Sequence[str], lineage: Mapping[str, object], min_size: int = 25
              ) -> dict[str, list[str]]:
    """Lineage groups for S1 (small lineages -> OTHER, never split)."""
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


def load_cohort(path: str | Path) -> dict[str, dict[str, str]]:
    """Load cohort.tsv -> {biosample: {bioproject, submitter_org,
    dedup_cluster, coarse_lineage, fine_lineage}} (schema-validated)."""
    import csv
    path = Path(path)
    with open(path, newline="") as fh:
        rdr = csv.DictReader(fh, delimiter="\t")
        missing = [c for c in COHORT_COLUMNS if c not in (rdr.fieldnames or [])]
        if missing:
            raise SchemaError(
                f"{path}: cohort table missing column(s) {missing}; documented schema: "
                + ", ".join(COHORT_COLUMNS) + " (+optional fine_lineage extras).")
        out = {}
        for r in rdr:
            bs = (r.get("biosample") or "").strip()
            if bs:
                out[bs] = {k: (r.get(k) or "").strip() for k in set(rdr.fieldnames)}
    if not out:
        raise SchemaError(f"{path}: cohort table contains no rows")
    return out


def make_splits(ids: Sequence[str], y: Mapping[str, int],
                coarse: Mapping[str, str], dedup: Mapping[str, str],
                bioproject: Mapping[str, str], org: Mapping[str, str],
                year: Mapping[str, str] | None = None,
                seed: int = 20261101, n_folds: int = 5, n_reps: int = 2,
                min_lineage: int = 25, min_s3_group: int = 10
                ) -> dict:
    """Build the S0-S3 split document for one drug (protocol-frozen rules)."""
    ids = sorted(ids)
    # S0: clone-aware stratified random k-fold, repeated. Whole dedup clusters
    # are assigned to folds (greedy class balancing), so no clonal cluster is
    # split across train/test. (v0.2.0 hardening: the pilot's isolate-level S0
    # did split clonal clusters across folds — gate G3 recorded FAIL; sealed
    # splits given to `validate` are audited, never silently altered.)
    s0: dict = {}
    for rep in range(n_reps):
        rng = random.Random(seed + rep)
        clusters = defaultdict(list)
        for i in ids:
            clusters[str(dedup.get(i, i))].append(i)
        keys = sorted(clusters)
        rng.shuffle(keys)
        folds_pos = [0] * n_folds
        folds_neg = [0] * n_folds
        folds = [[] for _ in range(n_folds)]
        for ck in keys:
            members = clusters[ck]
            np_m = sum(1 for i in members if y[i] == 1)
            nn_m = len(members) - np_m
            j = min(range(n_folds),
                    key=lambda t: (folds_pos[t] + np_m, folds_neg[t] + nn_m))
            folds[j].extend(members)
            folds_pos[j] += np_m
            folds_neg[j] += nn_m
        s0[f"rep{rep}"] = [sorted(f) for f in folds]
    # S1: leave-coarse-lineage-out (small lineages -> OTHER)
    s1 = s1_groups(ids, coarse, min_size=min_lineage)
    # S2: forward-time hold-out
    years = {i: (year or {}).get(i, "") for i in ids}
    n_no_year = sum(1 for i in ids if not years[i])
    s2, s2_note = None, ""
    if n_no_year / len(ids) > 0.30:
        s2_note = f"infeasible: {n_no_year}/{len(ids)} isolates lack a collection year"
    else:
        ycounts = Counter(years[i] for i in ids if years[i])
        cum, tot = [], 0
        for yr in sorted(ycounts, reverse=True):
            tot += ycounts[yr]
            cum.append(yr)
            if tot >= 0.20 * (len(ids) - n_no_year):
                break
        test = [i for i in ids if years[i] and years[i] in cum]
        train = [i for i in ids if i not in set(test)]
        nr_t = sum(y[i] for i in test)
        if len(test) >= 0.20 * len(ids) and nr_t >= 5 and (len(test) - nr_t) >= 5:
            s2 = {"test_years": sorted(cum), "test": sorted(test), "train": sorted(train)}
        else:
            s2_note = (f"infeasible at this scale: test n={len(test)}, R={nr_t} "
                       "(protocol requires >=5 R and >=5 S in the test block)")
    # S3: leave-(BioProject|org)-out
    orgbp = defaultdict(list)
    for i in ids:
        orgbp[f"{bioproject.get(i, '')}|{org.get(i, '')}"].append(i)
    s3, other = {}, []
    for k, v in orgbp.items():
        if len(v) >= min_s3_group:
            s3[k] = sorted(v)
        else:
            other.extend(v)
    if other:
        s3["OTHER_S3"] = sorted(other)
    doc = {"S0": s0, "S1": s1, "S2": s2, "S2_note": s2_note, "S3": s3}
    doc["_audit"] = check_split_document(doc, ids, dedup)
    return doc


def check_split_document(doc: Mapping, ids: Sequence[str],
                         dedup: Mapping[str, str]) -> list[str]:
    """G3-style assertions: no isolate/dedup-cluster overlap in any train/test
    partition of the document. Returns the list of problems (empty = PASS)."""
    problems: list[str] = []

    def check_disjoint(train, test, tag):
        ti, te = set(train), set(test)
        if ti & te:
            problems.append(f"{tag}: isolate overlap {len(ti & te)}")
        tc = {dedup[i] for i in train if i in dedup}
        ec = {dedup[i] for i in test if i in dedup}
        if tc & ec:
            problems.append(f"{tag}: dedup-cluster overlap {len(tc & ec)}")

    s0 = doc.get("S0") or {}
    for rep, folds in s0.items():
        for j, f in enumerate(folds):
            rest = [i for jj, ff in enumerate(folds) if jj != j for i in ff]
            check_disjoint(rest, f, f"S0[{rep} fold{j}]")
    for k, v in (doc.get("S1") or {}).items():
        rest = [i for kk, vv in doc["S1"].items() if kk != k for i in vv]
        check_disjoint(rest, v, f"S1[{k}]")
    if doc.get("S2"):
        check_disjoint(doc["S2"]["train"], doc["S2"]["test"], "S2")
    for k, v in (doc.get("S3") or {}).items():
        rest = [i for kk, vv in doc["S3"].items() if kk != k for i in vv]
        check_disjoint(rest, v, f"S3[{k}]")
    return problems


def load_splits(path: str | Path) -> dict:
    """Load + validate a sealed split document (one drug)."""
    path = Path(path)
    doc = json.loads(path.read_text())
    if not isinstance(doc, dict) or "S0" not in doc or "S1" not in doc:
        raise SchemaError(
            f"{path}: split document must be a JSON object with at least 'S0' and "
            "'S1' keys (see results/splits/*.json for the layout).")
    return doc


def load_splits_per_drug(path: str | Path) -> dict[str, dict]:
    """Load a per-drug splits directory (``<drug>.json`` files) or a single
    JSON object ``{drug: splits_doc}``."""
    path = Path(path)
    if path.is_dir():
        out = {}
        for f in sorted(path.glob("*.json")):
            if f.name == "manifest.json":
                continue
            out[f.stem] = load_splits(f)
        if not out:
            raise SchemaError(f"{path}: no per-drug split documents found")
        return out
    doc = json.loads(path.read_text())
    if not isinstance(doc, dict) or not doc:
        raise SchemaError(f"{path}: expected a per-drug splits object")
    for k, v in doc.items():
        if not isinstance(v, dict) or "S0" not in v or "S1" not in v:
            raise SchemaError(f"{path}: entry {k!r} is not a split document")
    return doc
