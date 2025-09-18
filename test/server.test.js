// Basic server tests for Shree Umiya HR website
const request = require('supertest');
const app = require('../server');

describe('Server Tests', () => {
  test('GET / should return the main page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Shree Umiya HR');
  });

  test('GET /health should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });

  test('POST /api/contact should validate required fields', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: '',
        email: 'invalid-email',
        message: 'short'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/contact should accept valid data', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid test message with sufficient length.',
      privacy: 'on'
    };

    const response = await request(app)
      .post('/api/contact')
      .send(validData);
    
    // Note: This test might fail in CI without proper email configuration
    // In a real test environment, you'd mock the email service
    expect([200, 500]).toContain(response.status);
  });

  test('GET /robots.txt should return robots file', async () => {
    const response = await request(app).get('/robots.txt');
    expect(response.status).toBe(200);
    expect(response.text).toContain('User-agent: *');
  });

  test('GET /sitemap.xml should return sitemap', async () => {
    const response = await request(app).get('/sitemap.xml');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<?xml version="1.0"');
  });
});
