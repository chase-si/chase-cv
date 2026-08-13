import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";
import { magicCursorEffectMetadataNamespace } from "@/lib/magic-cursor/effect-seo-data";
import { magicCursorEffectOgImage } from "@/lib/magic-cursor/magic-cursor-social-image";
import { magicCursorEffectPathname } from "@/lib/magic-cursor/routes";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import { getCanonicalPathname, getLanguageAlternates } from "@/lib/seo/urls";

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

describe("Magic Cursor effect metadata", () => {
  it("emits canonical alternates and large-image cards for every effect", async () => {
    for (const effect of MAGIC_CURSOR_EFFECT_ORDER) {
      const pathname = magicCursorEffectPathname(effect);
      const namespace = magicCursorEffectMetadataNamespace(effect);

      for (const locale of routing.locales) {
        const metadata = await buildToolPageMetadata({
          locale,
          namespace,
          pathname,
          socialImage: {
            ...magicCursorEffectOgImage(effect),
            alt: `${effect} preview`,
          },
        });

        expect(metadata.twitter?.card).toBe("summary_large_image");
        expect(metadata.alternates?.canonical).toBe(getCanonicalPathname(pathname, locale));
        expect(metadata.alternates?.languages).toEqual(getLanguageAlternates(pathname));
        expect(metadata.title).toBe(`${namespace}.title`);
      }
    }
  });
});
