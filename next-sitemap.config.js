/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://boilerplate.example.com",
    generateRobotsTxt: true,
    generateIndexSitemap: false,

    // Exclude internal pages
    exclude: ["/404", "/500", "/api/*"],

    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/"],
            },
        ],
    },
};
