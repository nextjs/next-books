import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    agentFeedback: true,
    exposeTestingApiInProductionBuild: process.env.EXPOSE_TESTING_API === '1',
    inlineCss: true,
    useOffline: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*.gr-assets.com',
        port: '',
        protocol: 'https',
      },
    ],
  },
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
