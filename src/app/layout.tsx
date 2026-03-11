import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { createMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Next.js SST Boilerplate",
    description:
      "Production-ready Next.js boilerplate for AWS using SST, OpenNext, CloudFront, and Cloudflare DNS.",
  }),
  keywords: [
    "Next.js",
    "SST",
    "OpenNext",
    "AWS CloudFront",
    "AWS Lambda",
    "Cloudflare DNS",
    "TypeScript",
    "Boilerplate",
  ],
  authors: [{ name: "Boilerplate Maintainers" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Next.js SST Boilerplate",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {/* Cloudflare Web Analytics — replace token with yours */}
        {env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
          />
        )}
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Suspense>
          <Footer />
        </Suspense>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
