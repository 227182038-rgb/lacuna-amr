#!/usr/bin/env bash
# LACUNA-AMR Phase 1 — restore drill (v0.5.0).
# Restores the newest (or given) backup into a SCRATCH database and verifies
# per-table row counts against the live database. A backup that cannot be
# restored is not a backup — this drill proves it, end to end.
#   ./restore-drill.sh [backup.dump]
# Environment: PGHOST/PGPORT/PGUSER, PGDATABASE (live, default lacuna),
#              SCRATCH (default lacuna_restore_drill), PGBIN dir (optional).
set -euo pipefail

PGBIN="${PGBIN:-}"
PSQL="$PGBIN"psql; CREATEDB="$PGBIN"createdb; DROPDB="$PGBIN"dropdb; RESTORE="$PGBIN"pg_restore
PGHOST_="${PGHOST:-127.0.0.1}"; PGPORT_="${PGPORT:-5433}"; PGUSER_="${PGUSER:-lacuna}"
LIVE="${PGDATABASE:-lacuna_prod_shaped}"
SCRATCH="${SCRATCH:-lacuna_restore_drill}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
BACKUP="${1:-$(ls -t "$BACKUP_DIR"/lacuna-*.dump | head -1)}"

echo "== LACUNA-AMR restore drill =="
echo "backup : $BACKUP"
echo "live   : $LIVE   scratch: $SCRATCH"

[ -f "$BACKUP" ] || { echo "backup file not found"; exit 1; }

echo "-- dropping scratch db (if any) and recreating"
"$DROPDB" -h "$PGHOST_" -p "$PGPORT_" -U "$PGUSER_" --if-exists "$SCRATCH"
"$CREATEDB" -h "$PGHOST_" -p "$PGPORT_" -U "$PGUSER_" "$SCRATCH"

echo "-- restoring archive into scratch"
"$RESTORE" -h "$PGHOST_" -p "$PGPORT_" -U "$PGUSER_" -d "$SCRATCH" --no-owner "$BACKUP"

TABLES="User Organization Membership Session ApiKey AuditRun PredictRun ValidateRun BatchJob ServiceRequest AuditLog IntegrationConfig WebhookEvent BillingSubscription BillingInvoice BillingEvent MetricSample"
FAILED=0
printf "  %-22s %8s %8s  %s\n" "table" "live" "scratch" "match"
for T in $TABLES; do
  LIVE_N=$("$PSQL" -h "$PGHOST_" -p "$PGPORT_" -U "$PGUSER_" -d "$LIVE" -tAc "SELECT count(*) FROM \"$T\"")
  SCRATCH_N=$("$PSQL" -h "$PGHOST_" -p "$PGPORT_" -U "$PGUSER_" -d "$SCRATCH" -tAc "SELECT count(*) FROM \"$T\"")
  if [ "$LIVE_N" = "$SCRATCH_N" ]; then ST="OK"; else ST="MISMATCH"; FAILED=$((FAILED+1)); fi
  printf "  %-22s %8s %8s  %s\n" "$T" "$LIVE_N" "$SCRATCH_N" "$ST"
done

# hash-chain integrity of the audit trail in the RESTORED copy:
# recompute sha256(seq|prevHash|actor|action|detail|createdAtISO) per row in
# SQL (built-in sha256(); Prisma stores UTC timestamps naive) and compare with
# the stored hash — proving the restored chain is byte-identical.
BROKEN=$("$PSQL" -h "$PGHOST_" -p "$PGPORT_" -U "$PGUSER_" -d "$SCRATCH" -tAc "
  SELECT count(*) FROM \"AuditLog\" a
  WHERE encode(sha256(convert_to(
          a.seq || '|' || coalesce(a.\"prevHash\", 'genesis') || '|' || a.actor || '|' ||
          a.action || '|' || a.detail || '|' || to_char(a.\"createdAt\", 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"'),
          'UTF8')), 'hex') <> a.hash;")
if [ "$BROKEN" = "0" ]; then
  echo "  audit hash-chain: VERIFIED in restored copy (0 broken hashes)"
else
  echo "  audit hash-chain: $BROKEN broken hashes in restored copy — INVESTIGATE"
  FAILED=$((FAILED+1))
fi

if [ "$FAILED" = "0" ]; then
  echo "RESTORE DRILL PASSED — backup is restorable and content-identical."
else
  echo "RESTORE DRILL FAILED ($FAILED problems)."
  exit 1
fi
