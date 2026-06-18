import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export function HomepageHero() {
  const t = useTranslations("home");

  return (
    <section className="grid items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="inline-flex items-center gap-2 border border-zinc-900/10 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm dark:border-white/10 dark:bg-black/40 dark:text-zinc-200">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.20)]" />
          {t("eyebrow")}
        </div>

        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          {t("headlinePrefix")}
          <span className="relative mx-2 inline-block">
            <span className="absolute -inset-1 -z-10 bg-linear-to-r from-indigo-500/25 via-fuchsia-500/20 to-sky-500/25 blur-xl" />
            <span className="bg-linear-to-r from-indigo-600 via-fuchsia-600 to-sky-600 bg-clip-text text-transparent">
              {t("headlineHighlight")}
            </span>
          </span>
          {t("headlineSuffix")}
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
          {t("intro")}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="#work"
            className="inline-flex h-11 items-center justify-center bg-zinc-950 px-5 text-sm font-medium text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition hover:-translate-y-px hover:shadow-[0_22px_70px_rgba(0,0,0,0.28)] dark:bg-white dark:text-black dark:shadow-[0_22px_80px_rgba(0,0,0,0.45)]"
          >
            {t("primaryCta")}
          </Link>
          <Link
            href="#about"
            className="inline-flex h-11 items-center justify-center border border-zinc-900/10 bg-white/70 px-5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-black/40 dark:text-white dark:hover:bg-black/50"
          >
            {t("secondaryCta")}
          </Link>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 sm:pl-2">
            {t("stack")}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-4 -z-10 bg-linear-to-b from-white/90 via-white/40 to-white/80 blur-2xl dark:from-black/60 dark:via-black/30 dark:to-black/60"
          />

          <div className="border border-zinc-900/10 bg-white/70 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="grid gap-4">
              <div className="border border-zinc-900/10 bg-white/80 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/40 dark:shadow-[0_22px_70px_rgba(0,0,0,0.50)]">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("nowLabel")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {t("nowValue")}
                </div>
              </div>

              <div className="border border-zinc-900/10 bg-white/80 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/40 dark:shadow-[0_22px_70px_rgba(0,0,0,0.50)]">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("focusLabel")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {t("focusValue")}
                </div>
              </div>

              <div className="border border-zinc-900/10 bg-white/80 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/40 dark:shadow-[0_22px_70px_rgba(0,0,0,0.50)]">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("expectLabel")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {t("expectValue")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
