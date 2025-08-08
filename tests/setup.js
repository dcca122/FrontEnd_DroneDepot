// Test setup file
import dotenv from 'dotenv';
import { vi } from 'vitest';

// Load environment variables for tests
dotenv.config({ path: '.env.test' });

// Mock Prisma client for tests
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    lead: {
      create: vi.fn(),
      findMany: vi.fn()
    }
  }))
}));
