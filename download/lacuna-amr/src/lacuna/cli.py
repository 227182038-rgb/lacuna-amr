"""lacuna CLI — fully offline, fail-closed.

Commands: audit-dataset, train, predict, validate, report, manifest,
license-check. Run ``lacuna <command> --help`` for the documented input
schemas. Every command prints the research-use-only notice with its outputs.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from ._version import __version__
from .errors import LacunaError
from .licensing import RUO

# protocol DG defaults (full-scale data gates; relax with explicit flags for
# smaller client datasets — the verdict is then reported against the values
# actually used, never silently)
DG_DEFAULTS = {"min_isolates": 800, "min_R": 100, "min_S": 100, "min_bioprojects": 5}


def _common(ap, sub: bool = False):
    # SUPPRESS on subparsers so a global flag given before the subcommand is
    # not overwritten by the subparser default (argparse gotcha).
    d = argparse.SUPPRESS if sub else False
    ap.add_argument("--allow-network", action="store_true", default=d,
                    help="disable the offline socket guard (not recommended; "
                         "no command needs the network)")
    ap.add_argument("--quiet", action="store_true", default=d,
                    help="suppress info output")
    return ap


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        prog="lacuna",
        description="Audit genome-based AMR predictions. " + RUO,
        epilog="Documentation: docs/cli.md — documented input schemas for every command.")
    ap.add_argument("--version", action="version", version=f"lacuna-amr {__version__}")
    _common(ap)
    sub = ap.add_subparsers(dest="cmd", required=True)
    # ---- audit-dataset -------------------------------------------------
    a = sub.add_parser("audit-dataset",
                       help="label heterogeneity + derived-label counts + data-gate verdicts")
    _common(a, sub=True)
    a.add_argument("--ast", required=True,
                   help="AST table TSV (biosample, drug, sign, measurement, unit, "
                        "method, platform, standard, submitter_phenotype, year, "
                        "country, bioproject)")
    a.add_argument("--breakpoints", required=True,
                   help="user-supplied breakpoint TSV (EUCAST/CLSI values are never bundled)")
    a.add_argument("--drugs", nargs="*", default=None,
                   help="subset of drugs to audit (default: all in the table)")
    a.add_argument("--min-isolates", type=int, default=DG_DEFAULTS["min_isolates"])
    a.add_argument("--min-R", type=int, default=DG_DEFAULTS["min_R"], dest="min_R")
    a.add_argument("--min-S", type=int, default=DG_DEFAULTS["min_S"], dest="min_S")
    a.add_argument("--min-bioprojects", type=int, default=DG_DEFAULTS["min_bioprojects"])
    a.add_argument("--out", default=None, help="write the JSON audit here")
    a.set_defaults(func=cmd_audit_dataset)

    # ---- train ----------------------------------------------------------
    t = sub.add_parser("train", help="train M0/M1/M2 per drug and write a model artefact")
    _common(t, sub=True)
    t.add_argument("--features", required=True,
                   help="feature matrix TSV (biosample column + gene:/mut: columns)")
    t.add_argument("--labels", required=True,
                   help="labels TSV: pre-derived (biosample, drug, label_eucast) or raw "
                        "AST table (then also pass --breakpoints)")
    t.add_argument("--breakpoints", default=None,
                   help="breakpoint TSV, required when --labels is a raw AST table")
    t.add_argument("--label-column", default=None,
                   help="label column name for pre-derived tables (default label_eucast)")
    t.add_argument("--cohort", default=None,
                   help="cohort TSV (bioproject, submitter_org, dedup_cluster, "
                        "coarse_lineage) for lineage-aware training + splits")
    t.add_argument("--m0-mapping", default=None,
                   help="frozen M0 mapping JSON (feature_sets); or derive from "
                        "--amrfinder reports")
    t.add_argument("--amrfinder", nargs="*", default=None,
                   help="AMRFinderPlus TSV reports (to derive the M0 mapping and/or "
                        "the feature matrix when --features is omitted)")
    t.add_argument("--drugs", nargs="*", default=None)
    t.add_argument("--models", nargs="*", default=["M0", "M1"],
                   choices=["M0", "M1", "M2"],
                   help="model types to train (default M0 M1; M2 is slower)")
    t.add_argument("--seed", type=int, default=20261101)
    t.add_argument("--calibration-fraction", type=float, default=0.2)
    t.add_argument("--out", required=True, help="output model artefact JSON")
    t.set_defaults(func=cmd_train)

    # ---- predict --------------------------------------------------------
    p = sub.add_parser("predict",
                       help="determinants + calibrated probabilities + conformal sets")
    _common(p, sub=True)
    p.add_argument("--model", required=True, help="model artefact from `lacuna train`")
    p.add_argument("--features", default=None, help="feature matrix TSV")
    p.add_argument("--amrfinder", nargs="*", default=None,
                   help="AMRFinderPlus TSV reports (alternative to --features)")
    p.add_argument("--isolate", nargs="*", default=None,
                   help="restrict prediction to these biosample ids")
    p.add_argument("--model-type", default=None, choices=["M0", "M1", "M2"],
                   help="override the artefact's default model per drug")
    p.add_argument("--out", default=None, help="output TSV (default stdout)")
    p.add_argument("--allow-version-mismatch", action="store_true",
                   help="load the artefact even if the sklearn/numpy version differs "
                        "from the trained environment (predictions may differ; "
                        "fail-closed by default)")
    p.set_defaults(func=cmd_predict)

    # ---- validate -------------------------------------------------------
    v = sub.add_parser("validate",
                       help="lineage-aware S0-S3 evaluation with cluster-bootstrap CIs")
    _common(v, sub=True)
    v.add_argument("--model", required=True, help="model artefact (metadata + M0 mapping)")
    v.add_argument("--features", required=True, help="feature matrix TSV")
    v.add_argument("--labels", required=True,
                   help="labels TSV (pre-derived or raw AST + --breakpoints)")
    v.add_argument("--breakpoints", default=None)
    v.add_argument("--label-column", default=None)
    v.add_argument("--splits", default=None,
                   help="sealed splits: per-drug directory of <drug>.json, or one JSON "
                        "{drug: doc}; omit to auto-generate protocol splits from the "
                        "artefact metadata (labelled 'auto' in the output)")
    v.add_argument("--cohort", default=None,
                   help="cohort TSV overriding the artefact's stored metadata")
    v.add_argument("--drugs", nargs="*", default=None)
    v.add_argument("--models", nargs="*", default=["M0", "M1"], choices=["M0", "M1", "M2"])
    v.add_argument("--boot", type=int, default=200,
                   help="cluster-bootstrap resamples for CIs (research default 2000)")
    v.add_argument("--seed", type=int, default=20261101)
    v.add_argument("--allow-version-mismatch", action="store_true",
                   help="load the artefact even if the sklearn/numpy version differs "
                        "from the trained environment (fail-closed by default)")
    v.add_argument("--out", required=True, help="output results JSON")
    v.add_argument("--predictions", default=None, help="output predictions TSV path")
    v.add_argument("--summary", default=None, help="output human summary path")
    v.set_defaults(func=cmd_validate)

    # ---- report ---------------------------------------------------------
    r = sub.add_parser("report", help="self-contained HTML/Markdown audit report")
    _common(r, sub=True)
    r.add_argument("--inputs", nargs="+", required=True,
                   help="audit/train/validate/predictions outputs (auto-detected)")
    r.add_argument("--out", default="lacuna_report.html")
    r.add_argument("--title", default="lacuna audit report")
    r.add_argument("--format", default="html", choices=["html", "md"])
    r.set_defaults(func=cmd_report)

    # ---- manifest -------------------------------------------------------
    m = sub.add_parser("manifest", help="SHA-256 provenance manifest (+ optional SBOM)")
    _common(m, sub=True)
    m.add_argument("--paths", nargs="+", required=True)
    m.add_argument("--out", default="manifest.tsv")
    m.add_argument("--base", default=None, help="base dir for relative paths")
    m.add_argument("--sbom", default=None, help="also write an SPDX JSON SBOM here")
    m.set_defaults(func=cmd_manifest)

    # ---- license-check --------------------------------------------------
    lc = sub.add_parser("license-check", help="licence-compliance guards + inventory")
    _common(lc, sub=True)
    lc.add_argument("--root", default=None,
                    help="directory to scan for bundled breakpoint files "
                         "(default: installed package dir)")
    lc.set_defaults(func=cmd_license_check)
    return ap


# ---------------------------------------------------------------- commands
def cmd_audit_dataset(args) -> int:
    from .ast import audit_table, load_ast_table
    from .breakpoints import Breakpoints
    rows = load_ast_table(args.ast)
    bps = Breakpoints.load(args.breakpoints)
    drugs = args.drugs or None
    rep = {"tool": "lacuna", "version": __version__, "notice": RUO,
           "input": str(Path(args.ast)), "breakpoints": str(Path(args.breakpoints)),
           "dg_thresholds": {"min_isolates": args.min_isolates, "min_R": args.min_R,
                             "min_S": args.min_S, "min_bioprojects": args.min_bioprojects},
           "drugs": audit_table(rows, bps, drugs)}
    for drug, e in rep["drugs"].items():
        checks = {
            "min_isolates": (e.get("n_labelled_S_R", 0) >= args.min_isolates,
                             e.get("n_labelled_S_R", 0), args.min_isolates),
            "min_R": (e.get("n_R", 0) >= args.min_R, e.get("n_R", 0), args.min_R),
            "min_S": (e.get("n_S", 0) >= args.min_S, e.get("n_S", 0), args.min_S),
            "min_bioprojects": (e.get("n_bioprojects", 0) >= args.min_bioprojects,
                                e.get("n_bioprojects", 0), args.min_bioprojects),
        }
        e["dg_checks"] = {k: {"pass": bool(ok), "value": v, "threshold": thr}
                          for k, (ok, v, thr) in checks.items()}
        e["dg_verdict"] = ("PASS" if all(c["pass"] for c in e["dg_checks"].values())
                           else "FAIL")
    rep["overall_verdict"] = ("PASS" if all(d["dg_verdict"] == "PASS"
                                            for d in rep["drugs"].values())
                              else "FAIL")
    text = json.dumps(rep, indent=2, default=str)
    print(text)
    if args.out:
        Path(args.out).write_text(text)
        if not args.quiet:
            print(f"\n[audit-dataset] written to {args.out}", file=sys.stderr)
    return 0


def _expand_paths(paths):
    """Accept files or directories (a directory -> its *.tsv reports)."""
    out = []
    for p in paths:
        p = Path(p)
        if p.is_dir():
            out += sorted(p.glob("*.tsv"))
        else:
            out.append(p)
    if not out:
        raise LacunaError(f"no input files found in: {paths}")
    return out


def _load_matrix_and_m0(args, artefact=None):
    """Shared input loading for train/predict/validate."""
    from .features import (amrfinder_metadata, features_from_amrfinder,
                           load_feature_matrix, load_m0_mapping, m0_mapping,
                           matrix_from_sets)
    mat = None
    if args.features:
        mat = load_feature_matrix(args.features)
    m0_map = None
    if getattr(args, "m0_mapping", None):
        m0_map, _kw = load_m0_mapping(args.m0_mapping)
    if getattr(args, "amrfinder", None):
        reports = _expand_paths(args.amrfinder)
        sets = features_from_amrfinder(reports)
        if mat is None:
            mat = matrix_from_sets(sets)
        if m0_map is None:
            m0_map = m0_mapping(amrfinder_metadata(reports))
    if artefact is not None and m0_map is None:
        m0_map = {d: e.get("m0_features", []) for d, e in artefact.drugs.items()}
    return mat, (m0_map or {})


def cmd_train(args) -> int:
    from .pipeline import load_labels, meta_from_cohort, train_artefact
    from .splits import load_cohort
    mat, m0_map = _load_matrix_and_m0(args)
    if mat is None:
        raise LacunaError("train: provide --features and/or --amrfinder reports")
    if not m0_map:
        raise LacunaError("train: provide --m0-mapping (frozen JSON) or --amrfinder "
                          "reports so the M0 catalogue rule can be derived")
    labels, info = load_labels(args.labels, args.breakpoints, args.label_column,
                               args.drugs)
    if not args.cohort:
        raise LacunaError("train: --cohort is required (lineage-aware calibration "
                          "carve-out and artefact metadata need coarse_lineage, "
                          "dedup_cluster, bioproject, submitter_org)")
    meta = meta_from_cohort(load_cohort(args.cohort))
    # collection year (for S2 time splits) may live in the labels table
    if info.get("year_map"):
        meta["year"] = {**info["year_map"], **meta.get("year", {})}
    artefact, notes = train_artefact(
        mat, labels, meta, m0_map, model_types=args.models, seed=args.seed,
        calibration_fraction=args.calibration_fraction)
    artefact.save(args.out)
    print(f"[train] artefact written: {args.out}")
    print(f"[train] payload sha256: {artefact.doc['payload_sha256']}")
    for n in notes:
        print(f"[train] {n}")
    print(f"[train] notice: {RUO}")
    return 0


def cmd_predict(args) -> int:
    from .conformal import set_label
    from .features import matrix_from_sets, matrix_to_arrays
    from .models import ModelArtefact
    artefact = ModelArtefact.load(args.model,
                                 allow_version_mismatch=args.allow_version_mismatch)
    if args.features:
        from .features import load_feature_matrix
        mat = load_feature_matrix(args.features)
    elif args.amrfinder:
        from .features import features_from_amrfinder
        mat = matrix_from_sets(
            features_from_amrfinder(_expand_paths(args.amrfinder)))
    else:
        raise LacunaError("predict: provide --features or --amrfinder reports")
    if args.isolate:
        mat = {i: mat[i] for i in args.isolate if i in mat}
        missing = [i for i in args.isolate if i not in mat]
        if missing:
            print(f"[predict] WARNING: {len(missing)} requested isolates have no "
                  f"features: {missing[:5]}", file=sys.stderr)
    if not mat:
        raise LacunaError("predict: no isolates to predict on")
    isos = sorted(mat)
    out_lines = ["# lacuna predict — " + RUO,
                 f"# artefact: {args.model} "
                 f"(payload sha256 {artefact.doc.get('payload_sha256', '')[:16]}…)",
                 "# columns: biosample, drug, determinants, m0_call, model_type, "
                 "p_S, p_R, call, conformal_set, threshold"]
    header = ["biosample", "drug", "determinants", "m0_call", "model_type",
              "p_S", "p_R", "call", "conformal_set", "threshold"]
    out_lines.append("\t".join(header))
    n_rows = 0
    for drug in sorted(artefact.drugs):
        entry = artefact.drug(drug)
        mt = args.model_type or entry.get("default_model")
        m0_feats = set(entry.get("m0_features", []))
        for iso in isos:
            dets = sorted(f for f in mat[iso] if f in m0_feats)
            m0_call = "R" if dets else "S"
            if mt and mt in entry.get("models", {}):
                order = artefact.feature_order(drug, mt)
                X = matrix_to_arrays({iso: mat[iso]}, order)[1]
                r = artefact.predict_drug(drug, X, mt)[0]
                row = [iso, drug, ";".join(dets) or "-", m0_call, mt,
                       f"{r['p_S']:.4f}", f"{r['p_R']:.4f}",
                       "R" if r["call"] == 1 else "S", set_label(r["set"]),
                       f"{entry['models'][mt]['threshold']:.4f}"]
            else:
                row = [iso, drug, ";".join(dets) or "-", m0_call, "M0",
                       "-", "-", m0_call, m0_call, "0.5000"]
            out_lines.append("\t".join(row))
            n_rows += 1
    text = "\n".join(out_lines) + "\n"
    if args.out:
        Path(args.out).write_text(text)
        print(f"[predict] {n_rows} rows written to {args.out}")
    else:
        sys.stdout.write(text)
    print(f"[predict] notice: {RUO}")
    return 0


def cmd_validate(args) -> int:
    from .pipeline import (auto_splits, evaluate_splits, load_labels,
                           meta_from_cohort, write_evaluation_outputs)
    from .features import load_feature_matrix
    from .models import ModelArtefact
    from .splits import load_cohort, load_splits_per_drug
    artefact = ModelArtefact.load(args.model,
                                 allow_version_mismatch=args.allow_version_mismatch)
    mat = load_feature_matrix(args.features)
    labels, info = load_labels(args.labels, args.breakpoints, args.label_column,
                               args.drugs)
    if args.cohort:
        meta = meta_from_cohort(load_cohort(args.cohort))
    else:
        d = artefact.doc
        meta = {k: d.get(k, {}) for k in ("lineage", "cluster", "bioproject",
                                          "org", "year")}
    m0_map = {d: e.get("m0_features", []) for d, e in artefact.drugs.items()}
    if args.splits:
        splits = load_splits_per_drug(args.splits)
        source = str(args.splits)
    else:
        splits = auto_splits(labels, meta, seed=args.seed)
        source = "auto-generated (protocol rules, seed " f"{args.seed})"
    eval_doc = evaluate_splits(mat, labels, splits, meta, m0_map,
                               model_types=args.models, seed=args.seed,
                               boot=args.boot)
    meta_doc = {
        "lacuna_version": __version__, "notice": RUO,
        "model_artefact": str(args.model),
        "artefact_payload_sha256": artefact.doc.get("payload_sha256"),
        "labels": info, "splits_source": source,
        "boot": args.boot, "seed": args.seed,
        "models": list(args.models)}
    out = Path(args.out)
    pred_path = Path(args.predictions) if args.predictions else out.with_name(
        out.stem + "_predictions.tsv")
    sum_path = Path(args.summary) if args.summary else out.with_name(
        out.stem + "_summary.txt")
    paths = write_evaluation_outputs(eval_doc, out, pred_tsv=pred_path,
                                     summary_txt=sum_path, meta=meta_doc)
    print(f"[validate] results: {paths['results_json']}")
    print(f"[validate] predictions: {paths['predictions_tsv']}")
    print(f"[validate] summary: {sum_path}")
    print(paths["summary"])
    print(f"[validate] notice: {RUO}")
    return 0


def cmd_report(args) -> int:
    from .report import render_html, render_markdown
    out = Path(args.out)
    if args.format == "md":
        render_markdown(args.inputs, out, args.title)
    else:
        if out.suffix != ".html":
            out = out.with_suffix(".html")
        render_html(args.inputs, out, args.title)
    print(f"[report] written: {out} (self-contained, offline)")
    return 0


def cmd_manifest(args) -> int:
    from .manifest import generate_sbom, write_manifest
    paths = [Path(p) for p in args.paths]
    write_manifest(paths, args.out, Path(args.base) if args.base else None)
    print(f"[manifest] {len(paths)} files written to {args.out}")
    if args.sbom:
        doc = generate_sbom(args.sbom, extra_files=paths)
        print(f"[manifest] SBOM written to {args.sbom} "
              f"({len(doc['packages'])} packages, SPDX "
              f"{doc['spdxVersion']})")
    return 0


def cmd_license_check(args) -> int:
    from .licensing import (check_environment, check_no_bundled_breakpoints,
                            license_report)
    notes = []
    notes += check_environment()
    notes += check_no_bundled_breakpoints(args.root)
    print(f"license-check: OK — lacuna-amr {__version__}")
    for n in notes:
        print(f"  - {n}")
    print("\nInventory:")
    for x in license_report()["inventory"]:
        print(f"  {x['component']:<38} {x['license']:<42} {x['posture']}")
    return 0


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    from .offline import OfflineGuard
    try:
        with OfflineGuard(active=not args.allow_network):
            return args.func(args)
    except LacunaError as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    except KeyboardInterrupt:
        print("interrupted", file=sys.stderr)
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
