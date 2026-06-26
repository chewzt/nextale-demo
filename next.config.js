/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/llms.txt", destination: "/api/llms" },
      { source: "/robots.txt", destination: "/api/robots" },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm)$/i,
      type: "asset/resource",
    });
    return config;
  },
};

module.exports = nextConfig;
