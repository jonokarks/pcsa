/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_51QiDnFIpu7s8bD02SNQhAi1aPbKvkhP67B9Ff7Rw4Smv3ZaP6qgGDcRwwcZI6UteAO6B0ibUcdeWRvc8HxbE3tCT00O0LwkPU2',
    STRIPE_SECRET_KEY: 'sk_test_51QiDnFIpu7s8bD02mnhCE87eAp4T7aQmla2DHUe6LXziDg5gmMMy5HlYf2w6RGp6BmDJhQyTXDzAWqj3w6pgiD9300pDJAysuB'
  }
};

export default nextConfig;
