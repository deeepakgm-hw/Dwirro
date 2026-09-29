# Health Reference Module

- **Purpose**: System diagnostics, readiness probes, and database/Redis connectivity verification.
- **Owner**: Shared (Reference Module Pattern for all future modules)
- **Master Plan Section**: Section 3 - Health, Monitoring & Diagnostic Endpoints

### Canonical Pattern
Every future module in `services/api/src/modules/` must follow this exact 5-file pattern:
1. `<name>.schema.ts`: Zod request & response schemas
2. `<name>.service.ts`: Business logic and data layer interactions
3. `<name>.controller.ts`: Fastify route handlers
4. `<name>.routes.ts`: Route registration plugin
5. `<name>.test.ts`: Vitest unit and integration tests
