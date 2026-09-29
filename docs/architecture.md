# Platform Architecture: AI Personal Platform

## 1. System Overview

`ai-personal-platform` is a high-reliability, asynchronous, event-driven personal assistant platform. It pairs synchronous user interactions (Fastify API, WebSocket/Socket.IO) with robust background processing (BullMQ, Redis 7) and strict data boundaries (PostgreSQL 16, Prisma).

```
                      +-------------------+
                      |   Web & Mobile    |
                      +---------+---------+
                                | (HTTP / WS)
                                v
                      +-------------------+
                      |    Fastify API    | <---> @aip/security & @aip/policy-engine
                      +---------+---------+
                                |
        +-----------------------+-----------------------+
        |                                               |
        v                                               v
+----------------+                             +----------------+
|  PostgreSQL 16 |                             |    Redis 7     |
|    (Prisma)    |                             | (BullMQ Queue) |
+----------------+                             +-------+--------+
                                                       |
                                                       v
                                               +----------------+
                                               | BullMQ Worker  |
                                               +-------+--------+
                                                       |
                                 +---------------------+---------------------+
                                 |                                           |
                                 v                                           v
                       +-------------------+                       +-------------------+
                       | @aip/opportunity  |                       | @aip/communication|
                       +-------------------+                       +-------------------+
```

## 2. Package Architecture
All packages reside in `packages/` under the `@aip/*` npm scope:
- `@aip/ai-core`: LLM gateway, agent loops, tool bindings, and prompt templates.
- `@aip/policy-engine`: Permission levels, deterministic rule evaluation, and guardrails.
- `@aip/memory-engine`: Short-term context buffer, long-term vector storage, and RAG.
- `@aip/notification-engine`: Message normalization, deduplication, prioritization, and delivery scheduling.
- `@aip/opportunity-engine`: Ingestion adapters (Unstop, LinkedIn, etc.), matching, and deadline tracking.
- `@aip/communication-engine`: Multi-channel dispatch (Push, SMS, Email, WebRTC, PSTN) with automatic fallback.
- `@aip/security`: Field-level encryption, PII redaction, prompt injection defense, and rate limiting.
- `@aip/logger`: Production Pino logger with standard telemetry fields.
- `@aip/shared-types`: Unified TypeScript definitions, DTOs, and global error codes.
- `@aip/shared-utils`: Pure utility helpers, date manipulation, and crypto wrappers.
