"""End-to-end CLI integration on the REAL pilot cohort already in this repo
(240 E. coli isolates, 11 BioProjects, EUCAST v16.1-derived labels, sealed
splits). Skipped when the research outputs are absent (e.g. sdist installs).

Numbers produced here are pilot-scale and carry no claims beyond the audit
itself; this test checks the application plumbing end to end.
"""
import json
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
HAVE_DATA = (REPO / "results" / "features.tsv").is_file() and \
    (REPO / "data" / "example_ast.tsv").is_file()

pytestmark = pytest.mark.skipif(
    not HAVE_DATA, reason="research cohort outputs not present in this checkout")

BP = REPO / "tests" / "fixtures" / "user_breakpoints.tsv"


def test_audit_dataset_real_cohort(tmp_path, capsys):
    from lacuna.cli import main
    out = tmp_path / "audit.json"
    rc = main(["audit-dataset", "--ast", str(REPO / "data" / "example_ast.tsv"),
               "--breakpoints", str(BP), "--out", str(out)])
    assert rc == 0
    doc = json.loads(out.read_text())
    capsys.readouterr()
    assert "ciprofloxacin" in doc["drugs"]
    cip = doc["drugs"]["ciprofloxacin"]
    # real example table: 60 ciprofloxacin isolates across 5 BioProjects,
    # EUCAST-derived 55 S / 5 R (checked against the table itself)
    assert cip["n_isolates"] == 60
    assert cip["n_bioprojects"] == 5
    assert cip["derived_labels_primary_rule"] == {"S": 55, "R": 5}
    # pilot cohort (n=60 labelled) must FAIL the full-scale DG thresholds —
    # the honest verdict, not a rubber stamp
    assert doc["drugs"]["ciprofloxacin"]["dg_verdict"] == "FAIL"
    assert doc["overall_verdict"] == "FAIL"
    # relaxed client thresholds must flip it to PASS (verdicts follow the
    # thresholds actually used)
    rc = main(["audit-dataset", "--ast", str(REPO / "data" / "example_ast.tsv"),
               "--breakpoints", str(BP), "--min-isolates", "50", "--min-R", "5",
               "--min-S", "5", "--min-bioprojects", "3", "--out", str(out)])
    assert rc == 0
    doc = json.loads(out.read_text())
    assert doc["drugs"]["ciprofloxacin"]["dg_verdict"] == "PASS"


