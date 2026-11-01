"""Pipeline-level regression tests.

The alignment regression below encodes a real bug found during v0.2.0
hardening: ``matrix_to_arrays`` returns isolates in sorted order while the
calibration carve-out produced unsorted id lists; indexing y/groups by the
unsorted order scrambled train/test alignment and drove S0 AUROC from ~0.98 to
~0.5 on the real cohort. Deterministic informative data must therefore
evaluate near-perfectly.
"""
import numpy as np

from lacuna.pipeline import auto_splits, evaluate_splits
from lacuna.splits import make_splits


def _informative(n=120):
    """Deterministic, perfectly separable presence/absence dataset."""
    isos = [f"S{i:03d}" for i in range(n)]
    mat, y, lineage, cluster = {}, {}, {}, {}
    for k, iso in enumerate(isos):
        det = (k % 3 == 0)          # 40 R / 80 S, fully separable by gene:det
        mat[iso] = {"gene:det"} if det else {"gene:other"}
        y[iso] = int(det)
        lineage[iso] = "L1" if k % 2 == 0 else "L2"
        cluster[iso] = f"c{k:03d}"
    return isos, mat, y, lineage, cluster


def test_evaluate_splits_alignment_regression():
    isos, mat, y, lineage, cluster = _informative()
    sp = make_splits(isos, y, lineage, cluster,
                     {i: "PRJNA1" for i in isos}, {i: "org1" for i in isos},
                     {i: "2020" for i in isos}, seed=1)
    doc = evaluate_splits(mat, {"drugx": y}, {"drugx": sp},
                          {"lineage": lineage, "cluster": cluster},
                          {"drugx": ["gene:det"]},
                          model_types=("M0", "M1"), seed=20261101, boot=0)
    res = doc["results"]["drugx"]
    for mt in ("M0", "M1"):
        aucs = [b[mt]["metrics"]["AUROC"] for b in res["S0"] if mt in b]
        assert aucs and float(np.mean(aucs)) >= 0.95, (mt, aucs)
    # predictions rows must carry the true label of the right isolate
    for r in doc["predictions"]:
        assert r["y"] == y[r["biosample"]]
    # the split audit must be clean (singletons, clone-consistent metadata)
    assert res["split_audit_problems"] == []
    # calibration happened and conformal sets are well-formed
    assert "M1" in res["S0_mean_coverage"]
    for b in res["S0"]:
        for s in (b["M1"]["conformal_mondrian"],):
            assert 0.0 <= s["coverage_overall"] <= 1.0


def test_auto_splits_generate_clone_aware():
    isos, mat, y, lineage, cluster = _informative(100)
    meta = {"lineage": lineage, "cluster": cluster,
            "bioproject": {i: "PRJNA1" for i in isos},
            "org": {i: "org1" for i in isos},
            "year": {i: "2020" for i in isos}}
    out = auto_splits({"drugx": y}, meta, seed=1)
    assert "drugx" in out
    sp = out["drugx"]
    # clone-aware S0: no cluster spans two folds of the same repeat
    for rep, folds in sp["S0"].items():
        seen = {}
        for j, f in enumerate(folds):
            for i in f:
                c = cluster[i]
                assert seen.get(c, j) == j
                seen[c] = j
    assert sp["_audit"] == []
