import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { getIndexedSeoRoutes } from "@/lib/seo/route-registry";
import {
  absoluteUrl,
  getCanonicalPathname,
  getLanguageAlternates,
} from "@/lib/seo/urls";

import { buildLocalizedMetadata } from "./metadata";

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

describe("buildLocalizedMetadata", () => {
  it("outputs locale canonical paths and bilingual alternates for indexed routes", async () => {
    for (const route of getIndexedSeoRoutes()) {
      for (const locale of routing.locales) {
        const metadata = await buildLocalizedMetadata({
          locale,
          namespace: "metadata.home",
          pathname: route.pathname,
        });

        expect(metadata.alternates?.canonical).toBe(
          getCanonicalPathname(route.pathname, locale),
        );
        expect(metadata.alternates?.languages).toEqual(
          getLanguageAlternates(route.pathname),
        );
        expect(metadata.openGraph?.url).toBe(absoluteUrl(route.pathname, locale));
      }
    }
  });
});
