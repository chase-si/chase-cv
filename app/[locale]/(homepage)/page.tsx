import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomepageHero } from "@/components/homepage/hero";
import { HomepageProjectShowcase } from "@/components/homepage/project-showcase";
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
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
        <HomepageHero />

        <div className="mt-16 grid gap-16 sm:mt-20">
          <HomepageProjectShowcase />

          <section id="experience" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">{t("experienceTitle")}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("experienceDescription")}
            </p>
          </section>

          <section id="contact" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">{t("contactTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("contactDescription")}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
