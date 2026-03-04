import type { NextConfig } from "next";

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

export default nextConfig;
