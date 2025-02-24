/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js"

const hostNames = [
  "shmsagricultural.com",
  "shms-uploads.s3.eu-west-2.amazonaws.com",
  "new-shms.s3.eu-west-2.amazonaws.com",
  "dev-shms-uploads.s3.eu-west-2.amazonaws.com",
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: hostNames.map(hostname => ({
      protocol: "https",
      hostname,
      pathname: "/**",
    })),
  },
}

export default nextConfig
