import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
   API_URL: "http://localhost:8080",
  },
  images: {
    domains: ['localhost','192.168.1.13'],
  },
};

export default nextConfig;
