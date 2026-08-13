import { getTranslations, setRequestLocale } from "next-intl/server";

import { ImageToUiLandingContent } from "@/components/image-to-ui/landing-content";
import { ImageToUiToolShell } from "@/components/image-to-ui/tool-shell";
import { JsonLd } from "@/components/seo/json-ld";
import type { AppLocale } from "@/i18n/routing";
import { openGraphLocaleByLocale } from "@/i18n/routing";
import { IMAGE_TO_UI_OG_IMAGE } from "@/lib/image-to-ui/image-to-ui-social-image";
import { buildWebApplicationJsonLd } from "@/lib/seo/structured-data/web-application";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import { absoluteUrl } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

const PATHNAME = "/image-to-ui";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.imageToUi" });

  return buildToolPageMetadata({
    locale,
    namespace: "metadata.imageToUi",
    pathname: PATHNAME,
    socialImage: {
      ...IMAGE_TO_UI_OG_IMAGE,
      alt: t("ogImageAlt"),
    },
  });
}

export default async function ImageToUiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const meta = await getTranslations({ locale, namespace: "metadata.imageToUi" });
  const jsonLd = buildWebApplicationJsonLd({
    name: meta("applicationName"),
    description: meta("description"),
    url: absoluteUrl(PATHNAME, locale),
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    inLanguage: openGraphLocaleByLocale[locale],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <ImageToUiToolShell />
      <ImageToUiLandingContent />
    </>
  );
}
