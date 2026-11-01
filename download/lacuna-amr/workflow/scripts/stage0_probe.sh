#!/usr/bin/env bash
# LACUNA-AMR stage 0: hardware / environment probe.
# Logs to logs/stage0_env.log. No network needed.
set -u
cd "$(dirname "$0")/../.."
mkdir -p logs provenance
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
{
echo "=== LACUNA-AMR stage 0 environment probe $TS ==="
echo "-- cpu"
nproc
grep -m1 'model name' /proc/cpuinfo 2>/dev/null || true
echo "-- memory"
free -h
echo "-- disk (/home/z)"
df -h /home/z
echo "-- os"
uname -a
head -3 /etc/os-release 2>/dev/null || true
echo "-- python"
python3 --version
pip3 --version 2>/dev/null | head -1 || true
echo "-- external tools"
for t in curl git make cmake gcc g++ conda mamba pandoc java Rscript mash sourmash amrfinder snakemake pytest; do
  if command -v "$t" >/dev/null 2>&1; then echo "HAVE  $t  $(command -v "$t")"; else echo "MISS  $t"; fi
done
echo "-- python libraries"
python3 - <<'PY'
import importlib
for l in ["numpy","scipy","sklearn","pandas","matplotlib","openpyxl","Bio","pytest","statsmodels","pyseer","snakemake","joblib"]:
    try:
        m = importlib.import_module(l)
        print("PY-HAVE", l, getattr(m, "__version__", "?"))
    except Exception:
        print("PY-MISS", l)
PY
echo "=== stage 0 probe done $TS ==="
} 2>&1 | tee logs/stage0_env.log
