/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*'],
    unoptimized: true
  },
  trailingSlash: true,
  poweredByHeader: false
};

export default nextConfig;
