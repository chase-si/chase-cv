"use client";

import { useTranslations } from "next-intl";

import { HomepageHeroWorkbenchPreview } from "@/components/homepage/hero-workbench-preview";
import { HomepageMotion } from "@/components/homepage/homepage-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function HomepageHero() {
  const t = useTranslations("home");

  return (
    <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
      <div>
        <HomepageMotion
          kind="hero"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-[2px_2px_0_0] shadow-foreground/50"
        >
          <span className="inline-block size-2 rounded-full bg-chart-2" />
          {t("eyebrow")}
        </HomepageMotion>

        <div className="mt-6 space-y-5 text-pretty text-lg font-semibold leading-8 text-foreground sm:text-2xl sm:leading-10">
          <HomepageMotion as="p" kind="hero" className="text-4xl font-black tracking-tight sm:text-6xl">
            {t("introLeadPrefix")}
            <span className="text-primary">{t("introLeadName")}</span>
            {t("introLeadSuffix")}
          </HomepageMotion>
          <HomepageMotion as="p" kind="hero">
            {t("introPresent")}{" "}
            <span className="text-primary">{t("introPresentDetailLead")}</span>
            {t("introPresentDetailRest")}
          </HomepageMotion>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["product", "ai", "tools"] as const).map((key) => (
            <HomepageMotion
              key={key}
              kind="hero"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs shadow-[2px_2px_0_0] shadow-foreground/50"
            >
              <span className="size-1.5 rounded-full bg-chart-2" />
              {t(`focusChips.${key}`)}
            </HomepageMotion>
          ))}
        </div>

        <HomepageMotion kind="hero" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            render={<Link href="#projects" />}
            nativeButton={false}
            size="lg"
            className="min-w-40 rounded-xl shadow-xs"
          >
            {t("primaryCta")}
          </Button>
          <Button
            render={<Link href="#experience" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="min-w-40 rounded-xl bg-card shadow-xs"
          >
            {t("secondaryCta")}
          </Button>
        </HomepageMotion>
      </div>

      <HomepageMotion kind="hero">
        <HomepageHeroWorkbenchPreview />
      </HomepageMotion>
    </section>
  );
}
