# Code Ownership Matrix

This document defines code ownership across the `ai-personal-platform` monorepo. It aligns directly with the `.github/CODEOWNERS` configuration.

| Scope | Components / Paths | Owner | Description |
|---|---|---|---|
| **Core & AI Backend** | `services/api/src/modules/{auth,users,approvals,agent,memory,integrations,reports,audit}`<br>`services/api/src/{auth,realtime}`<br>`packages/{ai-core,policy-engine,memory-engine,security}` | **Person A** (`@personA`) | Manages identity, safety policies, agent orchestration, memory, security, and realtime infrastructure. |
| **Worker & Automation Engines** | `services/api/src/modules/{tasks,reminders,calendar,emails,notifications,opportunities,exams,bills,communication}`<br>`services/worker`<br>`packages/{notification-engine,opportunity-engine,communication-engine}`<br>`infra/` | **Person B** (`@personB`) | Manages scheduled jobs, background queues, telecom/communication routing, opportunity scrapers, and cloud/Docker infrastructure. |
| **Shared Foundation** | `prisma/schema.prisma`<br>`packages/shared-types`<br>`packages/shared-utils`<br>`packages/logger`<br>`.github`<br>`docs/` | **Shared** (`@personA`, `@personB`) | Cross-cutting data contracts, shared utilities, logging standards, CI workflows, and architecture documentation. Both owners must review changes. |
