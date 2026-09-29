import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from '@aip/logger';

async function startServer() {
  try {
    const app = await buildApp();
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(
      {
        module: 'api',
        action: 'server_started',
        port: env.PORT,
        node_env: env.NODE_ENV,
      },
      `AI Personal Platform API Gateway listening on http://0.0.0.0:${env.PORT}`,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.fatal({ module: 'api', action: 'startup_error', error: msg }, 'Failed to start API gateway.');
    process.exit(1);
  }
}

startServer();
