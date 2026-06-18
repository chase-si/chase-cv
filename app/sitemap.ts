import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import {
  absoluteUrl,
  getLanguageAlternates,
  indexedPathnames,
} from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexedPathnames.flatMap((pathname) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(pathname, locale),
      alternates: {
        languages: getLanguageAlternates(pathname),
      },
      changeFrequency: "monthly" as const,
      priority: pathname === "/" ? 1 : 0.8,
    })),
  );
}
