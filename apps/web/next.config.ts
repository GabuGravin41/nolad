import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@nolad/content"],
  // Content lives in the workspace package; make sure it is traced for any server output.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  outputFileTracingIncludes: {
    "/**": ["../../packages/content/**/*.mdx"],
  },
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
