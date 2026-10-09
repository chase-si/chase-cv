import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import { FindInVideoLandingLinks } from "@/components/find-in-video/landing-links";
import { SeoIndexCopy } from "@/components/seo/seo-index-copy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectNavigationItems } from "@/lib/projects";

const FAQ_KEYS = ["local", "photos", "video", "license", "desktop"] as const;

export async function FindInVideoLandingContent() {
  const t = await getTranslations("findInVideo.landing");
  const tNav = await getTranslations("siteNav.projects.items");
  const relatedTools = projectNavigationItems.filter((item) => item.id !== "findInVideo");

  return (
    <SeoIndexCopy data-testid="find-in-video-landing-content">
      <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
        <section aria-labelledby="find-in-video-purpose-heading" className="space-y-3">
          <h2
            id="find-in-video-purpose-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("purposeTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t("purposeBody")}</p>
        </section>
        <section aria-labelledby="find-in-video-steps-heading" className="space-y-4">
          <h2
            id="find-in-video-steps-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("stepsTitle")}
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <li>{t("step1")}</li>
            <li>{t("step2")}</li>
            <li>{t("step3")}</li>
            <li>{t("step4")}</li>
          </ol>
        </section>
        <section aria-labelledby="find-in-video-faq-heading" className="space-y-4">
          <h2
            id="find-in-video-faq-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("faqTitle")}
          </h2>
          <dl className="space-y-4" data-testid="find-in-video-faq">
            {FAQ_KEYS.map((key) => (
              <div key={key} className="space-y-1 border-b border-border pb-4 last:border-0">
                <dt className="text-sm font-medium text-foreground">{t(`faq.${key}.question`)}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{t(`faq.${key}.answer`)}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby="find-in-video-related-heading" className="space-y-4">
          <h2
            id="find-in-video-related-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("relatedTitle")}
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("relatedToolsTitle")}</CardTitle>
              <CardDescription>{t("relatedToolsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {relatedTools.map((item) => (
                  <li key={item.id}>
                    <FindInVideoLandingLinks
                      kind="related_tool"
                      href={item.href}
                      analyticsTarget={item.analyticsTarget}
                      className="group inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {tNav(`${item.id}.name`)}
                      <ArrowUpRight
                        className="size-3.5 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </FindInVideoLandingLinks>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-3">
            <FindInVideoLandingLinks
              kind="profile"
              href={{ pathname: "/", hash: "experience" }}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/60"
            >
              {t("workExperienceLink")}
            </FindInVideoLandingLinks>
            <FindInVideoLandingLinks
              kind="contact"
              href={{ pathname: "/", hash: "contact" }}
              channel="contact_section"
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/60"
            >
              {t("contactLink")}
            </FindInVideoLandingLinks>
          </div>
        </section>
      </div>
    </SeoIndexCopy>
  );
}
