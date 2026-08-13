import { getTranslations, setRequestLocale } from "next-intl/server";

import { MagicCursorEffectGalleryPage } from "@/components/magic-cursor/effect-gallery-page";
import { MagicCursorLandingContent } from "@/components/magic-cursor/landing-content";
import { JsonLd } from "@/components/seo/json-ld";
import type { AppLocale } from "@/i18n/routing";
import { openGraphLocaleByLocale } from "@/i18n/routing";
import { MAGIC_CURSOR_HUB_OG_IMAGE } from "@/lib/magic-cursor/magic-cursor-social-image";
import { MAGIC_CURSOR_HUB_PATHNAME } from "@/lib/magic-cursor/routes";
import { buildWebApplicationJsonLd } from "@/lib/seo/structured-data/web-application";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import { absoluteUrl } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.magicCursor.hub" });

  return buildToolPageMetadata({
    locale,
    namespace: "metadata.magicCursor.hub",
    pathname: MAGIC_CURSOR_HUB_PATHNAME,
    socialImage: {
      ...MAGIC_CURSOR_HUB_OG_IMAGE,
      alt: t("ogImageAlt"),
    },
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const meta = await getTranslations({ locale, namespace: "metadata.magicCursor.hub" });
  const jsonLd = buildWebApplicationJsonLd({
    name: meta("applicationName"),
    description: meta("description"),
    url: absoluteUrl(MAGIC_CURSOR_HUB_PATHNAME, locale),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    inLanguage: openGraphLocaleByLocale[locale],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <MagicCursorEffectGalleryPage
        heading={meta("h1")}
        description={meta("lead")}
      />
      <MagicCursorLandingContent />
    </>
  );
}
