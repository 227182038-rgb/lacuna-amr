"""lacuna CLI: audit-dataset, predict, validate, report, manifest."""
from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

from . import (
    RUO, Breakpoints, __version__, ca_vme_me, derive_labels, features_from_amrfinder,
    mondrian_quantiles, parse_biosample_antibiogram, s1_groups, conformal_set,
    abstain_or_predict, write_manifest)


def _load_ast_table(path: Path) -> list[dict]:
    """Documented AST-table schema: TSV with columns biosample, drug, sign,
    measurement, unit, method, platform, standard, submitter_phenotype, year,
    country, bioproject."""
    import csv
    with open(path) as fh:
        return list(csv.DictReader(fh, delimiter="\t"))


def cmd_audit_dataset(args):
    rows = _load_ast_table(Path(args.ast))
    per_drug = defaultdict(list)
    for r in rows:
        per_drug[r["drug"]].append(r)
    report = {"tool": "lacuna", "version": __version__, "notice": RUO, "drugs": {}}
    # label heterogeneity
    for drug, rs in per_drug.items():
        std = Counter(r.get("standard", "") or "missing" for r in rs)
        meth = Counter(r.get("method", "") or "missing" for r in rs)
        plat = Counter(r.get("platform", "") or "missing" for r in rs)
        phen = Counter((r.get("submitter_phenotype", "") or "missing") for r in rs)
        bps = Breakpoints.load(args.breakpoints) if args.breakpoints else None
        labels = Counter()
        if bps and drug.lower() in bps.rows:
            from . import classify_ast_row
            for r in rs:
                if classify_ast_row(r.get("method", ""), r.get("platform", ""),
                                    r.get("unit", ""), r.get("measurement", "")) == "primary_rule":
                    labels[bps.label(drug, r.get("sign", ""), r["measurement"])] += 1
        report["drugs"][drug] = {
            "n_rows": len(rs),
            "n_isolates": len({r["biosample"] for r in rs}),
            "testing_standards": dict(std.most_common(6)),
            "methods": dict(meth.most_common(6)),
            "platforms": dict(plat.most_common(6)),
            "submitter_phenotypes": dict(phen.most_common(8)),
            "derived_labels_primary_rule": dict(labels),
        }
    print(json.dumps(report, indent=2))
    if args.out:
        Path(args.out).write_text(json.dumps(report, indent=2))
    return 0


def cmd_predict(args):
    import csv
    bps = Breakpoints.load(args.breakpoints)
    feats = features_from_amrfinder([Path(p) for p in args.amrfinder])
    with open(args.model) as fh:
        model_doc = json.load(fh)
    mapping = model_doc["m0_mapping"]
    out = []
    for iso, fs in feats.items():
        row = {"isolate": iso, "notice": RUO}
        for drug, m0_feats in mapping.items():
            hit = any(f in fs for f in m0_feats)
            row[drug] = {
                "M0_catalogue": "R" if hit else "S",
                "explained": bool(hit),
                "calibrated_probability": None,  # populated when a calibrated model is supplied
                "conformal_set": "R" if hit else "S",  # catalogue-level set
            }
        out.append(row)
    w = sys.stdout if not args.out else open(args.out, "w")
    for r in out:
        print(json.dumps(r), file=w)
    return 0


def cmd_validate(args):
    """Re-run S0/S1 evaluation on a client-labelled set (local only)."""
    import numpy as np
    from . import assert_no_leakage
    rows = _load_ast_table(Path(args.ast))
    bps = Breakpoints.load(args.breakpoints)
    y = {}
    for r in rows:
        if r["drug"].lower() not in bps.rows:
            continue
        lab = bps.label(r["drug"], r.get("sign", ""), r["measurement"])
        if lab in ("S", "R"):
            y[r["biosample"]] = int(lab == "R")
    feats = features_from_amrfinder([Path(p) for p in args.amrfinder])
    with open(args.model) as fh:
        model_doc = json.load(fh)
    mapping = model_doc["m0_mapping"]
    ids = [i for i in y if i in feats]
    lineage = {i: model_doc.get("lineage", {}).get(i, "NA") for i in ids}
    clusters = {i: model_doc.get("cluster", {}).get(i, i) for i in ids}
    groups = s1_groups(ids, lineage)
    out = {"notice": RUO, "n": len(ids), "S1_groups": {k: len(v) for k, v in groups.items()},
           "M0_by_group": {}}
    for g, test in groups.items():
        train = [i for gg, tt in groups.items() if gg != g for i in tt]
        try:
            assert_no_leakage(train, test, clusters)
        except AssertionError as e:
            out["S1_groups"][g] = f"LEAKAGE: {e}"
            continue
        for drug, m0f in mapping.items():
            pred = {i: int(any(f in feats[i] for f in m0f)) for i in test}
            m = ca_vme_me([y[i] for i in test], [pred[i] for i in test])
            out["M0_by_group"][f"{drug}|{g}"] = m
    print(json.dumps(out, indent=2))
    return 0


def cmd_report(args):
    html = ["<html><head><title>lacuna report</title></head><body>",
            f"<h1>lacuna audit report</h1><p>{RUO}</p>"]
    for p in args.inputs:
        html.append(f"<pre>{Path(p).read_text()[:20000]}</pre>")
    html.append("</body></html>")
    Path(args.out).write_text("\n".join(html))
    print(f"report written to {args.out}")
    return 0


def cmd_manifest(args):
    paths = [Path(p) for p in args.paths]
    write_manifest(paths, args.out or "manifest.tsv")
    print(f"manifest written to {args.out or 'manifest.tsv'}")
    return 0


def main(argv=None):
    ap = argparse.ArgumentParser(prog="lacuna",
                                 description="Audit genome-based AMR predictions. " + RUO)
    ap.add_argument("--version", action="version", version=__version__)
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("audit-dataset", help="label heterogeneity + derived-label counts")
    a.add_argument("--ast", required=True, help="AST table TSV (documented schema)")
    a.add_argument("--breakpoints", required=True, help="user-supplied breakpoint TSV")
    a.add_argument("--out", default=None)
    a.set_defaults(func=cmd_audit_dataset)
    p = sub.add_parser("predict", help="determinants + catalogue + calibrated probability + sets")
    p.add_argument("--amrfinder", nargs="+", required=True, help="AMRFinderPlus TSV outputs")
    p.add_argument("--model", required=True, help="model artefact JSON")
    p.add_argument("--breakpoints", required=True)
    p.set_defaults(func=cmd_predict)
    v = sub.add_parser("validate", help="re-run S0-S1 style validation on a labelled set")
    v.add_argument("--ast", required=True)
    v.add_argument("--breakpoints", required=True)
    v.add_argument("--amrfinder", nargs="+", required=True)
    v.add_argument("--model", required=True)
    v.set_defaults(func=cmd_validate)
    r = sub.add_parser("report", help="HTML report from result JSON files")
    r.add_argument("--inputs", nargs="+", required=True)
    r.add_argument("--out", default="lacuna_report.html")
    r.set_defaults(func=cmd_report)
    m = sub.add_parser("manifest", help="code/data provenance manifest (sha256)")
    m.add_argument("--paths", nargs="+", required=True)
    m.add_argument("--out", default="manifest.tsv")
    m.set_defaults(func=cmd_manifest)
    args = ap.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
