#!/usr/bin/env python3
"""Stage 11a: manuscript figures. Vector PDF + PNG, regenerated from results
files only (no hand-typed numbers). Figures: attrition, optimism gap,
coverage-under-shift + calibration, unexplained-resistant fraction."""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
RES = ROOT / "results"
FIG = ROOT / "paper" / "figures"
FIG.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({"font.size": 9, "figure.dpi": 150})
C = {"S0": "#4477aa", "S1": "#ee6677", "S2": "#228833", "S3": "#ccbb44"}

# ---------- Fig 1: attrition ----------
st = json.loads((ROOT / "data" / "stage3_state.json").read_text())
sel = json.loads((ROOT / "data" / "stage3_selection.json").read_text())
lin = json.loads((ROOT / "results" / "lineages.json").read_text())
pool = 11126  # from results/tables/census_eligibility_all_organisms.json (E. coli pool)
n_fetched = len(st["fetched_uids"])
labels_all = pd.read_csv(RES / "tables" / "ast_labels_all.tsv", sep="\t")
lab_counts = labels_all.groupby("drug")["label_eucast"].apply(
    lambda s: ((s == "S") | (s == "R")).sum()).to_dict()
stages = [
    ("E. coli antibiogram BioSamples (pool)", pool),
    ("BioSample records fetched\n(seeded order, until 650 qualifying)", n_fetched),
    ("Primary-rule qualifying\n(any of 3 target drugs)", sel["n_qualifying"]),
    ("Assembly-linked", sel["n_linkable"]),
    ("Downloaded (session cap 450)", sel["n_downloaded"]),
    ("Genome stats QC pass", 450),
    ("After clonal de-duplication\n(<=3 per cluster x project)", lin["n_dedup_survivors"]),
    ("Cohort (session cap 240)", lin["n_cohort"]),
    ("Ciprofloxacin labelled (S+R)", lab_counts.get("ciprofloxacin", 0)),
    ("Gentamicin labelled (S+R)", lab_counts.get("gentamicin", 0)),
    ("Ceftazidime labelled (S+R)", lab_counts.get("ceftazidime", 0)),
]
fig, ax = plt.subplots(figsize=(7.2, 4.2), constrained_layout=True)
y = np.arange(len(stages))[::-1]
vals = [s[1] for s in stages]
ax.barh(y, vals, color=["#88ccee"] * 8 + ["#ddcc77"] * 3, height=0.62)
for yi, v in zip(y, vals):
    ax.text(v + max(vals) * 0.01, yi, f"{v:,}", va="center", fontsize=8)
ax.set_yticks(y)
ax.set_yticklabels([s[0] for s in stages], fontsize=8)
ax.set_xscale("log")
ax.set_xlabel("isolates (log scale)")
ax.set_title("Isolate attrition from public pool to analysis sets (E. coli, session-scale pilot)")
for ext in ("pdf", "png"):
    fig.savefig(FIG / f"fig1_attrition.{ext}")
plt.close(fig)

# ---------- Fig 2: optimism gap ----------
h = json.loads((RES / "evaluation" / "hypotheses.json").read_text())
rows = []
for d in h["H1"]:
    for k, v in h["H1"][d].items():
        if k.startswith("M1_") and v.get("delta") is not None:
            rows.append((d, k.replace("M1_", ""), v["delta"], v["delta_ci95"][0], v["delta_ci95"][1],
                         v["AUROC_S0"], v["AUROC_split"]))
fig, ax = plt.subplots(figsize=(7.2, 3.4), constrained_layout=True)
yv = np.arange(len(rows))[::-1]
colors = [C[r[1]] for r in rows]
ax.errorbar([r[2] for r in rows], yv,
            xerr=[[r[2] - r[3] for r in rows], [r[4] - r[2] for r in rows]],
            fmt="o", color="k", ecolor="gray", capsize=2, ms=4)
for yi, r, c in zip(yv, rows, colors):
    ax.plot([r[2]], [yi], "o", color=c, ms=5)
ax.axvline(0, color="k", lw=0.6, ls="--")
ax.set_yticks(yv)
ax.set_yticklabels([f"{r[0]} | {r[1]}  (S0 {r[5]:.2f} -> {r[6]:.2f})" for r in rows], fontsize=7.5)
ax.set_xlabel("delta AUROC (split - S0), paired cluster-bootstrap 95% CI")
ax.set_title("Optimism gap: AUROC change under lineage (S1), time (S2) and site (S3) holdouts (M1)")
fig.savefig(FIG / "fig2_optimism.pdf")
fig.savefig(FIG / "fig2_optimism.png")
plt.close(fig)

