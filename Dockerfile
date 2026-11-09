# LACUNA-AMR web console — production image (Phase 1, v0.5.0).
# Multi-stage build producing the Next.js standalone server on top of
# oven/bun. The scientific core stays in the Apache-2.0 Python package
# (download/lacuna-amr); this image is the commercial orchestration console.
#
# Build:  docker build -t lacuna-amr:0.5.0 .
# Run:    see deploy/docker-compose.yml (app + postgres + caddy)

# --- 1. deps ---------------------------------------------------------------
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# --- 2. build --------------------------------------------------------------
FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma client for PostgreSQL (the production datasource; the dev sandbox
# uses SQLite). PG_CLIENT_OUTPUT points the generator at the default client
# location so the standalone trace + runtime both use it.
ENV PG_CLIENT_OUTPUT=/app/node_modules/@prisma/client \
    NEXT_TELEMETRY_DISABLED=1
RUN bunx prisma generate --schema deploy/postgres/schema.postgres.prisma
RUN bun run build

# --- 3. runtime ------------------------------------------------------------
FROM oven/bun:1-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# non-root user
RUN addgroup --system lacuna && adduser --system --ingroup lacuna lacuna

COPY --from=build --chown=lacuna:lacuna /app/.next/standalone ./
COPY --from=build --chown=lacuna:lacuna /app/.next/static ./.next/static
COPY --from=build --chown=lacuna:lacuna /app/public ./public
# schema + prisma CLI so `deploy.sh` can push the schema to Postgres once:
#   docker compose run --rm app bunx prisma db push \
#     --schema deploy/postgres/schema.postgres.prisma --skip-generate
COPY --from=build --chown=lacuna:lacuna /app/deploy ./deploy
COPY --from=build --chown=lacuna:lacuna /app/prisma ./prisma
COPY --from=build --chown=lacuna:lacuna /app/package.json ./package.json
COPY --from=build --chown=lacuna:lacuna /app/node_modules/prisma ./node_modules/prisma
COPY --from=build --chown=lacuna:lacuna /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build --chown=lacuna:lacuna /app/node_modules/.bin ./node_modules/.bin

USER lacuna
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["bun", "server.js"]
