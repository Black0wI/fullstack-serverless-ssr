import { NextResponse } from "next/server";
import pkg from "../../../../package.json";
import { env } from "@/lib/env";

const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const serviceChecks = {
    runtime: {
      status: "ok",
      nodeEnv: env.NODE_ENV,
      stage: env.SST_STAGE,
      region: env.AWS_REGION,
    },
    configuration: {
      status: "ok",
      siteUrl: env.NEXT_PUBLIC_SITE_URL,
      authConfigured: env.isAuthConfigured,
      googleAuthConfigured: env.isGoogleAuthConfigured,
      cloudflareConfigured: env.isCloudflareConfigured,
      pwaEnabled: env.NEXT_PUBLIC_ENABLE_PWA,
    },
    memory: {
      status: "ok",
      usage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    },
  } as const;

  return NextResponse.json(
    {
      status: "ok",
      service: env.SERVICE_NAME,
      version: pkg.version,
      environment: env.NODE_ENV,
      stage: env.SST_STAGE,
      timestamp: new Date().toISOString(),
      lambdaInstanceUptime: `${uptime}s`,
      checks: serviceChecks,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
