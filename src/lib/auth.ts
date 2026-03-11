import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";

const providers = [];

if (env.isGoogleAuthConfigured) {
  providers.push(
    Google({
      clientId: env.AUTH_GOOGLE_ID!,
      clientSecret: env.AUTH_GOOGLE_SECRET!,
    }),
  );
}

providers.push(
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(_credentials) {
      // Example-only provider. Replace with real logic before enabling auth in production.
      return null;
    },
  }),
);

/**
 * NextAuth v5 configuration — pre-wired auth example.
 *
 * Providers included:
 * - Google OAuth (set AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET)
 * - Credentials (for development / custom login)
 *
 * To enable auth:
 * 1. Generate a secret: `npx auth secret`
 * 2. Set AUTH_SECRET in .env.local
 * 3. Configure provider credentials
 * 4. Uncomment the auth guard in proxy.ts
 *
 * Docs: https://authjs.dev/getting-started
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/auth/signin",
    // error: "/auth/error",
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isProtected = nextUrl.pathname.startsWith("/protected");
      if (isProtected && !isLoggedIn) {
        return false; // Redirect to signIn page
      }
      return true;
    },
  },
});
