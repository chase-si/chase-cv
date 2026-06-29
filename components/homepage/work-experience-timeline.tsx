"use client";

import { useTranslations } from "next-intl";

import { HomepageMotion } from "@/components/homepage/homepage-motion";
import { WorkExperienceScrollStage } from "@/components/homepage/work-experience-scroll-stage";
import { cn } from "@/lib/utils";

export function HomepageWorkExperienceTimeline() {
  const t = useTranslations("home");

  return (
    <section id="experience" aria-label={t("experience.sectionAria")} className={cn("scroll-mt-24 space-y-6")}>
      <header className="space-y-3">
        <HomepageMotion kind="reveal" className="flex items-center gap-4">
          <span className="size-5 shrink-0 bg-foreground" />
          <h2 className="text-3xl font-black tracking-tight">{t("experienceTitle")}</h2>
          <span className="h-px flex-1 bg-border" />
          <p className="hidden max-w-sm text-xs leading-relaxed text-muted-foreground md:block">
            {t("experienceDescription")}
          </p>
        </HomepageMotion>
        <HomepageMotion as="p" kind="reveal" className="max-w-3xl text-sm leading-relaxed text-foreground">
          {t("experience.supportingLine")}
        </HomepageMotion>
      </header>

      <WorkExperienceScrollStage />
    </section>
  );
}
