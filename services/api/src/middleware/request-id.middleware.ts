import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'node:crypto';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
    startTime: number;
  }
}

export async function requestIdMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const incomingId = request.headers['x-request-id'];
  const requestId = typeof incomingId === 'string' && incomingId.trim() ? incomingId : randomUUID();
  request.requestId = requestId;
  request.startTime = Date.now();
  reply.header('x-request-id', requestId);
}
