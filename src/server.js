import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import utilities and schemas
import { jobRequestSchema } from './schemas/index.js';
import { sendAdminNotification, sendClientConfirmation } from './utils/email.js';
import { generateJobNumber } from './utils/jobNumber.js';
import { plans } from '../config/plans.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read sections data
const sectionsPath = join(__dirname, '..', 'config', 'sections.json');
const sections = JSON.parse(readFileSync(sectionsPath, 'utf8'));

dotenv.config();

const prisma = new PrismaClient();
const fastify = Fastify({
  logger: true
});

// CORS configuration
const corsOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://front-end-drone-depot.vercel.app',
  'https://drone-depot.ai'
];

await fastify.register(cors, {
  origin: corsOrigins,
  methods: ['GET', 'POST'],
  credentials: true
});

// Rate limiting
await fastify.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX) || 60,
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 300000,
  allowList: ['127.0.0.1', '::1'], // Allow localhost
  keyGenerator: (request) => {
    return request.ip;
  }
});

// Swagger configuration (only in non-production)
if (process.env.NODE_ENV !== 'production') {
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'DroneDepot Public API v1',
        description: 'Public API for DroneDepot front-end',
        version: '1.0.0'
      },
      host: 'localhost:3001',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  });
}

// Health check endpoint
fastify.get('/v1/public/health', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          time: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  return {
    status: 'ok',
    time: new Date().toISOString()
  };
});

// Plans endpoint
fastify.get('/v1/public/plans', {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            priceMonthly: { type: 'number' },
            creditsPerMonth: { type: 'number' },
            rollover: { type: 'boolean' },
            features: { type: 'array', items: { type: 'string' } },
            notes: { type: 'string' }
          }
        }
      }
    }
  }
}, async (request, reply) => {
  return plans;
});

// Sections endpoint
fastify.get('/v1/public/sections', {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            headline: { type: 'string' },
            subcopy: { type: 'string' },
            poster: { type: 'string' },
            sources: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  src: { type: 'string' },
                  type: { type: 'string' }
                }
              }
            },
            cta: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                href: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}, async (request, reply) => {
  return sections;
});

// Job request endpoint with stricter rate limiting
fastify.post('/v1/public/job-request', {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: 600000 // 10 minutes
    }
  },
  schema: {
    body: {
      type: 'object',
      required: ['fullName', 'email', 'industry', 'location', 'agreeToTerms'],
      properties: {
        fullName: { type: 'string', minLength: 1, maxLength: 100 },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        company: { type: 'string' },
        industry: { type: 'string', enum: ['real_estate', 'construction', 'events', 'marketing', 'other'] },
        location: {
          type: 'object',
          required: ['addressLine1', 'city', 'state', 'postalCode'],
          properties: {
            addressLine1: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postalCode: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' }
          }
        },
        dateWindow: {
          type: 'object',
          properties: {
            start: { type: 'string' },
            end: { type: 'string' }
          }
        },
        budgetBand: { type: 'string', enum: ['under_500', '500_1000', '1000_2500', '2500_plus'] },
        mustHaveShots: { type: 'string' },
        referral: { type: 'string' },
        agreeToTerms: { type: 'boolean' },
        captchaToken: { type: 'string' },
        _website: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          jobNumber: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  try {
    const data = request.body;
    
    // Honeypot check
    if (data._website) {
      return reply.code(200).send({
        ok: true,
        jobNumber: 'DD-SPAM-0000'
      });
    }
    
    // Validate with Zod
    const validatedData = jobRequestSchema.parse(data);
    
    // Generate job number
    const jobNumber = await generateJobNumber();
    
    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        jobNumber,
        fullName: validatedData.fullName.trim(),
        email: validatedData.email.trim().toLowerCase(),
        phone: validatedData.phone?.trim(),
        company: validatedData.company?.trim(),
        industry: validatedData.industry.toUpperCase(),
        location: validatedData.location,
        dateWindow: validatedData.dateWindow || {},
        budgetBand: validatedData.budgetBand?.toUpperCase(),
        mustHaveShots: validatedData.mustHaveShots?.trim(),
        referral: validatedData.referral?.trim(),
        agreeToTerms: validatedData.agreeToTerms,
        source: 'public_form',
        status: 'NEW'
      }
    });
    
    // Send emails (don't block on email failures)
    try {
      await Promise.all([
        sendAdminNotification(lead),
        sendClientConfirmation(lead)
      ]);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if emails fail
    }
    
    return {
      ok: true,
      jobNumber
    };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Job request error:', error);
    return reply.code(500).send({
      error: 'Internal server error'
    });
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: process.env.PORT || 3001,
      host: '0.0.0.0'
    });
    console.log(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
