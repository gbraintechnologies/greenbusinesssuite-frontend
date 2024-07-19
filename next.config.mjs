/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "mesh-suite-pics-staging-bucket.s3.amazonaws.com"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
