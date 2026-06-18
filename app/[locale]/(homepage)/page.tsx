import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomepageHero } from "@/components/homepage/hero";
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <HomepageHero />

        <div className="mt-20 grid gap-16">
          <section id="work" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">{t("workTitle")}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {t("workDescription")}
            </p>
          </section>

          <section id="about" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">{t("aboutTitle")}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {t("aboutDescription")}
            </p>
          </section>

          <section id="contact" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-tight">{t("contactTitle")}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {t("contactDescription")}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
