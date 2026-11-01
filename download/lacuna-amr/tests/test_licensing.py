"""Licence guards: forbidden distributions, bundled breakpoint detection."""
import importlib.metadata
import pytest

from lacuna.errors import LicenseError
from lacuna.licensing import check_environment, check_no_bundled_breakpoints, license_report


def test_environment_clean():
    # this test environment must not have CARD/RGI installed
    notes = check_environment()
    assert notes


def test_environment_detects_forbidden(monkeypatch):
    def fake_dist(name):
        if name == "rgi":
            class _D:
                version = "1.0"
                metadata = {"Name": "rgi", "License": "commercial"}
            return _D()
        raise importlib.metadata.PackageNotFoundError(name)

    monkeypatch.setattr(importlib.metadata, "distribution", fake_dist)
    with pytest.raises(LicenseError, match="rgi"):
        check_environment()


def test_no_bundled_breakpoints_ok(tmp_path):
    (tmp_path / "models.py").write_text("# code only")
    notes = check_no_bundled_breakpoints(tmp_path)
    assert notes


@pytest.mark.parametrize("name", ["EUCAST_v16.1_Breakpoint_Tables.xlsx",
                                  "clsi_m100.csv", "breakpoint-table.tsv"])
def test_no_bundled_breakpoints_fails(tmp_path, name):
    (tmp_path / name).write_text("x")
    with pytest.raises(LicenseError):
        check_no_bundled_breakpoints(tmp_path)


def test_license_report_shape():
    rep = license_report()
    assert "RESEARCH USE ONLY" in rep["notice"]
    comps = {x["component"] for x in rep["inventory"]}
    assert {"CARD / RGI", "CLSI M100"} <= comps  # excluded items stay visible
    postures = {x["posture"] for x in rep["inventory"]}
    assert "never bundled; user-supplied TSV" in postures
