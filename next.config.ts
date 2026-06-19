import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  skipProxyUrlNormalize: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
