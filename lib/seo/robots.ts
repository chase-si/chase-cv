import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export function buildRobotsConfig(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "bingbot",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml", "en"),
  };
}
