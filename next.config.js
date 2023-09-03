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

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
});

module.exports = withPWA(nextConfig);
