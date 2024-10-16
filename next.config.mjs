/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images.pexels.com"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve("."),
    };
    return config;
  },
};

export default nextConfig;
