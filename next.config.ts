import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Static export for CloudFront / S3 hosting
  output: "export",

  // Disable image optimization (incompatible with static export)
  images: {
    unoptimized: true,
  },

  // Enable React strict mode
  reactStrictMode: true,

  // Trailing slashes for clean S3/CloudFront routing
  trailingSlash: true,
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);
