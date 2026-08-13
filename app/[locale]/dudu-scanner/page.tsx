import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { DuduScannerApp } from "@/components/dudu-scanner/dudu-scanner-app";
import { DuduScannerLandingContent } from "@/components/dudu-scanner/landing-content";
import { JsonLd } from "@/components/seo/json-ld";
import type { AppLocale } from "@/i18n/routing";
import { openGraphLocaleByLocale } from "@/i18n/routing";
import { DUDU_SCANNER_OG_IMAGE } from "@/lib/dudu-scanner/dudu-scanner-social-image";
import { DUDU_SCANNER_PATHNAME } from "@/lib/dudu-scanner/routes";
import { buildWebApplicationJsonLd } from "@/lib/seo/structured-data/web-application";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import { absoluteUrl } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.duduScanner" });

  return buildToolPageMetadata({
    locale,
    namespace: "metadata.duduScanner",
    pathname: DUDU_SCANNER_PATHNAME,
    socialImage: {
      ...DUDU_SCANNER_OG_IMAGE,
      alt: t("ogImageAlt"),
    },
  });
}

export default async function DuduScannerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getMessages({ locale });
  const meta = await getTranslations({ locale, namespace: "metadata.duduScanner" });
  const jsonLd = buildWebApplicationJsonLd({
    name: meta("applicationName"),
    description: meta("description"),
    url: absoluteUrl(DUDU_SCANNER_PATHNAME, locale),
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    inLanguage: openGraphLocaleByLocale[locale],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <DuduScannerApp />
      <DuduScannerLandingContent />
    </>
  );
}
