import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

import { getIndexedSeoRoutes } from "./route-registry";
import { absoluteUrl, getLanguageAlternates } from "./urls";

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  return getIndexedSeoRoutes().flatMap((route) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(route.pathname, locale),
      lastModified: route.lastModified,
      alternates: {
        languages: getLanguageAlternates(route.pathname),
      },
    })),
  );
}
