/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { env } from "~/env";

const withNextIntl = createNextIntlPlugin();

const CORS_ALLOWED_ORIGINS =
  env.NODE_ENV === "production" ? env.CORS_ORIGIN : "*";

const config: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: CORS_ALLOWED_ORIGINS },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Accept, Accept-Version, Content-Length, Content-Type",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(config);
