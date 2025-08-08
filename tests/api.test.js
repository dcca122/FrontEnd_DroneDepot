import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';

// Import the server configuration
import { jobRequestSchema } from '../src/schemas/index.js';

const prisma = new PrismaClient();

// Create a test server
const createTestServer = () => {
  const fastify = Fastify({
    logger: false
  });

  // Register plugins
  fastify.register(cors, {
    origin: ['http://localhost:3000', 'https://drone-depot.ai'],
    methods: ['GET', 'POST'],
    credentials: true
  });

  fastify.register(rateLimit, {
    max: 60,
    timeWindow: 300000,
    allowList: ['127.0.0.1', '::1'],
    keyGenerator: (request) => request.ip
  });

  // Add test routes
  fastify.get('/v1/public/health', async (request, reply) => {
    return {
      status: 'ok',
      time: new Date().toISOString()
    };
  });

  fastify.get('/v1/public/plans', async (request, reply) => {
    return [
      {
        id: 'starter',
        name: 'Starter',
        priceMonthly: 199,
        creditsPerMonth: 1,
        rollover: true,
        features: ['FAA-certified pilots', '48-hour delivery', 'Priority scheduling'],
        notes: '1 credit ≈ photo-only standard shoot'
      }
    ];
  });

  fastify.post('/v1/public/job-request', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: 600000
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = jobRequestSchema.parse(request.body);
      
      // Honeypot check
      if (validatedData._website) {
        return { ok: true, jobNumber: 'DD-SPAM-0000' };
      }

      return {
        ok: true,
        jobNumber: 'DD-250808-0123'
      };
    } catch (error) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: error.errors
      });
    }
  });

  return fastify;
};

describe('Public API v1', () => {
  let server;

  beforeAll(async () => {
    server = createTestServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('CORS', () => {
    test('should allow requests from allowed origins', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/public/health',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    test('should not allow requests from disallowed origins', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/public/health',
        headers: {
          'Origin': 'https://malicious-site.com'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['access-control-allow-origin']).not.toBe('https://malicious-site.com');
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/public/health'
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.status).toBe('ok');
      expect(data.time).toBeDefined();
    });
  });

  describe('Plans', () => {
    test('should return plans array', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/v1/public/plans'
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('priceMonthly');
    });
  });

  describe('Job Request', () => {
    test('should accept valid job request', async () => {
      const validRequest = {
        fullName: 'John Doe',
        email: 'john@example.com',
        industry: 'real_estate',
        location: {
          addressLine1: '123 Main St',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701'
        },
        agreeToTerms: true
      };

      const response = await server.inject({
        method: 'POST',
        url: '/v1/public/job-request',
        payload: validRequest
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.ok).toBe(true);
      expect(data.jobNumber).toBeDefined();
    });

    test('should reject invalid job request', async () => {
      const invalidRequest = {
        fullName: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: not a valid email
        industry: 'invalid_industry', // Invalid: not in enum
        location: {
          addressLine1: '123 Main St',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701'
        },
        agreeToTerms: false // Invalid: must be true
      };

      const response = await server.inject({
        method: 'POST',
        url: '/v1/public/job-request',
        payload: invalidRequest
      });

      expect(response.statusCode).toBe(400);
      const data = JSON.parse(response.payload);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    test('should handle honeypot field', async () => {
      const requestWithHoneypot = {
        fullName: 'John Doe',
        email: 'john@example.com',
        industry: 'real_estate',
        location: {
          addressLine1: '123 Main St',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701'
        },
        agreeToTerms: true,
        _website: 'filled' // Honeypot field
      };

      const response = await server.inject({
        method: 'POST',
        url: '/v1/public/job-request',
        payload: requestWithHoneypot
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.ok).toBe(true);
      expect(data.jobNumber).toBe('DD-SPAM-0000');
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting to job requests', async () => {
      const validRequest = {
        fullName: 'John Doe',
        email: 'john@example.com',
        industry: 'real_estate',
        location: {
          addressLine1: '123 Main St',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701'
        },
        agreeToTerms: true
      };

      // Make multiple requests to trigger rate limiting
      const responses = [];
      for (let i = 0; i < 12; i++) {
        const response = await server.inject({
          method: 'POST',
          url: '/v1/public/job-request',
          payload: validRequest
        });
        responses.push(response);
      }

      // Check if rate limiting was applied
      const rateLimitedResponses = responses.filter(r => r.statusCode === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});

