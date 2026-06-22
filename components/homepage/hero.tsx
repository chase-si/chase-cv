"use client";

import { useTranslations } from "next-intl";

import { HomepageHeroWorkbenchPreview } from "@/components/homepage/hero-workbench-preview";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomepageHero() {
  const t = useTranslations("home");

  const paragraphs = [
    t("introLead"),
    t("introPast"),
    `${t("introPresent")} ${t("introPresentDetail")}`,
    t("introFoundation"),
  ];

  return (
    <section className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-[2px_2px_0_0] shadow-foreground/80">
          <span className="inline-block size-2 rounded-full bg-chart-2" />
          {t("eyebrow")}
        </div>

        <div className="mt-6 space-y-4 text-pretty text-base leading-7 text-foreground sm:text-lg">
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={cn(
                index === 0 && "text-2xl font-semibold tracking-tight sm:text-3xl",
                index === paragraphs.length - 1 && "text-muted-foreground",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            render={<Link href="#projects" />}
            nativeButton={false}
            size="lg"
            className="shadow-[3px_3px_0_0] shadow-foreground/90"
          >
            {t("primaryCta")}
          </Button>
          <Button
            render={<Link href="#experience" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="bg-card shadow-[3px_3px_0_0] shadow-foreground/80"
          >
            {t("secondaryCta")}
          </Button>
        </div>
      </div>

      <div className="lg:col-span-5">
        <HomepageHeroWorkbenchPreview />
      </div>
    </section>
  );
}
