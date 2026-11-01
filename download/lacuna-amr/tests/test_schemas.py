"""Fail-closed input schemas: every documented input errors with an actionable
message instead of being silently mis-parsed."""
import pytest

from lacuna.ast import load_ast_table
from lacuna.breakpoints import Breakpoints
from lacuna.errors import SchemaError
from lacuna.features import load_feature_matrix
from lacuna.pipeline import load_labels


def _write(tmp_path, name, text):
    p = tmp_path / name
    p.write_text(text)
    return p


# ---------------------------------------------------------------- breakpoints
def test_breakpoints_missing_column(tmp_path):
    p = _write(tmp_path, "bp.tsv", "drug\tS_le_mg_L\namoxicillin\t1\n")
    with pytest.raises(SchemaError, match="missing column"):
        Breakpoints.load(p)


def test_breakpoints_bad_order(tmp_path):
    p = _write(tmp_path, "bp.tsv", "drug\tS_le_mg_L\tR_gt_mg_L\nd\t4\t1\n")
    with pytest.raises(SchemaError, match="above R breakpoint"):
        Breakpoints.load(p)


def test_breakpoints_duplicate(tmp_path):
    p = _write(tmp_path, "bp.tsv",
               "drug\tS_le_mg_L\tR_gt_mg_L\nd\t1\t4\nd\t2\t4\n")
    with pytest.raises(SchemaError, match="duplicate"):
        Breakpoints.load(p)


def test_breakpoints_non_numeric(tmp_path):
    p = _write(tmp_path, "bp.tsv", "drug\tS_le_mg_L\tR_gt_mg_L\nd\t(2)1\t4\n")
    with pytest.raises(SchemaError, match="non-numeric"):
        Breakpoints.load(p)


def test_breakpoints_missing_file(tmp_path):
    with pytest.raises(SchemaError, match="not found"):
        Breakpoints.load(tmp_path / "absent.tsv")


def test_breakpoints_unknown_drug_label():
    bp = Breakpoints(rows={"ciprofloxacin": (0.25, 0.5, "EUCAST", "v16.1")})
    assert bp.label("tigecycline", "", 1.0) == "NO_BREAKPOINT"
    assert bp.label("ciprofloxacin", "abc", "not-a-number") == "NOT_QUANTITATIVE"


# ---------------------------------------------------------------- AST table
def test_ast_table_missing_columns(tmp_path):
    p = _write(tmp_path, "ast.tsv", "biosample\tdrug\nS1\tciprofloxacin\n")
    with pytest.raises(SchemaError, match="AST table missing"):
        load_ast_table(p)


def test_ast_table_empty(tmp_path):
    p = _write(tmp_path, "ast.tsv",
               "biosample\tdrug\tsign\tmeasurement\tunit\n")
    with pytest.raises(SchemaError, match="no data rows"):
        load_ast_table(p)


# ---------------------------------------------------------------- features
def test_feature_matrix_rejects_dup(tmp_path):
    p = _write(tmp_path, "f.tsv",
               "biosample\tg1\nS1\t1\nS1\t0\n")
    with pytest.raises(SchemaError, match="duplicate isolate"):
        load_feature_matrix(p)


def test_feature_matrix_rejects_ragged(tmp_path):
    p = _write(tmp_path, "f.tsv", "biosample\tg1\tg2\nS1\t1\t1\nS2\t1\n")
    with pytest.raises(SchemaError, match="expected 3"):
        load_feature_matrix(p)


def test_feature_matrix_requires_biosample_header(tmp_path):
    p = _write(tmp_path, "f.tsv", "sample\tg1\nS1\t1\n")
    with pytest.raises(SchemaError, match="biosample"):
        load_feature_matrix(p)


# ---------------------------------------------------------------- labels
def test_labels_pre_derived(tmp_path):
    p = _write(tmp_path, "lab.tsv",
               "biosample\tdrug\tlabel_eucast\nS1\tciprofloxacin\tR\n"
               "S2\tciprofloxacin\tS\nS3\tciprofloxacin\tI\n")
    labels, info = load_labels(p)
    assert labels == {"ciprofloxacin": {"S1": 1, "S2": 0}}  # I dropped (not guessed)
    assert info["mode"] == "pre_derived"


def test_labels_raw_ast_requires_breakpoints(tmp_path):
    p = _write(tmp_path, "ast.tsv",
               "biosample\tdrug\tsign\tmeasurement\tunit\tmethod\tplatform\n"
               "S1\tciprofloxacin\t==\t1\tmg/L\tMIC\tSensititre\n")
    with pytest.raises(SchemaError, match="breakpoints"):
        load_labels(p)


def test_labels_raw_ast_derivation(tmp_path):
    ast = _write(tmp_path, "ast.tsv",
                 "biosample\tdrug\tsign\tmeasurement\tunit\tmethod\tplatform\n"
                 "S1\tciprofloxacin\t==\t1\tmg/L\tMIC\tSensititre\n"
                 "S2\tciprofloxacin\t==\t0.25\tmg/L\tMIC\tSensititre\n"
                 "S3\tciprofloxacin\t==\t0.5\tmg/L\tMIC\tSensititre\n")
    bp = _write(tmp_path, "bp.tsv",
                "drug\torganism_group\tS_le_mg_L\tR_gt_mg_L\tsource\tversion\n"
                "ciprofloxacin\tEnterobacterales\t0.25\t0.5\tEUCAST\tv16.1\n")
    labels, info = load_labels(ast, breakpoints=bp)
    assert labels["ciprofloxacin"] == {"S1": 1, "S2": 0}  # 0.5 = I, dropped
    assert info["mode"] == "derived_from_ast"


def test_labels_unrecognised(tmp_path):
    p = _write(tmp_path, "lab.tsv", "biosample\tfoo\nS1\t1\n")
    with pytest.raises(SchemaError, match="neither a label column"):
        load_labels(p)
