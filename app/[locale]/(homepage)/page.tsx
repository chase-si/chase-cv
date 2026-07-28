import { setRequestLocale } from "next-intl/server";

import { HomepageContact } from "@/components/homepage/homepage-contact";
import { HomepageHero } from "@/components/homepage/hero";
import { HomepageProjectShowcase } from "@/components/homepage/project-showcase";
import { HomepageWorkExperienceTimeline } from "@/components/homepage/work-experience-timeline";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    namespace: "metadata.home",
    pathname: "/",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HomepageHero />

        <div className="mt-14 grid gap-16 sm:mt-16">
          <HomepageProjectShowcase />

          <HomepageWorkExperienceTimeline />

          <HomepageContact />
        </div>
      </main>
    </div>
  );
}
