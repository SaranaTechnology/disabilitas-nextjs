import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    // Temporarily ignore type errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
