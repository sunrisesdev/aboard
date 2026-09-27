import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    lightningCssFeatures: {
      exclude: ['light-dark'],
    },
  },
  reactCompiler: true,
};

export default nextConfig;
