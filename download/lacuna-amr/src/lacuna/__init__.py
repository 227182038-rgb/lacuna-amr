"""lacuna: license-clean local auditing of genome-based antimicrobial-resistance
predictions.

Core library. Every scientific rule implemented here mirrors the frozen
protocol (protocol/PROTOCOL.md): EUCAST-label derivation with censored-interval
semantics, AMRFinderPlus feature extraction, catalogue rule M0, lineage-aware
splits, calibrated models and Mondrian split-conformal prediction sets.
Research use only. No clinical claims.

This module is a stable façade over the submodules; import from ``lacuna``
directly (e.g. ``from lacuna import Breakpoints``).
"""
from __future__ import annotations

from ._version import __version__
from .ast import (AST_COLUMNS, classify_ast_row, derive_labels,
                  labels_from_ast_table, load_ast_table, parse_biosample_antibiogram)
from .breakpoints import Breakpoints
from .conformal import (abstain_or_predict, conformal_calibrate, conformal_quantiles,
                        conformal_set, conformal_sets, mondrian_quantiles, set_label)
from .errors import ArtefactError, LacunaError, LicenseError, OfflineViolation, SchemaError
from .features import (features_from_amrfinder, load_feature_matrix, m0_mapping,
                       matrix_from_sets, matrix_to_arrays)
from .licensing import LICENSE_INVENTORY, RUO, license_report
from .manifest import generate_sbom, provenance_hash, write_manifest
from .metrics import ca_vme_me, cluster_bootstrap, coverage_block, ece, metrics_block
from .models import ModelArtefact, fit_calibrated, tune_fit, youden_threshold
from .offline import OfflineGuard
from .splits import assert_no_leakage, load_cohort, make_splits, s1_groups

__all__ = [
    "ArtefactError", "AST_COLUMNS", "Breakpoints", "LacunaError", "LicenseError",
    "OfflineViolation", "SchemaError", "RUO", "LICENSE_INVENTORY", "license_report",
    "OfflineGuard", "ModelArtefact", "__version__",
    "classify_ast_row", "parse_biosample_antibiogram", "derive_labels",
    "load_ast_table", "labels_from_ast_table",
    "features_from_amrfinder", "load_feature_matrix", "m0_mapping",
    "matrix_from_sets", "matrix_to_arrays",
    "s1_groups", "assert_no_leakage", "make_splits", "load_cohort",
    "ca_vme_me", "metrics_block", "coverage_block", "cluster_bootstrap", "ece",
    "conformal_quantiles", "mondrian_quantiles", "conformal_calibrate",
    "conformal_set", "conformal_sets", "abstain_or_predict", "set_label",
    "tune_fit", "fit_calibrated", "youden_threshold",
    "provenance_hash", "write_manifest", "generate_sbom",
]
