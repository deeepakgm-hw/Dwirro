# AI Personal Assistant Platform (`ai-personal-platform`)

> High-reliability, modular monorepo scaffold for the AI Personal Assistant platform built with Node.js 20, TypeScript (strict), pnpm workspaces, Turborepo, Fastify, Socket.IO, PostgreSQL 16, Prisma, Redis 7, BullMQ, and Docker.

---

## ðŸ“ Repository Structure Map

```text
ai-personal-platform/
â”œâ”€â”€ apps/
â”‚   â”œâ”€â”€ mobile/                  # React Native mobile application (placeholder)
â”‚   â””â”€â”€ web/                     # React + Vite web dashboard (placeholder)
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ api/                     # Central Fastify HTTP & Socket.IO gateway
â”‚   â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”‚   â”œâ”€â”€ modules/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ health/      # Reference module: /health, /ready, /db-health, /redis-health
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ auth/ ... audit/ # 16 Domain feature modules (scaffolded)
â”‚   â”‚   â”‚   â”œâ”€â”€ routes/          # Central route registry
â”‚   â”‚   â”‚   â”œâ”€â”€ middleware/      # request-id, global error-handler, auth, rate-limit
â”‚   â”‚   â”‚   â”œâ”€â”€ auth/            # JWT, 2FA, sessions, devices foundations
â”‚   â”‚   â”‚   â”œâ”€â”€ realtime/        # Socket.IO gateway attached to Fastify server
â”‚   â”‚   â”‚   â”œâ”€â”€ config/          # Zod-validated environment config loader (fail-fast)
â”‚   â”‚   â”‚   â”œâ”€â”€ app.ts           # Fastify app builder
â”‚   â”‚   â”‚   â””â”€â”€ server.ts        # Production HTTP server entry
â”‚   â”‚   â””â”€â”€ tests/               # API integration and unit test suite
â”‚   â””â”€â”€ worker/                  # BullMQ background job processing service
â”‚       â”œâ”€â”€ src/
â”‚       â”‚   â”œâ”€â”€ jobs/            # 12 typed job stubs (morning-briefing, scans, reports...)
â”‚       â”‚   â”œâ”€â”€ processors/      # Worker job processors
â”‚       â”‚   â”œâ”€â”€ schedulers/      # Cron schedulers & repeaters
â”‚       â”‚   â”œâ”€â”€ queues/          # BullMQ queue definitions
â”‚       â”‚   â””â”€â”€ worker.ts        # Worker runner connecting to Redis
â”‚       â””â”€â”€ tests/               # Worker job tests
â”œâ”€â”€ packages/
â”‚   â”œâ”€â”€ ai-core/                 # @aip/ai-core: Gateway, Agent, Tools, Prompts, Planner
â”‚   â”œâ”€â”€ policy-engine/           # @aip/policy-engine: Action levels, rules, evaluator
â”‚   â”œâ”€â”€ memory-engine/           # @aip/memory-engine: Short-term, long-term vector store, RAG
â”‚   â”œâ”€â”€ notification-engine/     # @aip/notification-engine: Normalizer, deduplicator, classifier
â”‚   â”œâ”€â”€ opportunity-engine/      # @aip/opportunity-engine: Scrapers, matcher, deadline tracking
â”‚   â”œâ”€â”€ communication-engine/    # @aip/communication-engine: Push, SMS, Email, WebRTC, PSTN
â”‚   â”œâ”€â”€ shared-types/            # @aip/shared-types: Common DTOs, payload schemas, error codes
â”‚   â”œâ”€â”€ shared-utils/            # @aip/shared-utils: Cross-cutting helper functions
â”‚   â”œâ”€â”€ security/                # @aip/security: Field encryption, redaction, injection defense
â”‚   â””â”€â”€ logger/                  # @aip/logger: Standardized structured Pino logger
â”œâ”€â”€ prisma/
â”‚   â”œâ”€â”€ schema.prisma            # PostgreSQL datasource and Prisma client generator
â”‚   â”œâ”€â”€ migrations/              # Database migration history
â”‚   â””â”€â”€ seed.ts                  # Database seeder stub
â”œâ”€â”€ infra/
â”‚   â”œâ”€â”€ docker/                  # Dockerfiles and deployment artifacts
â”‚   â”œâ”€â”€ nginx/                   # Reverse proxy configuration
â”‚   â”œâ”€â”€ monitoring/              # Metrics and monitoring configuration
â”‚   â””â”€â”€ scripts/                 # Operational and maintenance scripts
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ architecture.md          # Complete system architecture and communication flows
â”‚   â”œâ”€â”€ api-contracts.md         # API contracts and standardized error codes
â”‚   â”œâ”€â”€ ownership.md             # Code ownership matrix (Person A vs Person B)
â”‚   â””â”€â”€ decisions/               # Architecture Decision Records (ADRs)
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ e2e/                     # End-to-end multi-service test suites
â”‚   â”œâ”€â”€ integration/             # Cross-module integration tests
â”‚   â””â”€â”€ security/                # Security and penetration test scripts
â”œâ”€â”€ .github/
â”‚   â”œâ”€â”€ workflows/ci.yml         # GitHub Actions CI (install, typecheck, lint, test, build)
â”‚   â”œâ”€â”€ CODEOWNERS               # Automated reviewer assignment per ownership matrix
â”‚   â””â”€â”€ pull_request_template.md # PR submission checklist
â”œâ”€â”€ docker-compose.yml           # PostgreSQL 16 & Redis 7 (with health checks)
â”œâ”€â”€ .env.example                 # Canonical environment variables template
â”œâ”€â”€ package.json                 # Monorepo root scripts and devDependencies
â”œâ”€â”€ pnpm-workspace.yaml          # Monorepo workspaces definition
â”œâ”€â”€ turbo.json                   # Turborepo task pipeline configuration
â””â”€â”€ tsconfig.base.json           # Shared strict TypeScript configuration with @aip/* aliases
```

