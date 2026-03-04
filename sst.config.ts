/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "tech-portal",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "eu-west-3",
        },
      },
    };
  },
  async run() {
    // ── Optionnel: Bucket S3 pour les uploads ──
    // const bucket = new sst.aws.Bucket("Uploads", {
    //   access: "public",
    // });

    // ── Next.js App ──
    const site = new sst.aws.Nextjs("Web", {
      // Décommenter pour un custom domain :
      // domain: "portal.example.com",
      // Lier des ressources AWS (S3, DynamoDB, etc.) :
      // link: [bucket],
    });

    // ── Cron Job (exemple: cleanup toutes les heures) ──
    // new sst.aws.Cron("Cleanup", {
    //   schedule: "rate(1 hour)",
    //   function: {
    //     handler: "src/functions/cleanup.handler",
    //     timeout: "5 minutes",
    //   },
    // });

    return {
      url: site.url,
    };
  },
});