# ---------- Fig 3: coverage under shift + calibration ----------
fig, axes = plt.subplots(1, 2, figsize=(7.2, 3.4), constrained_layout=True)
ax = axes[0]
rows3 = []
for d in h["H3"]:
    for k, v in h["H3"][d].items():
        if k.startswith("M1_S") and isinstance(v, dict) and v.get("units"):
            for uk, uv in v["units"].items():
                if "coverage_R_split" in uv and uv.get("coverage_R_S0_same_isolates") is not None:
                    rows3.append((d, k.replace("M1_", ""), uk[:14], uv["coverage_R_split"],
                                  uv["coverage_R_S0_same_isolates"]))
yy = np.arange(len(rows3))[::-1]
for yi, r in zip(yy, rows3):
    ax.plot([r[4]], [yi], "s", color="#4477aa", ms=5, label="S0 (same isolates)" if yi == yy[0] else None)
    ax.plot([r[3]], [yi], "o", color=C[r[1]], ms=6, label=r[1] if r[1] not in [x[1] for x in rows3[:rows3.index(r)]] else None)
ax.axvline(0.90, color="k", lw=0.6, ls=":")
ax.axvline(0.85, color="gray", lw=0.6, ls="--")
ax.set_yticks(yy)
ax.set_yticklabels([f"{r[0]} | {r[1]} | {r[2]}" for r in rows3], fontsize=6.5)
ax.set_xlabel("realised R-class conformal coverage (Mondrian, 0.90 target)")
ax.set_title("Coverage under shift vs S0")
ax.legend(fontsize=6, loc="lower left")

ax = axes[1]
preds = pd.read_csv(RES / "predictions.tsv", sep="\t", dtype={"set": str}, keep_default_na=False)
for d, col in zip(["ciprofloxacin", "gentamicin", "ceftazidime"], ["#4477aa", "#228833", "#ccbb44"]):
    dd = preds[(preds["drug"] == d) & (preds["model"] == "M1") & (preds["split"].str.startswith("S0_"))]
    if not len(dd):
        continue
    p, y = dd["p"].values, dd["y"].values
    edges = np.linspace(0, 1, 6)
    xs, ys = [], []
    for i in range(5):
        m = (p >= edges[i]) & (p <= edges[i + 1])
        if m.sum() > 0:
            xs.append(p[m].mean())
            ys.append(y[m].mean())
    ax.plot(xs, ys, "o-", color=col, ms=3, label=d)
ax.plot([0, 1], [0, 1], "k--", lw=0.6)
ax.set_xlabel("predicted probability of resistance (S0, M1, calibrated)")
ax.set_ylabel("observed resistant fraction")
ax.set_title("Calibration (S0 folds pooled)")
ax.legend(fontsize=7)
fig.savefig(FIG / "fig3_coverage_calibration.pdf")
fig.savefig(FIG / "fig3_coverage_calibration.png")
plt.close(fig)

# ---------- Fig 4: unexplained resistant fraction ----------
fig, ax = plt.subplots(figsize=(4.6, 3.0), constrained_layout=True)
drugs = list(h["H4"].keys())
frac = [h["H4"][d].get("fraction", 0) for d in drugs]
lo = [h["H4"][d]["fraction"] - h["H4"][d]["ci95"][0] for d in drugs]
hi = [h["H4"][d]["ci95"][1] - h["H4"][d]["fraction"] for d in drugs]
nr = [h["H4"][d].get("n_resistant", 0) for d in drugs]
ax.bar(range(len(drugs)), frac, color="#88ccee", width=0.55)
ax.errorbar(range(len(drugs)), frac, yerr=[lo, hi], fmt="none", ecolor="k", capsize=3)
ax.set_xticks(range(len(drugs)))
ax.set_xticklabels([f"{d}\n(R={n})" for d, n in zip(drugs, nr)], fontsize=8)
ax.set_ylabel("fraction of resistant isolates with\nno M0-relevant determinant")
ax.set_title("Unexplained resistance (H4, pilot)")
ax.set_ylim(0, 1)
fig.savefig(FIG / "fig4_unexplained.pdf")
fig.savefig(FIG / "fig4_unexplained.png")
plt.close(fig)
print("figures written:", [f.name for f in sorted(FIG.glob('*.pdf'))])
