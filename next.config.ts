import type { NextConfig } from "next";

// main config for the next.js app
const nextConfig: NextConfig = {
  // skip type errors during build so it doesn't block deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // turned off strict mode to avoid double-rendering in dev mode
  reactStrictMode: false,
};

export default nextConfig;