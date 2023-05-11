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
        destination: 'https://umami.cloudron.nbank.dev/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
