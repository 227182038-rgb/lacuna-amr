// LACUNA-AMR Phase 1 — SQLite → PostgreSQL data migration (v0.5.0).
// Copies every row of the production-shaped SQLite console database into the
// PostgreSQL target, in foreign-key-safe order, with exact row-count
// verification per table. Zero-loss requirement: the script FAILS (exit 1) if
// any table's source count ≠ target count after migration.
//
// Usage:
//   DATABASE_URL="file:./db/custom.db" \
//   PG_DATABASE_URL="postgresql://lacuna@127.0.0.1:5433/lacuna_prod_shaped" \
//   bun scripts/migrate-sqlite-to-postgres.ts
//
// The SQLite client is the app's generated client (node_modules/@prisma/client);
// the PostgreSQL client is generated from deploy/postgres/schema.postgres.prisma
// into scripts/pg-client (same models, provider = "postgresql"). The pg client
// resolves DATABASE_URL at construction, so the script swaps the env var to
// PG_DATABASE_URL BEFORE dynamically importing it, and pins the SQLite client
// to the original URL via the datasources override.

const sqliteUrl = process.env.DATABASE_URL;
const pgUrl = process.env.PG_DATABASE_URL;
if (!sqliteUrl || !pgUrl) {
  console.error("Set DATABASE_URL (SQLite source) and PG_DATABASE_URL (PostgreSQL target).");
  process.exit(1);
}

const { PrismaClient: Sqlite } = await import("@prisma/client");
const sqlite = new Sqlite({ datasources: { db: { url: sqliteUrl } } });

process.env.DATABASE_URL = pgUrl;
const { PrismaClient: Pg } = await import("./pg-client");
const pg = new Pg();

interface TableSpec {
  name: string;
  read: () => Promise<Record<string, unknown>[]>;
  write: (rows: Record<string, unknown>[]) => Promise<number>;
  count: () => Promise<number>;
}

const specs: TableSpec[] = [
  {
    name: "User",
    read: () => sqlite.user.findMany(),
    write: async (rows) => (await pg.user.createMany({ data: rows as never, skipDuplicates: false })).count,
    count: () => pg.user.count(),
  },
  {
    name: "Organization",
    read: () => sqlite.organization.findMany(),
    write: async (rows) => (await pg.organization.createMany({ data: rows as never })).count,
    count: () => pg.organization.count(),
  },
  {
    name: "Membership",
    read: () => sqlite.membership.findMany(),
    write: async (rows) => (await pg.membership.createMany({ data: rows as never })).count,
    count: () => pg.membership.count(),
  },
  {
    name: "Session",
    read: () => sqlite.session.findMany(),
    write: async (rows) => (await pg.session.createMany({ data: rows as never })).count,
    count: () => pg.session.count(),
  },
  {
    name: "ApiKey",
    read: () => sqlite.apiKey.findMany(),
    write: async (rows) => (await pg.apiKey.createMany({ data: rows as never })).count,
    count: () => pg.apiKey.count(),
  },
  {
    name: "AuditRun",
    read: () => sqlite.auditRun.findMany(),
    write: async (rows) => (await pg.auditRun.createMany({ data: rows as never })).count,
    count: () => pg.auditRun.count(),
  },
  {
    name: "PredictRun",
    read: () => sqlite.predictRun.findMany(),
    write: async (rows) => (await pg.predictRun.createMany({ data: rows as never })).count,
    count: () => pg.predictRun.count(),
  },
  {
    name: "ValidateRun",
    read: () => sqlite.validateRun.findMany(),
    write: async (rows) => (await pg.validateRun.createMany({ data: rows as never })).count,
    count: () => pg.validateRun.count(),
  },
  {
    name: "BatchJob",
    read: () => sqlite.batchJob.findMany(),
    write: async (rows) => (await pg.batchJob.createMany({ data: rows as never })).count,
    count: () => pg.batchJob.count(),
  },
  {
    name: "ServiceRequest",
    read: () => sqlite.serviceRequest.findMany(),
    write: async (rows) => (await pg.serviceRequest.createMany({ data: rows as never })).count,
    count: () => pg.serviceRequest.count(),
  },
  {
    name: "AuditLog",
    read: () => sqlite.auditLog.findMany({ orderBy: { seq: "asc" } }),
    write: async (rows) => (await pg.auditLog.createMany({ data: rows as never })).count,
    count: () => pg.auditLog.count(),
  },
  {
    name: "IntegrationConfig",
    read: () => sqlite.integrationConfig.findMany(),
    write: async (rows) => (await pg.integrationConfig.createMany({ data: rows as never })).count,
    count: () => pg.integrationConfig.count(),
  },
  {
    name: "WebhookEvent",
    read: () => sqlite.webhookEvent.findMany(),
    write: async (rows) => (await pg.webhookEvent.createMany({ data: rows as never })).count,
    count: () => pg.webhookEvent.count(),
  },
  {
    name: "BillingSubscription",
    read: () => sqlite.billingSubscription.findMany(),
    write: async (rows) => (await pg.billingSubscription.createMany({ data: rows as never })).count,
    count: () => pg.billingSubscription.count(),
  },
  {
    name: "BillingInvoice",
    read: () => sqlite.billingInvoice.findMany(),
    write: async (rows) => (await pg.billingInvoice.createMany({ data: rows as never })).count,
    count: () => pg.billingInvoice.count(),
  },
  {
    name: "BillingEvent",
    read: () => sqlite.billingEvent.findMany(),
    write: async (rows) => (await pg.billingEvent.createMany({ data: rows as never })).count,
    count: () => pg.billingEvent.count(),
  },
  {
    name: "MetricSample",
    read: () => sqlite.metricSample.findMany(),
    write: async (rows) => (await pg.metricSample.createMany({ data: rows as never })).count,
    count: () => pg.metricSample.count(),
  },
];

async function main() {
  let failed = false;
  console.log("LACUNA-AMR SQLite → PostgreSQL migration");
  console.log("source : SQLite (production-shaped console data)");
  console.log(`target : ${process.env.PG_DATABASE_URL ?? "(unset!)"}`);
  console.log("");

  for (const spec of specs) {
    const rows = await spec.read();
    if (rows.length > 0) {
      // insert in chunks of 500 to keep transactions bounded
      for (let i = 0; i < rows.length; i += 500) {
        await spec.write(rows.slice(i, i + 500));
      }
    }
    const target = await spec.count();
    const ok = target === rows.length;
    if (!ok) failed = true;
    console.log(`  ${ok ? "OK  " : "FAIL"} ${spec.name.padEnd(22)} source=${String(rows.length).padStart(5)}  target=${String(target).padStart(5)}`);
  }

  await pg.$disconnect();
  await sqlite.$disconnect();
  if (failed) {
    console.error("\nMIGRATION FAILED: row-count mismatch.");
    process.exit(1);
  }
  console.log("\nAll tables migrated with exact row-count parity.");
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
