import { z } from "zod";

const PLACEHOLDER_VALUES = new Set([
  "",
  "replace-me",
  "replace-me.example.com",
  "generate-with-npx-auth-secret",
  "https://boilerplate.example.com",
]);

function sanitizeOptionalString(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return PLACEHOLDER_VALUES.has(trimmed) ? undefined : trimmed;
}

function parseBoolean(value: string | undefined, fallback = false): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value === "true";
}

/**
 * Server-side environment variables schema.
 * These are NOT exposed to the browser.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AWS_REGION: z.string().default("local"),
  SERVICE_NAME: z.string().default("nextjs-sst-boilerplate"),
  SST_STAGE: z.string().default("local"),
  DOMAIN_NAME: z.string().optional(),
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_DEFAULT_ACCOUNT_ID: z.string().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
});

/**
 * Client-side environment variables schema.
 * Only variables prefixed with NEXT_PUBLIC_ are available in the browser.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN: z.string().optional(),
  NEXT_PUBLIC_ENABLE_PWA: z.boolean().default(true),
});

/**
 * Validate and export typed environment variables.
 * This will throw at build time if required vars are missing.
 */
const serverEnv = serverSchema.parse(process.env);

const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SITE_URL:
    sanitizeOptionalString(process.env.NEXT_PUBLIC_SITE_URL) ??
    "https://boilerplate.example.com",
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN: sanitizeOptionalString(
    process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN,
  ),
  NEXT_PUBLIC_ENABLE_PWA: parseBoolean(process.env.NEXT_PUBLIC_ENABLE_PWA, true),
});

const domainName = sanitizeOptionalString(serverEnv.DOMAIN_NAME);
const cloudflareApiToken = sanitizeOptionalString(serverEnv.CLOUDFLARE_API_TOKEN);
const cloudflareAccountId = sanitizeOptionalString(
  serverEnv.CLOUDFLARE_DEFAULT_ACCOUNT_ID,
);
const authSecret = sanitizeOptionalString(serverEnv.AUTH_SECRET);
const authGoogleId = sanitizeOptionalString(serverEnv.AUTH_GOOGLE_ID);
const authGoogleSecret = sanitizeOptionalString(serverEnv.AUTH_GOOGLE_SECRET);

export const env = {
  ...serverEnv,
  ...clientEnv,
  DOMAIN_NAME: domainName,
  CLOUDFLARE_API_TOKEN: cloudflareApiToken,
  CLOUDFLARE_DEFAULT_ACCOUNT_ID: cloudflareAccountId,
  AUTH_SECRET: authSecret,
  AUTH_GOOGLE_ID: authGoogleId,
  AUTH_GOOGLE_SECRET: authGoogleSecret,
  isProduction: serverEnv.NODE_ENV === "production",
  isAuthConfigured: Boolean(authSecret),
  isGoogleAuthConfigured: Boolean(authGoogleId && authGoogleSecret),
  isCloudflareConfigured: Boolean(cloudflareApiToken && cloudflareAccountId),
} as const;
