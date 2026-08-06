import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { FlowLandingContent } from "@/components/flow/landing-content";
import { FlowToolShell } from "@/components/flow/flow-tool-shell";
import type { FlowUiCopy } from "@/components/flow/flow-ui-copy";
import { JsonLd } from "@/components/seo/json-ld";
import type { AppLocale } from "@/i18n/routing";
import { openGraphLocaleByLocale } from "@/i18n/routing";
import { FLOW_OG_IMAGE } from "@/lib/flow/flow-social-image";
import { buildWebApplicationJsonLd } from "@/lib/seo/structured-data/web-application";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import { absoluteUrl } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

const PATHNAME = "/flow";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.flow" });

  return buildToolPageMetadata({
    locale,
    namespace: "metadata.flow",
    pathname: PATHNAME,
    socialImage: {
      ...FLOW_OG_IMAGE,
      alt: t("ogImageAlt"),
    },
  });
}

export default async function FlowPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const meta = await getTranslations({ locale, namespace: "metadata.flow" });
  const jsonLd = buildWebApplicationJsonLd({
    name: meta("applicationName"),
    description: meta("description"),
    url: absoluteUrl(PATHNAME, locale),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    inLanguage: openGraphLocaleByLocale[locale],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <FlowToolShell copy={messages.flowEditor as FlowUiCopy} />
      <FlowLandingContent />
    </>
  );
}
