#!/usr/bin/env python3
"""Bisect the gentamicin fold-2 divergence: carve-out, tuning, calibration."""
import json
import sys
from collections import defaultdict
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score

ROOT = Path("/home/z/my-project/download/lacuna-amr")
sys.path.insert(0, str(ROOT / "src"))
SEED = 20261101

feats = pd.read_csv(ROOT / "results/features.tsv", sep="\t", index_col=0)
cohort = pd.read_csv(ROOT / "data/cohort.tsv", sep="\t")
coarse = dict(zip(cohort["biosample"], cohort["coarse_lineage"]))
labels = pd.read_csv(ROOT / "results/tables/ast_labels_all.tsv", sep="\t")
sp = json.loads((ROOT / "results/splits/gentamicin.json").read_text())
ymap = {r.biosample: int(r.label_eucast == "R") for r in labels.itertuples()
        if r.drug == "gentamicin" and r.label_eucast in ("S", "R")
        and r.biosample in feats.index}

fold = sp["S0"]["rep0"][2]
rest = [i for jj, ff in enumerate(sp["S0"]["rep0"]) if jj != 2 for i in ff]
test_ids = [i for i in fold if i in ymap]
train_ids = [i for i in rest if i in ymap]

# ---- stage6 carve-out ----
groups_tr = defaultdict(list)
for i in train_ids:
    groups_tr[coarse[i]].append(i)
gkeys = sorted(groups_tr, key=lambda g: -len(groups_tr[g]))
cal_g, tr_g = [], []
cal_target = 0.2 * len(train_ids)
for g in gkeys:
    if sum(len(groups_tr[x]) for x in cal_g) < cal_target and len(gkeys) > 2:
        cal_g.append(g)
    else:
        tr_g.append(g)
tr_s6 = [i for g in tr_g for i in groups_tr[g]]
cal_s6 = [i for g in cal_g for i in groups_tr[g]]

# ---- lacuna carve-out ----
from lacuna.models import calibration_carveout, tune_fit
tr_l, cal_l = calibration_carveout(train_ids,
                                   {i: str(coarse[i]) for i in train_ids}, 0.2)
print("carve-out identical:", tr_l == tr_s6, cal_l == cal_s6)
print("  sizes tr/cal:", len(tr_s6), len(cal_s6), "| groups tr:",
      sorted({coarse[i] for i in tr_s6}), "cal:", sorted({coarse[i] for i in cal_s6}))

# ---- tune on both (same function, same data) ----
Xtr = feats.loc[tr_s6].values.astype(np.float64)
ytr = np.array([ymap[i] for i in tr_s6])
gtr = [coarse[i] for i in tr_s6]
m1 = tune_fit("M1", Xtr, ytr, gtr, SEED)
m2 = tune_fit("M1", Xtr, ytr, gtr, SEED)
print("tune_fit deterministic:", (m1.coef_ == m2.coef_).all(),
      "| C =", m1.C)

# ---- full stage6 pipeline for this fold ----
base = tune_fit("M1", Xtr, ytr, gtr, SEED)
Xcal = feats.loc[cal_s6].values.astype(np.float64)
ycal = np.array([ymap[i] for i in cal_s6])
Xte = feats.loc[test_ids].values.astype(np.float64)
yte = np.array([ymap[i] for i in test_ids])
cal_m = CalibratedClassifierCV(base, method="sigmoid", cv="prefit")
cal_m.fit(Xcal, ycal)
p_s6 = cal_m.predict_proba(Xte)[:, 1]
print("stage6-style fold2 AUROC:", round(roc_auc_score(yte, p_s6), 4))

# ---- lacuna pipeline path ----
from lacuna.features import load_feature_matrix
from lacuna.pipeline import _arrays_in_order, evaluate_splits
mat = load_feature_matrix(ROOT / "results/features.tsv")
fo = sorted({f for d in mat.values() for f in d})
print("feature order == file columns:",
      fo == list(feats.columns))
doc = evaluate_splits(mat, {"gentamicin": ymap},
                      {"gentamicin": sp},
                      {"lineage": coarse, "cluster": {}},
                      {"gentamicin": []}, model_types=("M1",), seed=SEED, boot=0)
b = doc["results"]["gentamicin"]["S0"][2]
print("lacuna fold2 AUROC:", round(b["M1"]["metrics"]["AUROC"], 4))
mr = json.loads((ROOT / "results/evaluation/main_results.json").read_text())
print("research fold2 AUROC:",
      round(mr["gentamicin"]["S0"][2]["M1"]["metrics"]["AUROC"], 4))
