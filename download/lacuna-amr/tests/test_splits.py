"""Split generation + leakage guards (synthetic ids; mechanics tests).

The synthetic population is constructed so that clonal clusters nest inside
lineages, years and origins (as they do in real data) — the honest clean case.
A separate test proves the injected-overlap detector fires.
"""
import pytest

from lacuna.errors import SchemaError
from lacuna.splits import (assert_no_leakage, check_split_document, load_cohort,
                           make_splits, s1_groups)


def _pop(n=100):
    """Paired clones (i00k, i00k+1 share a cluster) that never span lineage,
    collection year or BioProject. All metadata is a function of the PAIR
    index (k//2) so clones nest inside every split dimension."""
    ids = [f"i{k:03d}" for k in range(n)]
    y = {i: (k % 4 == 0) for k, i in enumerate(ids)}
    # lineages: A = pairs 0-26 (54 ids), B = pairs 27-41 (30 ids),
    # rare = pairs 42-49 (16 ids, all < min_lineage -> OTHER)
    coarse = {i: ("A" if (k // 2) < 27 else
                  ("B" if (k // 2) < 42 else f"rare{(k // 2) % 7}"))
              for k, i in enumerate(ids)}
    dedup = {i: f"c{k // 2:02d}" for k, i in enumerate(ids)}
    year = {i: str(2015 + (k // 2) % 8) for k, i in enumerate(ids)}
    bp = {i: f"PRJNA{(k // 2) % 4}" for k, i in enumerate(ids)}
    org = {i: f"org{(k // 2) % 4}" for k, i in enumerate(ids)}
    return ids, y, coarse, dedup, bp, org, year


def test_make_splits_structure_and_no_leakage():
    ids, y, coarse, dedup, bp, org, year = _pop()
    doc = make_splits(ids, y, coarse, dedup, bp, org, year, seed=20261101)
    assert set(doc) >= {"S0", "S1", "S2", "S3"}
    assert len(doc["S0"]) == 2                       # 2 repeats
    # clone-aware greedy balancing: folds partition the ids, stay similar in
    # size and keep both classes (exact 20/20/20/20/20 is not guaranteed)
    for rep, folds in doc["S0"].items():
        sizes = [len(f) for f in folds]
        assert sum(sizes) == len(ids) and all(10 <= s <= 30 for s in sizes), sizes
        for f in folds:
            assert {y[i] for i in f} == {0, 1}       # stratification holds
    # small lineages merged into OTHER and never split
    assert set(doc["S1"]) == {"A", "B", "OTHER"}
    # S0 is clone-aware: no clonal cluster spans two folds of the same repeat
    for rep, folds in doc["S0"].items():
        seen = {}
        for j, f in enumerate(folds):
            for i in f:
                c = dedup[i]
                assert seen.get(c, j) == j, f"cluster {c} split across folds"
                seen[c] = j
    # S2 feasible (years present, >=20% test) and clone-consistent
    assert doc["S2"] is not None
    assert doc["S2"]["test"] and doc["S2"]["train"]
    # full audit: zero isolate and zero clonal-cluster overlap anywhere
    assert doc["_audit"] == []


def test_make_splits_s2_infeasible_without_years():
    ids, y, coarse, dedup, bp, org, _ = _pop()
    doc = make_splits(ids, y, coarse, dedup, bp, org, {}, seed=1)
    assert doc["S2"] is None
    assert "lack a collection year" in doc["S2_note"]


def test_check_split_document_detects_overlap():
    ids, y, coarse, dedup, bp, org, year = _pop()
    doc = make_splits(ids, y, coarse, dedup, bp, org, year, seed=1)
    # move i090 (lineage OTHER) into group A: isolate AND cluster overlap
    doc["S1"]["A"] = sorted(set(doc["S1"]["A"]) | {"i090"})
    problems = check_split_document(doc, ids, dedup)
    assert any("isolate overlap" in p for p in problems)
    assert any("dedup-cluster overlap" in p for p in problems)


def test_leakage_guard():
    ids = [f"i{k}" for k in range(10)]
    lineage = {i: "A" for i in ids}
    unique_clones = {i: f"clone{i}" for i in ids}
    assert_no_leakage(ids[:5], ids[5:], unique_clones)
    with pytest.raises(AssertionError, match="isolate leakage"):
        assert_no_leakage(ids[:5], ids[3:], unique_clones)
    shared = {i: "clone1" for i in ids}
    with pytest.raises(AssertionError, match="cluster leakage"):
        assert_no_leakage(ids[:5], ids[5:], shared)


def test_s1_groups_merges_small_lineages():
    ids = [f"i{k}" for k in range(40)]
    lineage = {i: ("A" if k < 30 else ("B" if k < 35 else f"x{k}"))
               for k, i in enumerate(ids)}
    g = s1_groups(ids, lineage, min_size=5)
    assert set(g) == {"A", "B", "OTHER"}
    assert len(g["OTHER"]) == 5


def test_load_cohort_schema(tmp_path):
    bad = tmp_path / "cohort.tsv"
    bad.write_text("biosample\tfoo\nS1\t1\n")
    with pytest.raises(SchemaError, match="cohort"):
        load_cohort(bad)
    good = tmp_path / "cohort2.tsv"
    good.write_text("biosample\tbioproject\tsubmitter_org\tdedup_cluster\tcoarse_lineage\n"
                    "S1\tPRJNA1\torg1\tc1\tA\n")
    c = load_cohort(good)
    assert c["S1"]["coarse_lineage"] == "A"
