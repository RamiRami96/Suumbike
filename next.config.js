/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["platform-lookaside.fbsbx.com", "media.glamour.com"],
  },
};

module.exports = nextConfig;
