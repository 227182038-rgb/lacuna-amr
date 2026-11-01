#!/usr/bin/env bash
# Stage 4: AMRFinderPlus on all cohort genomes (resumable, 2 workers x 1 thread).
set -u
cd "$(dirname "$0")/../.."
mkdir -p results/amrfinder logs
tail -n +2 data/cohort.tsv | cut -f1 > /tmp/cohort_bs.txt
: > /tmp/amr_todo.txt
while read -r bs; do
  [ -f "results/amrfinder/${bs}.tsv" ] || echo "$bs" >> /tmp/amr_todo.txt
done < /tmp/cohort_bs.txt
N=$(wc -l < /tmp/amr_todo.txt)
echo "todo: $N of $(wc -l < /tmp/cohort_bs.txt) cohort genomes ($(date -u +%T))"
run_one() {
  local bs="$1"
  ./.tools/amrfinder --nucleotide "data/assemblies/${bs}.fna.gz" \
    --organism Escherichia --database .tools/amrdb/latest/ --threads 1 \
    --name "$bs" -o "results/amrfinder/${bs}.tsv" --quiet >/dev/null 2>&1 \
    || { rm -f "results/amrfinder/${bs}.tsv"; echo "FAIL $bs"; }
}
export -f run_one
if [ "$N" -gt 0 ]; then
  xargs -a /tmp/amr_todo.txt -I{} -P 2 bash -c 'run_one "$@"' _ {}
fi
echo "results now: $(ls results/amrfinder/*.tsv 2>/dev/null | wc -l)"
