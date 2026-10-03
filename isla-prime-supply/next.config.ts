import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives inside another repo; pin the root so Turbopack doesn't
  // pick up the parent project's lockfile.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
