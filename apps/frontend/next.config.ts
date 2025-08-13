import type { NextConfig } from "next";

const dr = process.env.NEXT_PUBLIC_DRONEREGION_URL;

const nextConfig: NextConfig = {
  async redirects() {
    if (dr) {
      return [
        {
          source: "/buyers-guide",
          destination: `${dr}/buyers-guide`,
          permanent: process.env.NODE_ENV === "production",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
