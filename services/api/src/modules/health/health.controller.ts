import { FastifyReply, FastifyRequest } from 'fastify';
import { healthService } from './health.service.js';

export class HealthController {
  public async getHealth(_request: FastifyRequest, reply: FastifyReply) {
    const health = healthService.getHealth();
    return reply.status(200).send(health);
  }

  public async getReady(_request: FastifyRequest, reply: FastifyReply) {
    const ready = await healthService.getReady();
    const statusCode = ready.ready ? 200 : 503;
    return reply.status(statusCode).send(ready);
  }

  public async getDbHealth(_request: FastifyRequest, reply: FastifyReply) {
    const dbHealth = await healthService.getDbHealth();
    const statusCode = dbHealth.status === 'connected' ? 200 : 503;
    return reply.status(statusCode).send(dbHealth);
  }

  public async getRedisHealth(_request: FastifyRequest, reply: FastifyReply) {
    const redisHealth = await healthService.getRedisHealth();
    const statusCode = redisHealth.status === 'connected' ? 200 : 503;
    return reply.status(statusCode).send(redisHealth);
  }
}

export const healthController = new HealthController();
