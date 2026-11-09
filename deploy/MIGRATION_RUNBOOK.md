# LACUNA-AMR — SQLite → PostgreSQL Migration Runbook (Phase 1, v0.5.0)

**Status: EXECUTED against production-shaped data on 2026-11-09** — evidence logs in
`deploy/evidence/` (`migration-run-20261109.log`, `backup-run-20261109.log`,
`restore-drill-20261109.log`, `backups/lacuna-20261109T132241Z.dump`).

The goal of Phase 1's database workstream (roadmap Table 6) is: *"Migration runbook
executed once against production-shaped data."* The "production-shaped data" used
here is the console's live SQLite database (17 tables, 557 rows: real audit runs,
prediction runs, API keys, integration events, billing lifecycle records, metrics
samples). The target is PostgreSQL 17.

## What runs where

| Environment | Database | Why |
|---|---|---|
| Dev sandbox (this repo, `/`) | SQLite (`db/custom.db`) | Platform-managed dev server; zero-config demo |
| Production (docker compose) | PostgreSQL 17 | Concurrency, pooling, backups, managed-platform parity |

Both use the **same model definitions** — `prisma/schema.prisma` and
`deploy/postgres/schema.postgres.prisma` differ only in `provider`
(verified by diff in the runbook test below).

## Prerequisites

- `bun` ≥ 1.1, `node_modules` installed (`bun install`)
- PostgreSQL 17 reachable; a database created for the console
- `psql`, `pg_dump`, `pg_restore` on PATH (or point `PGBIN` at them)

## Runbook (the exact steps that were executed)

```bash
# 0) variables
export PGHOST=127.0.0.1 PGPORT=5433 PGUSER=lacuna
export PGDATABASE=lacuna_prod_shaped        # target database
export PGBIN=/path/to/pg/bin/               # if not on PATH
export SQLITE_URL="$(grep '^DATABASE_URL' .env | cut -d= -f2-)"   # file:…custom.db

# 1) schema parity check — the two schemas must differ ONLY in provider
#    (+ the postgres generator's output override line)
diff <(sed -e 's/provider = "postgresql"/provider = "sqlite"/' \
           -e '/output   = env/d' \
        deploy/postgres/schema.postgres.prisma) prisma/schema.prisma \
  && echo "schemas identical except provider"        # → must print the OK line

# 2) generate the PostgreSQL Prisma client (into scripts/pg-client)
PG_CLIENT_OUTPUT="$PWD/scripts/pg-client" \
  bunx prisma generate --schema deploy/postgres/schema.postgres.prisma

# 3) push the schema to the target database (idempotent, no data)
DATABASE_URL="postgresql://$PGUSER@$PGHOST:$PGPORT/$PGDATABASE" \
  bunx prisma db push --schema deploy/postgres/schema.postgres.prisma \
  --skip-generate --accept-data-loss

# 4) regenerate the app's (SQLite) client afterwards — step 2/3 must not
#    clobber node_modules with a postgres-flavoured client
bunx prisma generate

# 5) migrate the data with exact row-count verification (fails on any mismatch)
DATABASE_URL="$SQLITE_URL" \
PG_DATABASE_URL="postgresql://$PGUSER@$PGHOST:$PGPORT/$PGDATABASE" \
  bun scripts/migrate-sqlite-to-postgres.ts

# 6) backup the migrated database (custom-format dump + readability check)
cd deploy/postgres
PG_BIN="${PGBIN}pg_dump" PGDATABASE_URL="postgresql://$PGUSER@$PGHOST:$PGPORT/$PGDATABASE" \
  BACKUP_DIR=../../deploy/evidence/backups ./backup.sh
cd ../..

# 7) restore drill — restore into a scratch DB, verify counts + audit hash-chain
cd deploy/postgres
PGBIN="$PGBIN" PGHOST=$PGHOST PGPORT=$PGPORT PGUSER=$PGUSER PGDATABASE=$PGDATABASE \
  BACKUP_DIR=../evidence/backups SCRATCH=lacuna_restore_drill ./restore-drill.sh
cd ../..
```

## Executed results (2026-11-09)

| Step | Result |
|---|---|
| Schema parity diff | identical except provider |
| `prisma db push` (PG 17.11) | database in sync, 17 tables |
| Data migration | **all 17 tables OK, source = target counts** (User 7, Organization 7, Membership 9, Session 6, ApiKey 13, AuditRun 27, PredictRun 135, ValidateRun 3, BatchJob 4, ServiceRequest 2, AuditLog 177, IntegrationConfig 1, WebhookEvent 47, BillingSubscription 3, BillingInvoice 5, BillingEvent 41, MetricSample 69) |
| Backup | `lacuna-20261109T132241Z.dump`, 70 264 bytes, archive verified readable (17 table-data entries) |
| Restore drill | **PASSED** — all 17 tables content-identical in the scratch database; audit hash-chain re-verified in SQL on the restored copy (0 broken hashes) |

## Cutover procedure (when the production host exists)

1. Freeze writes on the SQLite console (scale the dev app to zero / put up a
   maintenance page).
2. Re-run steps 5–7 above with the frozen database (counts must match).
3. Start the docker compose stack (`./deploy/deploy.sh`) — it pushes the same
   schema and starts the app on Postgres.
4. Verify `/api/health` → `{"status":"ok"}` and spot-check the migrated data
   through the console.
5. Keep the SQLite file as the pre-cutover archive (append-only evidence);
   never delete it.

## Rollback

Before cutover: nothing to do (SQLite untouched). After cutover: stop the
compose stack, restore the pre-cutover backup into Postgres
(`pg_restore -d lacuna pre-cutover.dump`) or point the app back at the archived
SQLite file. Data written only to Postgres after cutover is in the dumps.

## Honesty boundaries (see protocol/DEVIATIONS.md)

- The **managed platform** (roadmap Table 6) is not this sandbox: the compose
  stack is the deployable equivalent and was not executed against a real host
  because none exists yet (D-044).
- Connection pooling: the compose `DATABASE_URL` uses Prisma's built-in pool
  (`connection_limit=20&pool_timeout=10`); pgBouncer is documented as the
  next step when > 1 app replica exists (D-045).
- Nightly backups run inside the stack (`backup` service, 02:17 UTC) and were
  additionally executed manually here with a full restore drill.
