import { getTranslations, setRequestLocale } from "next-intl/server";

import { FindInVideoLandingContent } from "@/components/find-in-video/landing-content";
import { FindInVideoTool } from "@/components/find-in-video/find-in-video-tool";
import { JsonLd } from "@/components/seo/json-ld";
import type { AppLocale } from "@/i18n/routing";
import { openGraphLocaleByLocale } from "@/i18n/routing";
import { FIND_IN_VIDEO_OG_IMAGE } from "@/lib/find-in-video/find-in-video-social-image";
import { buildWebApplicationJsonLd } from "@/lib/seo/structured-data/web-application";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import { absoluteUrl } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

const PATHNAME = "/find-in-video";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.findInVideo" });

  return buildToolPageMetadata({
    locale,
    namespace: "metadata.findInVideo",
    pathname: PATHNAME,
    socialImage: {
      ...FIND_IN_VIDEO_OG_IMAGE,
      alt: t("ogImageAlt"),
    },
  });
}

export default async function FindInVideoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const meta = await getTranslations({ locale, namespace: "metadata.findInVideo" });
  const jsonLd = buildWebApplicationJsonLd({
    name: meta("applicationName"),
    description: meta("description"),
    url: absoluteUrl(PATHNAME, locale),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    inLanguage: openGraphLocaleByLocale[locale],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <FindInVideoTool />
      <FindInVideoLandingContent />
    </>
  );
}
