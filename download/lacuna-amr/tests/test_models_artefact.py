"""Model artefact integrity: round-trip, checksum tamper detection, version
guard, prediction mechanics. Synthetic data only — these are mechanics tests
of the container, not scientific claims."""
import numpy as np
import pytest

from lacuna.errors import ArtefactError
from lacuna.models import (ModelArtefact, _payload_hash, encode_model,
                           fit_calibrated, training_hash)


def _synthetic(n=120, seed=7):
    rng = np.random.default_rng(seed)
    X = rng.random((n, 10))
    y = (X[:, 0] + X[:, 1] > 1.0).astype(int)
    # two lineage groups, disjoint blocks
    groups = (["L1"] * (n // 2)) + (["L2"] * (n - n // 2))
    return X, y, groups


def test_fit_calibrated_m1():
    X, y, g = _synthetic()
    fit = fit_calibrated("M1", X, y, g, seed=20261101)
    assert 0.0 <= fit["threshold"] <= 1.0
    assert fit["quantiles"]["mondrian"][0] <= 2.0
    assert fit["calibration"]["n_cal"] > 0
    p = fit["model"].predict_proba(X)[:, 1]
    assert ((p >= 0) & (p <= 1)).all()


def test_artefact_roundtrip(tmp_path):
    from lacuna.pipeline import train_artefact
    rng = np.random.default_rng(3)
    isos = [f"S{i:03d}" for i in range(120)]
    mat = {iso: {f"gene:g{j}": 1 for j in rng.choice(10, 4, replace=False).tolist()}
           for iso in isos}
    y = {iso: int(rng.random() < (0.7 if "g0" in mat[iso] else 0.1)) for iso in isos}
    labels = {"drugx": y}
    meta = {"lineage": {i: ("A" if k < 60 else "B") for k, i in enumerate(isos)},
            "cluster": {i: i for i in isos}, "bioproject": {}, "org": {}, "year": {}}
    artefact, notes = train_artefact(mat, labels, meta, {"drugx": ["gene:g0"]},
                                     model_types=("M0", "M1"), seed=20261101)
    p = tmp_path / "model.json"
    artefact.save(p)
    loaded = ModelArtefact.load(p)
    assert set(loaded.drugs) == {"drugx"}
    assert loaded.model_types("drugx") == ["M1"]
    assert loaded.drug("drugx")["m0_features"] == ["gene:g0"]
    # predictions: probability + set
    X = np.zeros((1, len(loaded.feature_order("drugx"))))
    X[0, loaded.feature_order("drugx").index("gene:g0")] = 1.0
    r = loaded.predict_drug("drugx", X)[0]
    assert 0 <= r["p_R"] <= 1
    assert r["set"] in ([0], [1], [0, 1], [])


def test_artefact_tamper_detected(tmp_path):
    from lacuna.pipeline import train_artefact
    rng = np.random.default_rng(3)
    isos = [f"S{i:03d}" for i in range(80)]
    mat = {iso: (({"gene:g0"} if rng.random() < 0.5 else set())
                 | ({"gene:g1"} if rng.random() < 0.3 else set())) for iso in isos}
    y = {iso: int("gene:g0" in mat[iso]) for iso in isos}
    meta = {"lineage": {i: ("A" if k < 40 else "B") for k, i in enumerate(isos)},
            "cluster": {i: i for i in isos}}
    artefact, _ = train_artefact(mat, {"drugx": y}, meta, {"drugx": ["gene:g0"]},
                                 model_types=("M0", "M1"), seed=1)
    p = tmp_path / "model.json"
    artefact.save(p)
    loaded = ModelArtefact.load(p)
    # tamper with a metadata field (as an attacker would) and re-save
    loaded.doc["drugs"]["drugx"]["n_R"] += 5
    loaded.save(p)
    with pytest.raises(ArtefactError, match="checksum"):
        ModelArtefact.load(p)


def test_artefact_version_guard(tmp_path):
    from lacuna.pipeline import train_artefact
    rng = np.random.default_rng(3)
    isos = [f"S{i:03d}" for i in range(80)]
    mat = {iso: ({"gene:g0"} if rng.random() < 0.5 else set()) for iso in isos}
    y = {iso: int("gene:g0" in mat[iso]) for iso in isos}
    meta = {"lineage": {i: ("A" if k < 40 else "B") for k, i in enumerate(isos)},
            "cluster": {i: i for i in isos}}
    artefact, _ = train_artefact(mat, {"drugx": y}, meta, {"drugx": []},
                                 model_types=("M0", "M1"), seed=1)
    artefact.doc["sklearn_version"] = "0.0-fake"
    artefact.doc["payload_sha256"] = _payload_hash(artefact.doc)  # attacker re-hashes
    p = tmp_path / "model.json"
    artefact.save(p)
    with pytest.raises(ArtefactError, match="sklearn"):
        ModelArtefact.load(p)
    loaded = ModelArtefact.load(p, allow_version_mismatch=True)  # explicit override
    assert "drugx" in loaded.drugs


def test_encode_model_roundtrip():
    from sklearn.linear_model import LogisticRegression
    X, y, _ = _synthetic(60)
    m = LogisticRegression().fit(X, y)
    b64, sha = encode_model(m)
    import base64, hashlib, pickle
    raw = base64.b64decode(b64)
    assert hashlib.sha256(raw).hexdigest() == sha
    m2 = pickle.loads(raw)
    assert (m2.predict(X) == m.predict(X)).all()


def test_training_hash_deterministic():
    h1 = training_hash([("a", 1), ("b", 0)])
    h2 = training_hash([("b", 0), ("a", 1)])
    assert h1 == h2 and len(h1) == 64
