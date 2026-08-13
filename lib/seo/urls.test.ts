import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

import { getIndexedSeoRoutes } from "./route-registry";
import {
  absoluteUrl,
  getCanonicalPathname,
  getLanguageAlternates,
  localizePathname,
} from "./urls";

describe("localized SEO URL helpers", () => {
  it("builds locale-aware canonical pathnames for every indexed route", () => {
    for (const route of getIndexedSeoRoutes()) {
      expect(localizePathname(route.pathname, "en")).toBe(
        route.pathname === "/" ? "/" : route.pathname,
      );
      expect(getCanonicalPathname(route.pathname, "en")).toBe(
        localizePathname(route.pathname, "en"),
      );

      const zhPath =
        route.pathname === "/" ? "/zh" : `/zh${route.pathname}`;
      expect(localizePathname(route.pathname, "zh")).toBe(zhPath);
      expect(getCanonicalPathname(route.pathname, "zh")).toBe(zhPath);
    }
  });

  it("returns absolute URLs and hreflang alternates for every indexed route", () => {
    for (const route of getIndexedSeoRoutes()) {
      const alternates = getLanguageAlternates(route.pathname);

      expect(alternates.en).toBe(absoluteUrl(route.pathname, "en"));
      expect(alternates.zh).toBe(absoluteUrl(route.pathname, "zh"));
      expect(alternates["x-default"]).toBe(
        absoluteUrl(route.pathname, routing.defaultLocale),
      );
    }
  });
});
