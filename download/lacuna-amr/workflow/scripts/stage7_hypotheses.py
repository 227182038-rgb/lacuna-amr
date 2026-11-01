#!/usr/bin/env python3
"""Stage 7: pre-registered hypotheses H1-H4 + gate G5 (seed reproduction) +
exploratory H3-secondary diagnostics. Reads sealed splits (opened once) and
predictions from stage 6. Writes results/evaluation/hypotheses.json,
gates/G5.md."""
import json
import warnings
from collections import defaultdict
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import binomtest

warnings.filterwarnings("ignore")
ROOT = Path(__file__).resolve().parents[2]
RES = ROOT / "results"
EVAL = RES / "evaluation"
DRUGS = ["ciprofloxacin", "gentamicin", "ceftazidime"]
SEED = 20261101
SEED2 = 42
BOOT = 2000

preds = pd.read_csv(RES / "predictions.tsv", sep="\t", dtype={"set": str}, keep_default_na=False)
feats = pd.read_csv(RES / "features.tsv", sep="\t", index_col=0)
cohort = pd.read_csv(ROOT / "data" / "cohort.tsv", sep="\t")
coarse = dict(zip(cohort["biosample"], cohort["coarse_lineage"]))
bioproject = dict(zip(cohort["biosample"], cohort["bioproject"]))
labels_raw = pd.read_csv(RES / "tables" / "ast_labels_all.tsv", sep="\t")
year = {}
for r in labels_raw.itertuples():
    year[r.biosample] = r.year
splits = {d: json.loads((RES / "splits" / f"{d}.json").read_text()) for d in DRUGS}
m0map = json.loads((RES / "m0_mapping.json").read_text())["feature_sets"]
main = json.loads((EVAL / "main_results.json").read_text())

sim = np.load(ROOT / "data" / "sigs" / "cmp")
siglabels = [Path(l.strip()).name.replace(".fna.gz", "")
             for l in (ROOT / "data" / "sigs" / "cmp.labels.txt").read_text().splitlines()]
spos = {b: i for i, b in enumerate(siglabels)}
dist = 1.0 - sim

hyp = {"H1": {}, "H2": {}, "H3": {}, "H4": {}, "G5": {}}
G5_lines = ["# G5 — Model integrity (seed reproduction + tuning isolation)", ""]

rng = np.random.default_rng(SEED)


def auroc(y, p):
    y, p = np.asarray(y), np.asarray(p)
    if len(set(y)) < 2:
        return None
    from sklearn.metrics import roc_auc_score
    return float(roc_auc_score(y, p))


def pooled(drug, split_prefix, model):
    d = preds[(preds["drug"] == drug) & (preds["model"] == model)
              & (preds["split"].str.startswith(split_prefix))]
    return dict(zip(d["biosample"], d["p"])), dict(zip(d["biosample"], d["y"]))


