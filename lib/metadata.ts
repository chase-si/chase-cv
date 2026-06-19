import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import {
  openGraphLocaleByLocale,
  routing,
} from "@/i18n/routing";
import {
  absoluteUrl,
  getLanguageAlternates,
  localizePathname,
  siteUrl,
} from "@/lib/site";

type MetadataNamespace =
  | "metadata.home"
  | "metadata.magicCursor"
  | "metadata.imageToUi"
  | "metadata.flow"
  | "metadata.notFound";

export async function buildLocalizedMetadata({
  locale,
  namespace,
  pathname,
}: {
  locale: AppLocale;
  namespace: MetadataNamespace;
  pathname: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const site = await getTranslations({ locale, namespace: "metadata" });
  const alternateLocale = routing.locales.filter((item) => item !== locale);
  const title = t("title");
  const description = t("description");
  const url = absoluteUrl(pathname, locale);

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: {
      canonical: localizePathname(pathname, locale),
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site("siteName"),
      locale: openGraphLocaleByLocale[locale],
      alternateLocale: alternateLocale.map(
        (item) => openGraphLocaleByLocale[item],
      ),
      images: [
        {
          url: "/logo.png",
          alt: site("siteName"),
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}
