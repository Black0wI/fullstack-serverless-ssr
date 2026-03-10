import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Simple in-memory rate limiter for API routes.
 * For production with multiple Lambda instances, use Redis/DynamoDB instead.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

/**
 * Next.js 16 Proxy — replaces middleware.ts.
 * Runs on every matched request as a network boundary layer.
 *
 * Currently handles:
 * - Rate limiting on /api/* routes
 * - Auth guard (uncomment to protect routes via NextAuth)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rate Limiting (API routes only) ──
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }
  }

  // ── Auth Guard (uncomment to protect /protected/* routes) ──
  // To enable auth protection:
  // 1. Export `auth` as the proxy: export { auth as proxy } from "@/lib/auth"
  // 2. Or check session manually:
  // if (pathname.startsWith("/protected")) {
  //   const session = request.cookies.get("authjs.session-token")?.value;
  //   if (!session) {
  //     return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  //   }
  // }

  return NextResponse.next();
}

/**
 * Configure which routes the proxy runs on.
 */
export const config = {
  matcher: [
    "/api/:path*",
    // "/protected/:path*",  // Uncomment to protect routes
  ],
};
