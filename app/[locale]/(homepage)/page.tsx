import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomepageContact } from "@/components/homepage/homepage-contact";
import { HomepageHero } from "@/components/homepage/hero";
import { HomepageProjectShowcase } from "@/components/homepage/project-showcase";
import { HomepageSeoContent } from "@/components/homepage/homepage-seo-content";
import { HomepageWorkExperienceTimeline } from "@/components/homepage/work-experience-timeline";
import { JsonLd } from "@/components/seo/json-ld";
import type { AppLocale } from "@/i18n/routing";
import { HOME_OG_IMAGE } from "@/lib/seo/home-social-image";
import { buildHomeProfilePageJsonLd } from "@/lib/seo/structured-data/profile-page";
import { buildToolPageMetadata } from "@/lib/seo/tool-page-metadata";
import { absoluteUrl } from "@/lib/seo/urls";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

const PATHNAME = "/";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return buildToolPageMetadata({
    locale,
    namespace: "metadata.home",
    pathname: PATHNAME,
    socialImage: {
      ...HOME_OG_IMAGE,
      alt: t("ogImageAlt"),
    },
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const meta = await getTranslations({ locale, namespace: "metadata.home" });
  const pageUrl = absoluteUrl(PATHNAME, locale);
  const jsonLd = buildHomeProfilePageJsonLd({
    name: meta("personName"),
    description: meta("personDescription"),
    pageUrl,
    profileUrl: pageUrl,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          <HomepageHero />

          <div className="mt-14 grid gap-16 sm:mt-16">
            <HomepageProjectShowcase />

            <HomepageWorkExperienceTimeline />

            <HomepageContact />
          </div>
        </main>
        <HomepageSeoContent />
      </div>
    </>
  );
}
