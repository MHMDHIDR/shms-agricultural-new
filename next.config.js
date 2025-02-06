/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shmsagricultural.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shms-uploads.s3.eu-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev-shms-uploads.s3.eu-west-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default config;
