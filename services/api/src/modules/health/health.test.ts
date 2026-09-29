import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../app.js';
import type { FastifyInstance } from 'fastify';

describe('Health Module Reference Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should return 200 OK with status and uptime', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const json = JSON.parse(response.payload);
    expect(json.status).toBe('ok');
    expect(typeof json.uptime).toBe('number');
    expect(json.timestamp).toBeDefined();
  });

  it('GET /health should include x-request-id header', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
      headers: {
        'x-request-id': 'test-req-id-12345',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-request-id']).toBe('test-req-id-12345');
  });

  it('GET /ready should return degraded or ok response with services status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/ready',
    });

    expect([200, 503]).toContain(response.statusCode);
    const json = JSON.parse(response.payload);
    expect(json.services).toBeDefined();
    expect(json.services.database).toBeDefined();
    expect(json.services.redis).toBeDefined();
  });
});
