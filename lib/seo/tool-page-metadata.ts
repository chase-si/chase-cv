import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import {
  openGraphLocaleByLocale,
  routing,
} from "@/i18n/routing";
import {
  absoluteUrl,
  getCanonicalPathname,
  getLanguageAlternates,
  siteUrl,
} from "@/lib/seo/urls";
import type { MetadataNamespace } from "@/lib/metadata";

export type ToolPageSocialImage = {
  path: string;
  width: number;
  height: number;
  alt: string;
};

export async function buildToolPageMetadata({
  locale,
  namespace,
  pathname,
  socialImage,
}: {
  locale: AppLocale;
  namespace: MetadataNamespace;
  pathname: string;
  socialImage: ToolPageSocialImage;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const site = await getTranslations({ locale, namespace: "metadata" });
  const alternateLocale = routing.locales.filter((item) => item !== locale);
  const title = t("title");
  const description = t("description");
  const url = absoluteUrl(pathname, locale);
  const imageUrl = socialImage.path.startsWith("http")
    ? socialImage.path
    : new URL(socialImage.path, siteUrl).toString();

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: {
      canonical: getCanonicalPathname(pathname, locale),
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
      type: "website",
      images: [
        {
          url: imageUrl,
          width: socialImage.width,
          height: socialImage.height,
          alt: socialImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
