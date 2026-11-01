"""Tests for lacuna. All scientific fixtures are verbatim excerpts of records
downloaded during the project run (see fixtures/FIXTURE_MANIFEST.tsv)."""
import hashlib
from pathlib import Path

import pytest

from lacuna import (
    Breakpoints, assert_no_leakage, ca_vme_me, classify_ast_row, conformal_set,
    derive_labels, features_from_amrfinder, mondrian_quantiles, parse_biosample_antibiogram,
    s1_groups)

FIX = Path(__file__).parent / "fixtures"


def _sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def test_fixture_integrity():
    """Fixtures must be the verbatim captured records (checksummed)."""
    man = {}
    for line in (FIX / "FIXTURE_MANIFEST.tsv").read_text().splitlines()[1:]:
        f = line.split("\t")
        man[f[0]] = f[1]
    for name, sha in man.items():
        assert _sha(FIX / name) == sha, f"fixture {name} modified"


def test_breakpoint_censoring_semantics():
    bp = Breakpoints.load(FIX / "user_breakpoints.tsv")
    # ciprofloxacin S<=0.25 R>0.5
    assert bp.label("ciprofloxacin", "", 0.25) == "S"
    # ciprofloxacin S<=0.25 R>0.5: MIC exactly 0.5 is intermediate (R requires > 0.5)
    assert bp.label("ciprofloxacin", "", 0.5) == "I"
    assert bp.label("ciprofloxacin", "", 1.0) == "R"
    assert bp.label("ciprofloxacin", "", 0.4) == "I"
    assert bp.label("ciprofloxacin", ">", 0.5) == "R"      # open interval at breakpoint
    assert bp.label("ciprofloxacin", ">=", 0.5) == "INDETERMINATE_CENSORED"
    assert bp.label("ceftazidime", ">", 4) == "R"
    assert bp.label("ciprofloxacin", "<=", 0.25) == "S"
    assert bp.label("ciprofloxacin", "<", 0.3) == "INDETERMINATE_CENSORED"


def test_row_classification():
    assert classify_ast_row("MIC", "Sensititre", "mg/L", "4") == "primary_rule"
    assert classify_ast_row("MIC", "Vitek", "mg/L", "4") == "excluded_platform"
    assert classify_ast_row("", "", "mg/L", "4") == "primary_rule"
    assert classify_ast_row("disk diffusion", "", "mm", "20") == "not_quantitative"
    assert classify_ast_row("E-test", "", "mg/L", "2") == "excluded_platform"


def test_parse_real_record():
    doc = parse_biosample_antibiogram((FIX / "SAMN31087230_biosample.xml").read_text())
    s = doc["samples"][0]
    assert s["accession"] == "SAMN31087230"
    assert len(s["rows"]) >= 5
    drugs = {r["antibiotic"].lower() for r in s["rows"]}
    assert "ciprofloxacin" in drugs and "gentamicin" in drugs
    labels = derive_labels(s, Breakpoints.load(FIX / "user_breakpoints.tsv"),
                           ["ciprofloxacin", "gentamicin"])
    for d, e in labels.items():
        assert e["label"] in ("S", "R", "I", "INDETERMINATE_CENSORED", "CONFLICTED", None), (d, e)


def test_features_from_real_amrfinder_output():
    f = features_from_amrfinder([FIX / "SAMN03177617_amrfinder.tsv"])
    assert "SAMN03177617" in f
    feats = f["SAMN03177617"]
    assert any(x.startswith("gene:") for x in feats)
    # at least one feature must carry a Class/Subclass style element symbol
    assert len(feats) >= 1


def test_metrics():
    m = ca_vme_me([1, 1, 0, 0], [1, 0, 0, 1])
    assert m["CA"] == 0.5
    assert m["VME"] == 0.5
    assert m["ME"] == 0.5


def test_conformal_mondrian():
    import numpy as np
    p = np.array([[0.8, 0.2], [0.3, 0.7], [0.9, 0.1], [0.2, 0.8]])
    y = np.array([1, 1, 0, 0])
    q = mondrian_quantiles(p, y, alpha=0.10)
    assert 0.0 <= q["mondrian"][0] <= 2.0
    s = conformal_set(np.array([0.85, 0.15]), q, "mondrian")
    assert isinstance(s, list)


def test_splits_and_leakage():
    ids = [f"i{k}" for k in range(40)]
    lineage = {i: ("A" if k < 30 else ("B" if k < 35 else f"x{k}")) for k, i in enumerate(ids)}
    g = s1_groups(ids, lineage, min_size=5)
    assert set(g) == {"A", "B", "OTHER"}
    assert_no_leakage(g["A"], g["B"], lineage)
    with pytest.raises(AssertionError):
        assert_no_leakage(ids[:10], ids[:10], lineage)
    cl = {i: "c1" for i in ids}
    with pytest.raises(AssertionError):
        assert_no_leakage(ids[:20], ids[20:], cl)
