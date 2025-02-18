/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['*'],
  },
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    serverActions: true
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  }
};

export default nextConfig;
