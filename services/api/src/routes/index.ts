import { FastifyInstance } from 'fastify';
import { healthRoutes } from '../modules/health/health.routes.js';

export async function registerRoutes(fastify: FastifyInstance) {
  // Register health routes at root (GET /health, /ready, /db-health, /redis-health)
  await fastify.register(healthRoutes);

  // Future feature module routes will be registered here under their respective prefixes:
  // await fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  // await fastify.register(tasksRoutes, { prefix: '/api/v1/tasks' });
}

export default registerRoutes;