for drug in DRUGS:
    # ---------- H1: optimism ----------
    h1 = {}
    for mt in ("M1", "M2"):
        p0, y0 = pooled(drug, "S0_", mt)
        for sp_name, prefix in [("S1", "S1_"), ("S2", "S2"), ("S3", "S3_")]:
            px, yx = pooled(drug, prefix, mt)
            common = [i for i in px if i in p0]
            if len(common) < 10 or len(set(yx[i] for i in common)) < 2:
                h1[f"{mt}_{sp_name}"] = {"n_common": len(common), "note": "insufficient overlap"}
                continue
            # paired cluster bootstrap over coarse lineages
            deltas = []
            clusters = np.array([coarse[i] for i in common])
            uniq = np.unique(clusters)
            idx_by = {c: np.where(clusters == c)[0] for c in uniq}
            for _ in range(BOOT):
                pick = rng.choice(uniq, size=len(uniq), replace=True)
                idx = np.concatenate([idx_by[c] for c in pick])
                ii = [common[j] for j in idx]
                a0 = auroc([y0[i] for i in ii], [p0[i] for i in ii])
                ax = auroc([yx[i] for i in ii], [px[i] for i in ii])
                if a0 is not None and ax is not None:
                    deltas.append(ax - a0)
            a0 = auroc([y0[i] for i in common], [p0[i] for i in common])
            ax = auroc([yx[i] for i in common], [px[i] for i in common])
            h1[f"{mt}_{sp_name}"] = {
                "n_common": len(common), "AUROC_S0": a0, "AUROC_split": ax,
                "delta": ax - a0 if (a0 is not None and ax is not None) else None,
                "delta_ci95": [float(np.percentile(deltas, 2.5)),
                               float(np.percentile(deltas, 97.5))] if deltas else None}
    hyp["H1"][drug] = h1

    # ---------- H4: unexplained resistant fraction (ALL resistant isolates) ----------
    m0_feats = [f for f in m0map[drug] if f in feats.columns]
    sub = labels_raw[(labels_raw["drug"] == drug) & (labels_raw["label_eucast"] == "R")]
    rids = [r.biosample for r in sub.itertuples() if r.biosample in feats.index]
    if rids:
        m0hit = (feats.loc[rids, m0_feats].sum(axis=1) > 0) if m0_feats else pd.Series(False, index=rids)
        unexplained = int((~m0hit).sum())
        n = len(rids)
        ci = binomtest(unexplained, n).proportion_ci(0.95)
        hyp["H4"][drug] = {"n_resistant": n, "n_unexplained": unexplained,
                           "fraction": unexplained / n,
                           "ci95": [float(ci.low), float(ci.high)]}
    else:
        hyp["H4"][drug] = {"note": "no resistant isolates"}

# ---------- H3: coverage under shift ----------
for drug in DRUGS:
    h3 = {}
    for mt in ("M1", "M2"):
        p0, y0 = pooled(drug, "S0_", mt)
        sets0 = preds[(preds["drug"] == drug) & (preds["model"] == mt)
                      & (preds["split"].str.startswith("S0_"))]
        s0_by_iso = defaultdict(list)
        for r in sets0.itertuples():
            s0_by_iso[r.biosample].append(str(r.set))
        for sp_name in ("S1", "S2", "S3"):
            sp = splits[drug]
            units = {}
            if sp_name == "S1":
                units = sp["S1"]
            elif sp_name == "S2" and sp["S2"]:
                test_ids = sp["S2"]["test"]
                train_ids = set(sp["S2"]["train"])
                by_year = defaultdict(list)
                for i in test_ids:
                    by_year[str(year.get(i, ""))].append(i)
                units = by_year
            elif sp_name == "S3":
                units = sp["S3"]
            if not units:
                continue
            unit_cov = {}
            for uk, uids in units.items():
                d = preds[(preds["drug"] == drug) & (preds["model"] == mt)
                          & (preds["split"].str.startswith(sp_name + "_"))]
                d = d[d["biosample"].isin(uids)]
                rr = d[d["y"] == 1]
                if len(d) < 30 or len(rr) < 5:
                    unit_cov[uk] = {"n": len(d), "n_R": len(rr), "skip": "unit<30 or R<5"}
                    continue
                covR = float(rr["set"].str.contains("1").mean())
                # S0 coverage on the same isolates (pooled over reps)
                s0c = []
                for i in rr["biosample"]:
                    for s in s0_by_iso.get(i, []):
                        s0c.append("1" in s)
                s0_covR = float(np.mean(s0c)) if s0c else None
                unit_cov[uk] = {"n": len(d), "n_R": len(rr), "coverage_R_split": covR,
                                "coverage_R_S0_same_isolates": s0_covR}
            elig = {k: v for k, v in unit_cov.items() if "coverage_R_split" in v}
            if elig:
                frac_below = float(np.mean([v["coverage_R_split"] < 0.85 for v in elig.values()]))
                s0_fracs = [v["coverage_R_S0_same_isolates"] for v in elig.values()
                            if v["coverage_R_S0_same_isolates"] is not None]
                h3[f"{mt}_{sp_name}"] = {
                    "units": unit_cov, "n_units": len(elig),
                    "frac_units_R_coverage_below_0.85": frac_below,
                    "frac_units_R_coverage_below_0.85_S0_same_isolates":
                        float(np.mean([f < 0.85 for f in s0_fracs])) if s0_fracs else None,
                    "note": "descriptive: number of units at pilot scale is small; no formal test"}
    # exploratory: nearest-training distance for S1 units (M1)
    px, yx = pooled(drug, "S1_", "M1")
    d1 = preds[(preds["drug"] == drug) & (preds["model"] == "M1")
               & (preds["split"].str.startswith("S1_"))]
    nd = {}
    for uk, uids in splits[drug]["S1"].items():
        train_ids = [i for kk, vv in splits[drug]["S1"].items() if kk != uk for i in vv]
        train_ids = [i for i in train_ids if i in spos]
        testi = [i for i in uids if i in spos]
        if not train_ids or not testi:
            continue
        dm = dist[np.ix_([spos[i] for i in testi], [spos[i] for i in train_ids])]
        nd[uk] = float(np.mean(np.min(dm, axis=1)))
    h3["nearest_train_distance_S1_units"] = nd
    hyp["H3"][drug] = h3

