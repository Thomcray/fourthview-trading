import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vbxppuyvbxojqdnjjnoz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/product-images/**",
      },
      {
        protocol: "https",
        hostname: "vbxppuyvbxojqdnjjnoz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/product-images/**",
      },
      {
        protocol: "https",
        hostname: "vbxppuyvbxojqdnjjnoz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/category-images/**",
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
