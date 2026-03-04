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
 * Next.js Middleware — runs on every request at the edge.
 *
 * Currently handles:
 * - Rate limiting on /api/* routes
 * - Auth skeleton (uncomment to protect routes)
 */
export function middleware(request: NextRequest) {
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

  // ── Auth Guard (uncomment to protect routes) ──
  // if (pathname.startsWith("/dashboard")) {
  //   const token = request.cookies.get("session")?.value;
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware runs on.
 * By default: all /api/* routes.
 * Add more matchers to protect additional paths.
 */
export const config = {
  matcher: [
    "/api/:path*",
    // "/dashboard/:path*",  // Uncomment for auth protection
  ],
};
