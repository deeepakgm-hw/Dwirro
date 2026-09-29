import { z } from 'zod';

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string().datetime(),
  uptime: z.number().nonnegative(),
});

export const ReadyResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  ready: z.boolean(),
  services: z.object({
    database: z.enum(['connected', 'disconnected', 'unconfigured']),
    redis: z.enum(['connected', 'disconnected', 'unconfigured']),
  }),
});

export const ServiceHealthResponseSchema = z.object({
  service: z.string(),
  status: z.enum(['connected', 'disconnected']),
  latencyMs: z.number().nonnegative().optional(),
  message: z.string().optional(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type ReadyResponse = z.infer<typeof ReadyResponseSchema>;
export type ServiceHealthResponse = z.infer<typeof ServiceHealthResponseSchema>;
