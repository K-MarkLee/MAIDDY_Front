/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['maiddy.co.kr', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'maiddy.co.kr',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: false,
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
