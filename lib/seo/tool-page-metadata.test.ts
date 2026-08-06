import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { IMAGE_TO_UI_OG_IMAGE } from "@/lib/image-to-ui/image-to-ui-social-image";
import { siteUrl } from "@/lib/seo/urls";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";

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

describe("buildToolPageMetadata", () => {
  it("uses large-image Twitter cards and absolute social preview URLs for Image to UI", async () => {
    for (const locale of routing.locales) {
      const metadata = await buildToolPageMetadata({
        locale,
        namespace: "metadata.imageToUi",
        pathname: "/image-to-ui",
        socialImage: {
          ...IMAGE_TO_UI_OG_IMAGE,
          alt: "Image to UI social preview",
        },
      });

      const imageUrl = new URL(IMAGE_TO_UI_OG_IMAGE.path, siteUrl).toString();
      expect(metadata.twitter?.card).toBe("summary_large_image");
      expect(metadata.openGraph?.images).toEqual([
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Image to UI social preview",
        },
      ]);
      expect(metadata.twitter?.images).toEqual([imageUrl]);
      expect(metadata.title).toBe("metadata.imageToUi.title");
    }
  });
});
