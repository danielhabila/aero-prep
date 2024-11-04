/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images.pexels.com", "images.unsplash.com"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve("."),
    };
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", process.env.NEXT_PUBLIC_URL],
    },
  },
};

export default nextConfig;
