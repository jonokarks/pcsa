/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['*']
  },
  trailingSlash: true,
  poweredByHeader: false
};

export default nextConfig;
