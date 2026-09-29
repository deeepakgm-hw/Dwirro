import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { env } from '../../config/env.js';
import { HealthResponse, ReadyResponse, ServiceHealthResponse } from './health.schema.js';

export class HealthService {
  private prisma: PrismaClient | null = null;
  private redis: Redis | null = null;

  constructor() {
    try {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: env.DATABASE_URL,
          },
        },
      });
    } catch {
      this.prisma = null;
    }
  }

  public getHealth(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  public async getDbHealth(): Promise<ServiceHealthResponse> {
    const start = Date.now();
    try {
      if (!this.prisma) {
        return {
          service: 'database',
          status: 'disconnected',
          message: 'Prisma client is not initialized',
        };
      }
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        service: 'database',
        status: 'connected',
        latencyMs: Date.now() - start,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        service: 'database',
        status: 'disconnected',
        latencyMs: Date.now() - start,
        message: msg,
      };
    }
  }

  public async getRedisHealth(): Promise<ServiceHealthResponse> {
    const start = Date.now();
    let tempRedis: Redis | null = null;
    try {
      tempRedis = new Redis(env.REDIS_URL, {
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
      });
      // Attach error listener to avoid unhandled error event in Node.js
      tempRedis.on('error', () => {});
      await tempRedis.connect();
      const ping = await tempRedis.ping();
      await tempRedis.quit();
      return {
        service: 'redis',
        status: ping === 'PONG' ? 'connected' : 'disconnected',
        latencyMs: Date.now() - start,
      };
    } catch (err: unknown) {
      if (tempRedis) {
        try {
          tempRedis.disconnect();
        } catch {
          // ignore
        }
      }
      const msg = err instanceof Error ? err.message : String(err);
      return {
        service: 'redis',
        status: 'disconnected',
        latencyMs: Date.now() - start,
        message: msg,
      };
    }
  }

  public async getReady(): Promise<ReadyResponse> {
    const [dbResult, redisResult] = await Promise.all([
      this.getDbHealth(),
      this.getRedisHealth(),
    ]);

    const isDbConnected = dbResult.status === 'connected';
    const isRedisConnected = redisResult.status === 'connected';
    const ready = isDbConnected && isRedisConnected;

    return {
      status: ready ? 'ok' : 'degraded',
      ready,
      services: {
        database: isDbConnected ? 'connected' : 'disconnected',
        redis: isRedisConnected ? 'connected' : 'disconnected',
      },
    };
  }

  public async cleanup(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

export const healthService = new HealthService();