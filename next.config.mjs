/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "mesh-suite-pics-staging-bucket.s3.amazonaws.com"],
  },
};

export default nextConfig;
