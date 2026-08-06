import { expect, test } from "@playwright/test";

import { routing } from "@/i18n/routing";
import { getIndexedPathnames } from "@/lib/seo/route-registry";
import { localizePathname } from "@/lib/seo/urls";

const indexedPathnames = getIndexedPathnames();

test.describe("site index contract", () => {
  for (const pathname of indexedPathnames) {
    for (const locale of routing.locales) {
      test(`${locale} ${pathname} returns canonical metadata`, async ({ page }) => {
        const response = await page.goto(localizePathname(pathname, locale));
        expect(response?.ok()).toBe(true);

        await expect(page.locator("title")).not.toBeEmpty();
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
          "content",
          /.+/,
        );

        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(1);
        await expect(canonical).toHaveAttribute("href", /.+/);

        const alternates = page.locator('link[rel="alternate"][hreflang]');
        await expect(alternates).toHaveCount(routing.locales.length + 1);

        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute("content", /\/og\//);

        const twitterCard = page.locator('meta[name="twitter:card"]');
        await expect(twitterCard).toHaveAttribute("content", "summary_large_image");
      });
    }
  }
});
