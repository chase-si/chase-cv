import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import { FlowLandingLinks } from "@/components/flow/landing-links";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectNavigationItems } from "@/lib/projects";

const FAQ_KEYS = ["sfc", "edit", "demo", "export", "browser"] as const;

export async function FlowLandingContent() {
  const t = await getTranslations("flowEditor.landing");
  const tNav = await getTranslations("siteNav.projects.items");
  const relatedTools = projectNavigationItems.filter((item) => item.id !== "flowEditor");

  return (
    <div
      className="border-t border-border bg-muted/20"
      data-testid="flow-landing-content"
    >
      <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
        <section aria-labelledby="flow-purpose-heading" className="space-y-3">
          <h2
            id="flow-purpose-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("purposeTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("purposeBody")}
          </p>
        </section>

        <section aria-labelledby="flow-steps-heading" className="space-y-4">
          <h2
            id="flow-steps-heading"
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

        <section aria-labelledby="flow-use-cases-heading" className="space-y-4">
          <h2
            id="flow-use-cases-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("useCasesTitle")}
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <li>{t("useCase1")}</li>
            <li>{t("useCase2")}</li>
            <li>{t("useCase3")}</li>
          </ul>
        </section>

        <section aria-labelledby="flow-faq-heading" className="space-y-4">
          <h2
            id="flow-faq-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("faqTitle")}
          </h2>
          <dl className="space-y-4" data-testid="flow-faq">
            {FAQ_KEYS.map((key) => (
              <div key={key} className="space-y-1 border-b border-border pb-4 last:border-0">
                <dt className="text-sm font-medium text-foreground">{t(`faq.${key}.question`)}</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">
                  {t(`faq.${key}.answer`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="flow-related-heading" className="space-y-4">
          <h2
            id="flow-related-heading"
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
                    <FlowLandingLinks
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
                    </FlowLandingLinks>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-3">
            <FlowLandingLinks
              kind="profile"
              href={{ pathname: "/", hash: "experience" }}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/60"
            >
              {t("workExperienceLink")}
            </FlowLandingLinks>
            <FlowLandingLinks
              kind="contact"
              href={{ pathname: "/", hash: "contact" }}
              channel="contact_section"
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/60"
            >
              {t("contactLink")}
            </FlowLandingLinks>
          </div>
        </section>
      </div>
    </div>
  );
}