def test_train_predict_validate_report_roundtrip(tmp_path, capsys):
    from lacuna.cli import main
    capsys.readouterr()
    model = tmp_path / "model.json"

    # ---- train (M0 + M1, frozen seed) on the real cohort ------------------
    rc = main(["train",
               "--features", str(REPO / "results" / "features.tsv"),
               "--labels", str(REPO / "results" / "tables" / "ast_labels_all.tsv"),
               "--cohort", str(REPO / "data" / "cohort.tsv"),
               "--m0-mapping", str(REPO / "results" / "m0_mapping.json"),
               "--drugs", "ciprofloxacin", "gentamicin", "ceftazidime",
               "--models", "M0", "M1", "--seed", "20261101",
               "--out", str(model)])
    assert rc == 0
    art = json.loads(model.read_text())
    assert art["lacuna_artefact"] == "lacuna-model/1"
    assert set(art["drugs"]) == {"ciprofloxacin", "gentamicin", "ceftazidime"}
    import math
    for d, e in art["drugs"].items():
        assert e["n_labelled"] > 50 and e["models"]["M1"]["threshold"] >= 0
        assert math.isfinite(e["models"]["M1"]["threshold"])
        assert len(e["m0_features"]) > 0
        assert e["default_model"] == "M1"  # reference model preferred over M2
    capsys.readouterr()

    # ---- predict on two real isolates ------------------------------------
    preds = tmp_path / "predictions.tsv"
    rc = main(["predict", "--model", str(model),
               "--features", str(REPO / "results" / "features.tsv"),
               "--isolate", "SAMN31087230", "SAMN20200276",
               "--out", str(preds)])
    assert rc == 0
    lines = preds.read_text().splitlines()
    hdr = [ln for ln in lines if not ln.startswith("#")]
    assert hdr[0].split("\t") == ["biosample", "drug", "determinants", "m0_call",
                                  "model_type", "p_S", "p_R", "call",
                                  "conformal_set", "threshold"]
    rows = [ln.split("\t") for ln in hdr[1:]]
    assert len(rows) == 6  # 2 isolates x 3 drugs
    for r in rows:
        assert r[8] in ("S", "R", "S+R", "ABSTAIN")
        assert 0.0 <= float(r[6]) <= 1.0
    capsys.readouterr()

    # ---- validate against the sealed research splits (ciprofloxacin) -----
    val = tmp_path / "validation.json"
    rc = main(["validate", "--model", str(model),
               "--features", str(REPO / "results" / "features.tsv"),
               "--labels", str(REPO / "results" / "tables" / "ast_labels_all.tsv"),
               "--splits", str(REPO / "results" / "splits"),
               "--drugs", "ciprofloxacin", "--models", "M0", "M1",
               "--boot", "20", "--seed", "20261101", "--out", str(val)])
    assert rc == 0
    doc = json.loads(val.read_text())
    assert "_meta" in doc and "drugs" in doc
    cip = doc["drugs"]["ciprofloxacin"]
    assert cip["n"] == 178 and cip["n_R"] == 17
    assert len(cip["S0"]) == 10            # 2 reps x 5 folds
    assert cip["S1"] and cip["S3"]
    # The sealed pilot splits were isolate-stratified: the audit must report
    # the clonal-cluster overlap they contain (gates/G3.md: 15 problems for
    # ciprofloxacin) while confirming zero isolate overlap — the honest
    # verdict the research summary initially mis-stated (corrected, D-018).
    probs = cip["split_audit_problems"]
    assert probs and not any("isolate overlap" in p for p in probs)
    assert any("dedup-cluster overlap" in p for p in probs)
    assert "M1" in cip["S0_mean_coverage"]     # conformal calibrated
    assert 0.0 <= cip["S0_mean_coverage"]["M1"] <= 1.0
    # predictions + summary side-outputs
    assert (tmp_path / "validation_predictions.tsv").is_file()
    summary = (tmp_path / "validation_summary.txt").read_text()
    assert "ciprofloxacin" in summary and "AUROC" in summary
    capsys.readouterr()

    # ---- report bundles everything (self-contained HTML) ------------------
    rep = tmp_path / "report.html"
    rc = main(["report", "--inputs", str(val), str(preds), str(model),
               "--title", "lacuna integration test report", "--out", str(rep)])
    assert rc == 0
    html = rep.read_text()
    assert "RESEARCH USE ONLY" in html
    assert "Validation results" in html and "integration test report" in html
    assert "http://" not in html and "https://" not in html  # no external assets


def test_manifest_and_sbom(tmp_path, capsys):
    from lacuna.cli import main
    man = tmp_path / "manifest.tsv"
    sbom = tmp_path / "sbom.json"
    rc = main(["manifest", "--paths", str(REPO / "LICENSE"), str(REPO / "NOTICE"),
               "--base", str(REPO), "--out", str(man), "--sbom", str(sbom)])
    assert rc == 0
    lines = man.read_text().splitlines()
    assert lines[0].split("\t") == ["path", "sha256", "bytes"]
    assert len(lines) == 3
    doc = json.loads(sbom.read_text())
    assert doc["spdxVersion"] == "SPDX-2.3"
    assert doc["packages"][0]["versionInfo"] == "0.2.0"
    assert any(p["name"] == "scikit-learn" for p in doc["packages"])


def test_license_check_command(capsys):
    from lacuna.cli import main
    assert main(["license-check"]) == 0
    out = capsys.readouterr().out
    assert "license-check: OK" in out
    assert "AMRFinderPlus" in out
