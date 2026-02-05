import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Allow images from Sanity
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 👈 ADD THIS
      },
      {
        protocol: 'http',
        hostname: 'googleusercontent.com', // 👈 Added this for the new images
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com', 
      },
    ],
  },
};

export default nextConfig;