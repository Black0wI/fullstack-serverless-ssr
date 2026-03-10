import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Fullstack Serverless SSR — Next.js on AWS",
  description:
    "Modern Next.js application deployed on AWS CloudFront with Terraform IaC. Production-ready boilerplate with CI/CD, premium design, and Claude AI integration.",
  keywords: [
    "Next.js",
    "AWS CloudFront",
    "Terraform",
    "Static Edge",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Jean-Baptiste MONIN" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Fullstack Serverless SSR — Next.js on AWS",
    description:
      "Modern Next.js application deployed on AWS CloudFront with Terraform IaC.",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fullstack Serverless SSR",
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
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
          />
        )}
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