# ---------- H2: submitter labels vs EUCAST labels (same isolates) ----------
from sklearn.calibration import CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, StratifiedGroupKFold
from sklearn.metrics import roc_curve

for drug in DRUGS:
    sub = labels_raw[(labels_raw["drug"] == drug)]
    ym = {}
    for r in sub.itertuples():
        if r.biosample not in feats.index:
            continue
        if r.label_eucast == "R":
            ym[r.biosample] = ("eucast", 1)
        elif r.label_eucast == "S":
            ym[r.biosample] = ("eucast", 0)
        ph = str(r.submitter_phenotypes)
        if "resistant" in ph.lower():
            ym[r.biosample] = ym.get(r.biosample, (None, None)) + ("submitter", 1)
        elif "susceptible" in ph.lower() and "non" not in ph.lower():
            ym[r.biosample] = ym.get(r.biosample, (None, None)) + ("submitter", 0)
    both = [b for b, v in ym.items() if len(v) == 4 and v[0] == "eucast" and v[2] == "submitter"]
    h2 = {"n_both_labels": len(both)}
    sp = splits[drug]
    for rep in range(1):  # rep0 only (pre-registered ablation, S0)
        for src, idx in [("eucast", 1), ("submitter", 3)]:
            yy = {b: ym[b][idx] for b in both}
            vmes, mes, aucs = [], [], []
            for j, fold in enumerate(sp["S0"]["rep0"]):
                test = [i for i in fold if i in yy]
                train = [i for i in both if i not in set(fold)]
                if not test or len(set(yy[i] for i in train)) < 2:
                    continue
                Xtr, ytr = feats.loc[train].values, np.array([yy[i] for i in train])
                Xte, yte = feats.loc[test].values, np.array([yy[i] for i in test])
                gtr = [coarse[i] for i in train]
                cv = StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=SEED)
                gs = GridSearchCV(LogisticRegression(max_iter=5000, class_weight="balanced"),
                                  {"C": [0.01, 0.1, 1, 10]}, scoring="roc_auc", cv=cv)
                gs.fit(Xtr, ytr, groups=gtr)
                p = gs.predict_proba(Xte)[:, 1]
                fpr, tpr, th = roc_curve(ytr, gs.predict_proba(Xtr)[:, 1])
                thr = float(th[np.argmax(tpr - fpr)])
                pred = (p >= thr).astype(int)
                r_ = yte == 1
                s_ = yte == 0
                if r_.sum():
                    vmes.append((pred[r_] == 0).mean())
                if s_.sum():
                    mes.append((pred[s_] == 1).mean())
                if len(set(yte)) == 2:
                    aucs.append(auroc(yte, p))
            h2[src] = {"VME": float(np.mean(vmes)) if vmes else None,
                       "ME": float(np.mean(mes)) if mes else None,
                       "AUROC": float(np.mean(aucs)) if aucs else None}
    d_vme = (h2["eucast"]["VME"] - h2["submitter"]["VME"]) if (h2["eucast"]["VME"] is not None and h2["submitter"]["VME"] is not None) else None
    d_me = (h2["eucast"]["ME"] - h2["submitter"]["ME"]) if (h2["eucast"]["ME"] is not None and h2["submitter"]["ME"] is not None) else None
    h2["delta_VME_eucast_minus_submitter"] = d_vme
    h2["delta_ME_eucast_minus_submitter"] = d_me
    h2["H2_criterion_ge2pp"] = bool((d_vme is not None and abs(d_vme) >= 0.02) or
                                    (d_me is not None and abs(d_me) >= 0.02))
    hyp["H2"][drug] = h2

