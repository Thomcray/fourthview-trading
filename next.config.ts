import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vbxppuyvbxojqdnjjnoz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/product-images/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
