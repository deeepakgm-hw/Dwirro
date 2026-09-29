import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { requestIdMiddleware } from './middleware/request-id.middleware.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { registerRoutes } from './routes/index.js';
import { realtimeGateway } from './realtime/gateway.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: false, // Using @aip/logger structured logging instead of raw fastify logger
  });

  // Security & utility plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Global hooks & error handling
  app.addHook('onRequest', requestIdMiddleware);
  app.setErrorHandler(errorHandler);

  // Register application routes
  await registerRoutes(app);

  // Attach Socket.IO to underlying HTTP server
  realtimeGateway.attach(app.server);

  return app;
}

export default buildApp;
