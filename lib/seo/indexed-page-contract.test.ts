import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";
import { magicCursorEffectPathname } from "@/lib/magic-cursor/routes";
import { projectNavigationItems } from "@/lib/projects";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import {
  absoluteUrl,
  getCanonicalPathname,
  getLanguageAlternates,
} from "@/lib/seo/urls";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

import { listIndexedRouteMetadataBindings } from "./indexed-route-metadata";
import { getIndexedToolOverviewPathnames } from "./route-registry";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async ({ namespace }: { namespace: string }) => {
    const translator = (key: string) => `${namespace}.${key}`;
    return Object.assign(translator, {
      rich: translator,
      markup: translator,
      raw: translator,
      has: () => true,
    });
  }),
}));

function readMetadataString(
  messages: typeof enMessages,
  namespace: string,
  key: "title" | "description",
): string {
  const segments = namespace.split(".");
  let cursor: unknown = messages;
  for (const segment of segments) {
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return (cursor as Record<string, string>)[key];
}

describe("indexed page SEO contract", () => {
  it("maps tool navigation hrefs to indexed overview routes only", () => {
    const overviewPathnames = new Set(getIndexedToolOverviewPathnames());
    const navPathnames = projectNavigationItems.map((item) => item.href);

    for (const pathname of navPathnames) {
      expect(overviewPathnames.has(pathname)).toBe(true);
    }

    expect(navPathnames).not.toContain("/");
    expect(overviewPathnames.has("/magic-cursor")).toBe(true);
  });

  it("lists every magic cursor effect in the hub catalog path set", () => {
    const indexedEffectPaths = new Set(
      MAGIC_CURSOR_EFFECT_ORDER.map((effect) => magicCursorEffectPathname(effect)),
    );

    for (const effect of MAGIC_CURSOR_EFFECT_ORDER) {
      expect(indexedEffectPaths.has(magicCursorEffectPathname(effect))).toBe(true);
    }
  });

  it("keeps sitemap URLs aligned with canonical alternates for indexed routes", () => {
    const sitemapUrls = new Set(buildSitemapEntries().map((entry) => entry.url));

    for (const binding of listIndexedRouteMetadataBindings()) {
      for (const locale of routing.locales) {
        const canonical = absoluteUrl(binding.pathname, locale);
        expect(sitemapUrls.has(canonical)).toBe(true);
        expect(getLanguageAlternates(binding.pathname)[locale]).toBe(canonical);
      }
    }
  });

  it("returns unique non-empty titles and large-image cards for every indexed locale", async () => {
    for (const messages of [enMessages, zhMessages]) {
      const locale = messages === enMessages ? "en" : "zh";
      const titles = new Set<string>();
      const descriptions = new Set<string>();

      for (const binding of listIndexedRouteMetadataBindings()) {
        const metadata = await buildToolPageMetadata({
          locale,
          namespace: binding.namespace,
          pathname: binding.pathname,
          socialImage: {
            ...binding.socialImage,
            alt: "preview",
          },
        });

        const title = readMetadataString(messages, binding.namespace, "title");
        const description = readMetadataString(
          messages,
          binding.namespace,
          "description",
        );

        expect(title.length).toBeGreaterThan(0);
        expect(description.length).toBeGreaterThan(0);
        expect(titles.has(title)).toBe(false);
        expect(descriptions.has(description)).toBe(false);
        titles.add(title);
        descriptions.add(description);

        expect(metadata.alternates?.canonical).toBe(
          getCanonicalPathname(binding.pathname, locale),
        );
        expect(metadata.alternates?.languages).toEqual(
          getLanguageAlternates(binding.pathname),
        );
        expect(metadata.twitter?.card).toBe("summary_large_image");
      }
    }
  });
});
