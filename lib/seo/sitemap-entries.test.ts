import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

import { getIndexedSeoRoutes } from "./route-registry";
import { absoluteUrl, getLanguageAlternates } from "./urls";
import { buildSitemapEntries } from "./sitemap-entries";

describe("sitemap entries", () => {
  it("includes every indexed route for each locale with alternates and lastModified", () => {
    const entries = buildSitemapEntries();
    const routes = getIndexedSeoRoutes();

    expect(entries.length).toBe(routes.length * routing.locales.length);

    for (const route of routes) {
      for (const locale of routing.locales) {
        const entry = entries.find(
          (item) => item.url === absoluteUrl(route.pathname, locale),
        );

        expect(entry).toBeDefined();
        expect(entry?.lastModified).toEqual(route.lastModified);
        expect(entry?.alternates?.languages).toEqual(
          getLanguageAlternates(route.pathname),
        );
      }
    }
  });

  it("does not emit priority or changeFrequency crawl hints", () => {
    for (const entry of buildSitemapEntries()) {
      expect("priority" in entry).toBe(false);
      expect("changeFrequency" in entry).toBe(false);
    }
  });

  it("lists only canonical indexed URLs and excludes dashboard or error routes", () => {
    const allowedUrls = new Set(
      getIndexedSeoRoutes().flatMap((route) =>
        routing.locales.map((locale) => absoluteUrl(route.pathname, locale)),
      ),
    );
    const sitemapUrls = buildSitemapEntries().map((entry) => entry.url);

    expect(sitemapUrls.every((url) => allowedUrls.has(url))).toBe(true);
    expect(sitemapUrls).not.toContain(absoluteUrl("/dashboard", "en"));
    expect(sitemapUrls).not.toContain(absoluteUrl("/not-found", "en"));
  });
});