# ---------- G5: seed reproduction ----------
for drug in DRUGS:
    ymap = {}
    sub = labels_raw[(labels_raw["drug"] == drug) & (labels_raw["label_eucast"].isin(["S", "R"]))]
    for r in sub.itertuples():
        if r.biosample in feats.index:
            ymap[r.biosample] = int(r.label_eucast == "R")
    sp = splits[drug]
    aucs = {}
    for seed, tag in [(SEED, "seed1"), (SEED2, "seed2")]:
        fold_aucs = []
        for j, fold in enumerate(sp["S0"]["rep0"]):
            test = [i for i in fold if i in ymap]
            train = [i for i in ymap if i not in set(fold)]
            if len(set(ymap[i] for i in train)) < 2 or len(set(ymap[i] for i in test)) < 2:
                continue
            cv = StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=seed)
            gs = GridSearchCV(LogisticRegression(max_iter=5000, class_weight="balanced",
                                                 random_state=seed),
                              {"C": [0.01, 0.1, 1, 10]}, scoring="roc_auc", cv=cv)
            gs.fit(feats.loc[train].values, np.array([ymap[i] for i in train]),
                   groups=[coarse[i] for i in train])
            p = gs.predict_proba(feats.loc[test].values)[:, 1]
            a = auroc([ymap[i] for i in test], p)
            if a is not None:
                fold_aucs.append(a)
        aucs[tag] = float(np.mean(fold_aucs)) if fold_aucs else None
    diff = abs(aucs["seed1"] - aucs["seed2"]) if (aucs["seed1"] and aucs["seed2"]) else None
    hyp["G5"][drug] = aucs
    ok = diff is not None and diff <= 0.01
    G5_lines.append(f"- {drug}: AUROC seed1={aucs['seed1']} seed2={aucs['seed2']} |diff|="
                    f"{None if diff is None else round(diff, 4)} -> {'OK' if ok else 'CHECK'} "
                    f"(tolerance 0.01)")
    # tuning never touched test partitions: all GridSearchCV calls above used training folds only
G5_lines.append("")
G5_lines.append("Tuning isolation: nested tuning used training folds only (GridSearchCV on train "
                "splits with lineage groups); sealed split files opened once per evaluation.")
G5_lines.append("Verdict: see per-drug lines (OK requires |ΔAUROC| ≤ 0.01).")
(ROOT / "gates" / "G5.md").write_text("\n".join(G5_lines))
(EVAL / "hypotheses.json").write_text(json.dumps(hyp, indent=1, default=str))
print("H1 ciprofloxacin M1_S1:", json.dumps(hyp["H1"]["ciprofloxacin"].get("M1_S1"), indent=1))
print("H4:", json.dumps(hyp["H4"], indent=1))
print("H2 deltas:", {d: (hyp["H2"][d]["delta_VME_eucast_minus_submitter"],
                          hyp["H2"][d]["delta_ME_eucast_minus_submitter"]) for d in DRUGS})
print("G5:", open(ROOT / "gates" / "G5.md").read().splitlines()[:6])
print("stage 7 done")
