/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint 오류로 빌드 중단 방지
  },
};

export default nextConfig;
