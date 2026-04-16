/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.binance.com', 'placehold.co'],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
