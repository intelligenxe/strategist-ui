import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/workflows/corporate_strategy",
        destination: "/workflows/swot",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
