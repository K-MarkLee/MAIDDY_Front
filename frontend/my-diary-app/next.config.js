/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // ESLint 검사 비활성화
  },
  typescript: {
    ignoreBuildErrors: true,   // TypeScript 타입 체크 비활성화
  },
}

module.exports = nextConfig