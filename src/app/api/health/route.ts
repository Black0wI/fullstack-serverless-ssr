import { NextResponse } from "next/server";
import pkg from "../../../../package.json";

const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    status: "ok",
    version: pkg.version,
    environment: process.env.NODE_ENV,
    stage: process.env.SST_STAGE || "local",
    timestamp: new Date().toISOString(),
    uptime: `${uptime}s`,
    region: process.env.AWS_REGION || "local",
    checks: {
      memory: {
        status: "ok",
        usage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      },
      // Add service checks here:
      // database: await checkDatabase(),
      // redis: await checkRedis(),
    },
  });
}
