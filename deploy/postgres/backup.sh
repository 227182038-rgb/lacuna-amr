#!/usr/bin/env bash
# LACUNA-AMR Phase 1 — nightly PostgreSQL backup (v0.5.0).
# pg_dump in custom format (-Fc, compressed) with timestamped filename and a
# retention policy (default 14 days). Designed for a cron job:
#   17 2 * * *  /opt/lacuna/deploy/postgres/backup.sh >> /var/log/lacuna-backup.log 2>&1
# Environment:
#   PGHOST / PGPORT / PGUSER / PGDATABASE  (or PGDATABASE_URL for full URL)
#   BACKUP_DIR (default ./backups)   RETENTION_DAYS (default 14)
set -euo pipefail

PG_BIN="${PG_BIN:-pg_dump}"
if [ -n "${PGDATABASE_URL:-}" ]; then
  export PGDATABASE_URL
  DUMP_ARGS=("$PGDATABASE_URL")
else
  DUMP_ARGS=(-h "${PGHOST:-127.0.0.1}" -p "${PGPORT:-5432}" -U "${PGUSER:-lacuna}")
fi

BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
mkdir -p "$BACKUP_DIR"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$BACKUP_DIR/lacuna-${STAMP}.dump"

echo "[$(date -u +%FT%TZ)] backup start → $FILE"
if [ -n "${PGDATABASE_URL:-}" ]; then
  "$PG_BIN" -Fc -d "$PGDATABASE_URL" -f "$FILE"
else
  "$PG_BIN" -Fc "${DUMP_ARGS[@]}" -d "${PGDATABASE:-lacuna}" -f "$FILE"
fi

SIZE=$(stat -c%s "$FILE")
[ "$SIZE" -gt 1024 ] || { echo "backup suspiciously small ($SIZE bytes) — failing"; exit 1; }
echo "[$(date -u +%FT%TZ)] backup done: $FILE ($SIZE bytes)"

# integrity check: the archive must be readable and list its tables
if command -v pg_restore >/dev/null 2>&1; then
  pg_restore --list "$FILE" > /dev/null
  echo "[$(date -u +%FT%TZ)] archive verified readable ($(pg_restore --list "$FILE" | grep -c 'TABLE DATA') table-data entries)"
fi

# retention
if [ "$RETENTION_DAYS" -gt 0 ]; then
  find "$BACKUP_DIR" -name 'lacuna-*.dump' -mtime +"$RETENTION_DAYS" -delete
  echo "[$(date -u +%FT%TZ)] retention: removed backups older than $RETENTION_DAYS days"
fi
