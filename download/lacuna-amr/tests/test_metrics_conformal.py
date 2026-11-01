"""Metrics and conformal mechanics (synthetic data; deterministic seeds)."""
import numpy as np

from lacuna.conformal import (conformal_set, mondrian_quantiles, set_label)
from lacuna.metrics import ca_vme_me, cluster_bootstrap, coverage_block, ece, metrics_block


def test_ece_known_value():
    y = np.array([0, 1])
    p = np.array([0.25, 0.75])
    assert abs(ece(y, p) - 0.25) < 1e-9


def test_metrics_block_perfect():
    y = np.array([0, 0, 1, 1])
    p = np.array([0.1, 0.2, 0.8, 0.9])
    m = metrics_block(y, p, 0.5)
    assert m["AUROC"] == 1.0 and m["CA"] == 1.0
    assert m["VME"] == 0.0 and m["ME"] == 0.0
    # ECE of this configuration: each bin off by its distance from 0/1
    # (0.1+0.2+0.2+0.1)/4 = 0.15 — computed, not guessed
    assert abs(m["ECE"] - 0.15) < 1e-9


def test_cluster_bootstrap_brackets_point_estimate():
    rng = np.random.default_rng(11)
    y = (rng.random(200) > 0.5).astype(int)
    p = np.clip(y * 0.8 + 0.1 + rng.normal(0, 0.1, 200), 0, 1)
    cl = [f"c{i % 8}" for i in range(200)]
    ci = cluster_bootstrap(y, p, 0.5, cl, B=300, seed=42)
    from sklearn.metrics import roc_auc_score
    point = roc_auc_score(y, p)
    assert ci["AUROC"][0] <= point <= ci["AUROC"][1] + 1e-9


def test_coverage_block():
    y = [1, 0, 1, 0]
    sets = [[1], [0], [0, 1], []]
    cb = coverage_block(y, sets)
    assert cb["coverage_overall"] == 0.75
    assert cb["coverage_R"] == 1.0
    assert cb["coverage_S"] == 0.5
    assert cb["abstention"] == 0.25
    assert cb["mean_set_size"] == 1.0


def test_conformal_marginal_coverage_simulation():
    """Finite-sample quantile check: with exchangeable calibration scores the
    empirical marginal coverage must be near the 0.90 target (deterministic
    seed; statistical mechanics, not a data claim)."""
    rng = np.random.default_rng(2026)
    n_cal, n_test = 1000, 4000
    y = (rng.random(n_cal + n_test) > 0.5).astype(int)
    p1 = np.clip(0.5 + (y - 0.5) * 0.6 + rng.normal(0, 0.15, n_cal + n_test), 0.001, 0.999)
    proba = np.column_stack([1 - p1, p1])
    qd = mondrian_quantiles(proba[:n_cal], y[:n_cal], alpha=0.10)
    sets = [conformal_set(row, qd, "marginal") for row in proba[n_cal:]]
    yt = y[n_cal:]
    cov = float(np.mean([yt[i] in sets[i] for i in range(n_test)]))
    assert 0.85 <= cov <= 0.95, cov


def test_set_labels():
    assert set_label([]) == "ABSTAIN"
    assert set_label([0]) == "S"
    assert set_label([1]) == "R"
    assert set_label([0, 1]) == "S+R"


def test_ca_vme_me():
    m = ca_vme_me([1, 1, 0, 0], [1, 0, 0, 1])
    assert m == {"CA": 0.5, "VME": 0.5, "ME": 0.5, "n_R": 2, "n_S": 2}
