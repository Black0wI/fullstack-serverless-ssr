import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
    title: "Tech Portal — Static Edge Infrastructure",
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
    openGraph: {
        title: "Tech Portal — Static Edge Infrastructure",
        description:
            "Modern Next.js application deployed on AWS CloudFront with Terraform IaC.",
        type: "website",
        locale: "fr_FR",
    },
    robots: {
        index: true,
        follow: true,
    },
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
            </head>
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
