const withPWA = require('@ducanh2912/next-pwa').default({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  dest: 'public',
  fallbacks: {
    //image: "/static/images/fallback.png",
    document: '/offline', // if you want to fallback to a custom page rather than /_offline
    // font: '/static/font/fallback.woff2',
    // audio: ...,
    // video: ...,
  },
  workboxOptions: {
    disableDevLogs: true,
  },
  // ... other options you like
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'traewelling.de',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: '/tracking/:path*',
        destination: 'https://tracking.nbank.dev/:path*',
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
