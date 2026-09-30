import { describe, expect, it } from 'vitest';
import worker from '../src/index';

const env = { DB: {} as D1Database, SESSION_SECRET: 'test', ADMIN_BOOTSTRAP_SECRET: 'test', ALLOWED_ORIGINS: 'http://localhost:5173' };

describe('FLIPD Worker', () => {
  it('exposes a healthy JSON endpoint with CORS', async () => {
    const response = await worker.fetch(new Request('https://flipd.test/health', { headers: { Origin: 'http://localhost:5173' } }), env);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, service: 'flipd-api' });
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
  });

  it('rejects unknown browser origins', async () => {
    const response = await worker.fetch(new Request('https://flipd.test/health', { headers: { Origin: 'https://malicious.example' } }), env);
    expect(response.status).toBe(403);
  });
});
