import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  skipProxyUrlNormalize: true,
  transpilePackages: ["heic-to"],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
