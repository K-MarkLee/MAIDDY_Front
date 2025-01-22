// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,  // ESLint 검사 비활성화
//   },
//   typescript: {
//     ignoreBuildErrors: true,   // TypeScript 타입 체크 비활성화
//   },
// }

// module.exports = {
//   images: {
//     domains: ['http://localhost:3000/images/'], // 이미지를 호스팅하는 도메인 추가
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**',
//       },
//     ],
//   },
// }

// module.exports = nextConfig

// 위에거 쓰지마 > 아래거 쓰기

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // ESLint 검사 비활성화
  },
  typescript: {
    ignoreBuildErrors: true,   // TypeScript 타입 체크 비활성화
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig