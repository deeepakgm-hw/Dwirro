import { FastifyInstance } from 'fastify';
import { healthController } from './health.controller.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', healthController.getHealth.bind(healthController));
  fastify.get('/ready', healthController.getReady.bind(healthController));
  fastify.get('/db-health', healthController.getDbHealth.bind(healthController));
  fastify.get('/redis-health', healthController.getRedisHealth.bind(healthController));
}
