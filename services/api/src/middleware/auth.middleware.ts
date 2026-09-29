import { FastifyRequest, FastifyReply } from 'fastify';

export async function authMiddleware(_request: FastifyRequest, _reply: FastifyReply) {
  // Stub for JWT verification and session validation
  // Real implementation will be handled by Person A in Module 3.1
  return;
}