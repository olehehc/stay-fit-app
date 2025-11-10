/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: `/${process.env.NEXT_PUBLIC_AWS_IMAGE_HOSTNAME}/**`,
      },
    ],
  },
};

export default nextConfig;
