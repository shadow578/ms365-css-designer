/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import "./src/env.js";

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {};

export default withNextIntl(config);
