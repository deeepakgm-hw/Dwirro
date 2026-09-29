import dotenv from 'dotenv';
import { Redis } from 'ioredis';
import { logger } from '@aip/logger';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  retryStrategy(times) {
    const delay = Math.min(times * 1000, 5000);
    logger.warn({ module: 'worker', action: 'redis_retry', attempt: times, delay }, `Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info({ module: 'worker', action: 'redis_connected', status: 'connected' }, 'Worker connected to Redis successfully.');
});

redis.on('error', (err) => {
  logger.error({ module: 'worker', action: 'redis_error', error: err.message }, 'Redis connection error encountered in worker.');
});

async function startWorker() {
  logger.info({ module: 'worker', action: 'start' }, 'Initializing AI Personal Assistant background worker...');
  try {
    await redis.connect();
    logger.info({ module: 'worker', action: 'ready' }, 'All queues and schedulers are initialized and listening.');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ module: 'worker', action: 'start_failed', error: msg }, 'Failed initial Redis connection; retry loop active.');
  }
}

function handleShutdown(signal: string) {
  logger.info({ module: 'worker', action: 'shutdown', signal }, `Received ${signal}, shutting down gracefully...`);
  redis.quit().finally(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startWorker();
