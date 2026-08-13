import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { MagicCursorEffectPage } from "@/app/[locale]/magic-cursor/[effectName]/view";
import { MagicCursorEffectLandingContent } from "@/components/magic-cursor/effect-landing-content";
import { JsonLd } from "@/components/seo/json-ld";
import type { AppLocale } from "@/i18n/routing";
import { openGraphLocaleByLocale } from "@/i18n/routing";
import {
  magicCursorEffectMetadataNamespace,
} from "@/lib/magic-cursor/effect-seo-data";
import { isMagicCursorEffectName } from "@/lib/magic-cursor/is-effect-name";
import { MAGIC_CURSOR_HUB_OG_IMAGE, magicCursorEffectOgImage } from "@/lib/magic-cursor/magic-cursor-social-image";
import { MAGIC_CURSOR_HUB_PATHNAME, magicCursorEffectPathname } from "@/lib/magic-cursor/routes";
import { buildBreadcrumbListJsonLd } from "@/lib/seo/structured-data/breadcrumb-list";
import { buildWebApplicationJsonLd } from "@/lib/seo/structured-data/web-application";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import { absoluteUrl, localizePathname } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ locale: AppLocale; effectName: string }>;
};

export default async function Page(props: Props) {
  const { locale, effectName } = await props.params;
  if (!isMagicCursorEffectName(effectName)) {
    redirect(localizePathname(MAGIC_CURSOR_HUB_PATHNAME, locale));
  }
  setRequestLocale(locale);

  const pathname = magicCursorEffectPathname(effectName);
  const metaNamespace = magicCursorEffectMetadataNamespace(effectName);
  const meta = await getTranslations({ locale, namespace: metaNamespace });
  const hubMeta = await getTranslations({ locale, namespace: "metadata.magicCursor.hub" });
  const landing = await getTranslations({ locale, namespace: "magicCursor.landing" });

  const breadcrumbJsonLd = buildBreadcrumbListJsonLd([
    {
      name: landing("hubLinkLabel"),
      url: absoluteUrl(MAGIC_CURSOR_HUB_PATHNAME, locale),
    },
    {
      name: meta("breadcrumb"),
      url: absoluteUrl(pathname, locale),
    },
  ]);

  const webAppJsonLd = buildWebApplicationJsonLd({
    name: meta("applicationName"),
    description: meta("description"),
    url: absoluteUrl(pathname, locale),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    inLanguage: openGraphLocaleByLocale[locale],
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={webAppJsonLd} />
      <MagicCursorEffectPage
        effect={effectName}
        heading={meta("h1")}
        description={meta("description")}
        hubLabel={hubMeta("h1")}
        breadcrumbLabel={meta("breadcrumb")}
      />
      <MagicCursorEffectLandingContent effect={effectName} />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, effectName } = await params;

  if (!isMagicCursorEffectName(effectName)) {
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

  const namespace = magicCursorEffectMetadataNamespace(effectName);
  const t = await getTranslations({ locale, namespace });
  const pathname = magicCursorEffectPathname(effectName);

  return buildToolPageMetadata({
    locale,
    namespace,
    pathname,
    socialImage: {
      ...magicCursorEffectOgImage(effectName),
      alt: t("ogImageAlt"),
    },
  });
}
