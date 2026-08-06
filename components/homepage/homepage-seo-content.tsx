import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import { HomepageSeoLinks } from "@/components/homepage/homepage-seo-links";
import { projectNavigationItems } from "@/lib/projects";

export async function HomepageSeoContent() {
  const t = await getTranslations("home.seo");
  const tNav = await getTranslations("siteNav.projects.items");

  return (
    <section
      aria-labelledby="home-seo-heading"
      className="border-t border-border bg-muted/20"
      data-testid="homepage-seo-content"
    >
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-3">
          <h2
            id="home-seo-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("toolsTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("toolsIntro")}
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {projectNavigationItems.map((item) => (
            <li key={item.id}>
              <HomepageSeoLinks
                kind="tool"
                href={item.href}
                analyticsTarget={item.analyticsTarget}
                className="group flex h-full flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40"
              >
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                  {tNav(`${item.id}.name`)}
                  <ArrowUpRight
                    className="size-3.5 text-primary opacity-80 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
                <span className="text-sm text-muted-foreground">
                  {tNav(`${item.id}.description`)}
                </span>
              </HomepageSeoLinks>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <HomepageSeoLinks
            kind="contact"
            href={{ pathname: "/", hash: "contact" }}
            channel="contact_section"
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/60"
          >
            {t("contactLink")}
          </HomepageSeoLinks>
        </div>
      </div>
    </section>
  );
}
