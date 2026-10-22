import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    lightningCssFeatures: {
      exclude: ['light-dark'],
    },
  },
  headers: () => [
    {
      // Versioned copies of MapLibre's worker (see scripts/copy-maplibre-worker.mjs)
      source: '/vendor/maplibre/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'traewelling.de', pathname: '/**' }],
  },
  reactCompiler: true,
  rewrites: async () => [{ source: '/@:username', destination: '/user/:username' }],
};

export default nextConfig;
