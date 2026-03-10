/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />

// ── IMPORTANT ─────────────────────────────────────────────────────────
// Renommer "tech-portal" ci-dessous AVANT le premier déploiement.
// Ce nom doit être unique pour éviter tout conflit CloudFront.
// ──────────────────────────────────────────────────────────────────────
const APP_NAME = "tech-portal";

export default $config({
  app(input) {
    // ── Guard: empêcher le déploiement avec le nom par défaut ──
    if (APP_NAME === "tech-portal") {
      throw new Error(
        '❌ Le nom du projet est toujours "tech-portal". ' +
          "Renommez APP_NAME dans sst.config.ts pour éviter un conflit CloudFront.",
      );
    }

    // ── Guard: empêcher le déploiement sans domaine personnalisé ──
    if (!process.env.DOMAIN_NAME) {
      throw new Error(
        "❌ DOMAIN_NAME n'est pas défini. " +
          "Configurez-le dans .env ou exportez-le avant de déployer.",
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
        // Variables d'environnement passées au runtime Next.js (Lambda)
        // AUTH_SECRET: process.env.AUTH_SECRET ?? "",
        // AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ?? "",
        // AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ?? "",
      },
    });

    return { url: site.url };
  },
});
