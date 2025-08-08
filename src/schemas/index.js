import { z } from 'zod';

// Job Request Schema
export const jobRequestSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  industry: z.enum(["real_estate", "construction", "events", "marketing", "other"]),
  location: z.object({
    addressLine1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    lat: z.number().optional(),
    lng: z.number().optional()
  }),
  dateWindow: z.object({
    start: z.string().optional(),
    end: z.string().optional()
  }).optional(),
  budgetBand: z.enum(["under_500", "500_1000", "1000_2500", "2500_plus"]).optional(),
  mustHaveShots: z.string().optional(),
  referral: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
  captchaToken: z.string().optional(),
  _website: z.string().optional() // Honeypot field
});

// Health Check Response Schema
export const healthResponseSchema = z.object({
  status: z.string(),
  time: z.string()
});

// Plan Schema
export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceMonthly: z.number(),
  creditsPerMonth: z.number(),
  rollover: z.boolean(),
  features: z.array(z.string()),
  notes: z.string()
});

// Section Schema
export const sectionSchema = z.object({
  id: z.string(),
  headline: z.string(),
  subcopy: z.string(),
  poster: z.string().url(),
  sources: z.array(z.object({
    src: z.string().url(),
    type: z.string()
  })),
  cta: z.object({
    label: z.string(),
    href: z.string()
  })
});

// Job Request Response Schema
export const jobRequestResponseSchema = z.object({
  ok: z.boolean(),
  jobNumber: z.string()
});