---

## ðŸš€ Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` (or `v22.x`)
- **pnpm**: `v10+` / `v12+`
- **Docker & Docker Compose**: (for PostgreSQL 16 & Redis 7)

### 2. Environment Setup
Copy the template `.env.example` into `.env`:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Start Infrastructure Containers
Start PostgreSQL and Redis in the background:
```bash
pnpm docker:up
```

### 5. Generate Database Client & Run Migrations
```bash
pnpm db:generate
pnpm db:migrate
```

---

## ðŸ’» Available Commands

| Command | Description |
|---|---|
| `pnpm dev:api` | Starts the Fastify API Gateway in hot-reload mode (`http://localhost:3000`) |
| `pnpm dev:worker` | Starts the BullMQ background worker in hot-reload mode |
| `pnpm build` | Builds all packages, services, and apps via Turborepo |
| `pnpm typecheck` | Typechecks all packages and services strictly via `tsc --noEmit` |
| `pnpm lint` | Runs ESLint across all workspaces |
| `pnpm test` | Runs Vitest tests across all services and packages |
| `pnpm db:generate` | Generates the Prisma client from `prisma/schema.prisma` |
| `pnpm db:migrate` | Runs database migrations in development mode |
| `pnpm db:studio` | Opens Prisma Studio GUI to view database records |
| `pnpm docker:up` | Starts PostgreSQL 16 and Redis 7 containers |
| `pnpm docker:down` | Stops infrastructure containers |

---

## ðŸ©º Reference Health Module Endpoints

The API Gateway exposes canonical diagnostic routes out-of-the-box:

- `GET /health`: Liveness probe (returns 200 with uptime and timestamp)
- `GET /ready`: Readiness probe (verifies database and Redis availability)
- `GET /db-health`: Dedicated database connectivity check
- `GET /redis-health`: Dedicated Redis connectivity check

Sample response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-29T16:40:00.000Z",
  "uptime": 12.34
}
```

---

## ðŸ‘¥ Ownership & Governance
- Refer to [`docs/ownership.md`](docs/ownership.md) for detailed module responsibility boundaries.
- Code reviews are automatically routed via [`.github/CODEOWNERS`](.github/CODEOWNERS).
