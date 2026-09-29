import { FastifyRequest, FastifyReply } from 'fastify';

export async function rateLimitMiddleware(_request: FastifyRequest, _reply: FastifyReply) {
  // Stub for Redis token-bucket rate limiting
  return;
}
