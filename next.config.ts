import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Disable image optimization for SST/OpenNext
  // (SST handles image optimization separately)
  images: {
    unoptimized: true,
  },
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);
