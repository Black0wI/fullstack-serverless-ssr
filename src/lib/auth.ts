import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * To enable authentication:
 * 1. Set AUTH_SECRET (generate with: npx auth secret)
 * 2. Configure OAuth providers (GitHub, Google, etc.)
 * 3. Uncomment the middleware auth guard in src/middleware.ts
 *
 * Environment variables needed:
 * - AUTH_SECRET          → Required (npx auth secret)
 * - AUTH_GITHUB_ID       → GitHub OAuth App ID
 * - AUTH_GITHUB_SECRET   → GitHub OAuth App Secret
 * - AUTH_GOOGLE_ID       → Google OAuth Client ID
 * - AUTH_GOOGLE_SECRET   → Google OAuth Client Secret
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    // error: "/auth/error",
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isProtected = nextUrl.pathname.startsWith("/dashboard");

      if (isProtected && !isLoggedIn) {
        return false; // Redirect to sign-in
      }

      return true;
    },
  },
});
