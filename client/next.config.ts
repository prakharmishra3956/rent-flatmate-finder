import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["172.16.0.2:3000", "172.16.0.2", "localhost:3000", "localhost"],
};

export default nextConfig;
