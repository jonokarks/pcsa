/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
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
