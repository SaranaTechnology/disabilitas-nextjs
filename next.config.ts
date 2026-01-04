import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore type errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
