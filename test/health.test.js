const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  it('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /time should return a valid time', async () => {
    const res = await request(app).get('/time');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('time');
    // Check if it is a valid ISO string (basic check)
    expect(new Date(res.body.time).toISOString()).toBe(res.body.time);
  });
});
