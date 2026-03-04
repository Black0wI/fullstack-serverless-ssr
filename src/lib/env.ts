import { z } from "zod";

/**
 * Server-side environment variables schema.
 * These are NOT exposed to the browser.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Add your server-only env vars here:
  // DATABASE_URL: z.string().url(),
  // AUTH_SECRET: z.string().min(32),
});

/**
 * Client-side environment variables schema.
 * Only variables prefixed with NEXT_PUBLIC_ are available in the browser.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN: z.string().optional(),
});

/**
 * Validate and export typed environment variables.
 * This will throw at build time if required vars are missing.
 */
const serverEnv = serverSchema.parse(process.env);

const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN,
});

export const env = { ...serverEnv, ...clientEnv } as const;
