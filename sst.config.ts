/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />

// ── IMPORTANT ─────────────────────────────────────────────────────────
// Rename "replace-me" below BEFORE your first deployment.
// This name must be unique to avoid CloudFront distribution conflicts.
// ──────────────────────────────────────────────────────────────────────
const APP_NAME = "replace-me";

export default $config({
  app(input) {
    // ── Guard: prevent deployment with the default name ──
    if (APP_NAME === "replace-me") {
      throw new Error(
        '❌ APP_NAME is still "replace-me". ' +
          "Rename it in sst.config.ts to avoid a CloudFront conflict.",
      );
    }

    // ── Guard: prevent deployment without a custom domain ──
    if (!process.env.DOMAIN_NAME) {
      throw new Error(
        "❌ DOMAIN_NAME is not set. " +
          "Configure it in .env or export it before deploying.",
      );
    }

    return {
      name: APP_NAME,
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: { region: "eu-west-3" },
        cloudflare: {},
      },
    };
  },
  async run() {
    const site = new sst.aws.Nextjs("Web", {
      domain: {
        name: process.env.DOMAIN_NAME!,
        dns: sst.cloudflare.dns(),
      },
      environment: {
        // Environment variables passed to the Next.js runtime (Lambda)
        // AUTH_SECRET: process.env.AUTH_SECRET ?? "",
        // AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ?? "",
        // AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ?? "",
      },
    });

    return { url: site.url };
  },
});
