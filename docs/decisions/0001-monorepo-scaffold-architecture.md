# ADR 001: Monorepo Scaffold Architecture

## Context
We need a unified, modular architecture for the AI Personal Assistant platform that supports multiple client frontends, distinct backend services, and decoupled engines.

## Decision
1. **Monorepo Tooling**: pnpm workspaces with Turborepo for fast caching and incremental builds.
2. **Framework**: Fastify for low-overhead HTTP performance and built-in schema validation.
3. **Queue / Async processing**: BullMQ over Redis 7 for reliable job scheduling.
4. **Data Layer**: PostgreSQL 16 managed via Prisma ORM.
5. **Realtime**: Socket.IO integrated with the Fastify HTTP server.
6. **Code Ownership**: Enforced via `.github/CODEOWNERS` with dual ownership on shared packages.
