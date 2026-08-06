import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import { MagicCursorLandingLinks } from "@/components/magic-cursor/landing-links";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";
import { magicCursorEffectMetadataNamespace } from "@/lib/magic-cursor/effect-seo-data";
import { magicCursorEffectPathname } from "@/lib/magic-cursor/routes";
import { projectNavigationItems } from "@/lib/projects";

export async function MagicCursorLandingContent() {
  const t = await getTranslations("magicCursor.landing");
  const tNav = await getTranslations("siteNav.projects.items");
  const relatedTools = projectNavigationItems.filter((item) => item.id !== "magicCursor");
  const catalogItems = await Promise.all(
    MAGIC_CURSOR_EFFECT_ORDER.map(async (effect) => {
      const tMeta = await getTranslations(magicCursorEffectMetadataNamespace(effect));
      return {
        effect,
        title: tMeta("h1"),
        description: tMeta("description"),
      };
    }),
  );

  return (
    <div
      className="border-t border-border bg-muted/20"
      data-testid="magic-cursor-landing-content"
    >
      <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
        <section aria-labelledby="magic-cursor-purpose-heading" className="space-y-3">
          <h2
            id="magic-cursor-purpose-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("purposeTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("purposeBody")}
          </p>
        </section>

        <section aria-labelledby="magic-cursor-catalog-heading" className="space-y-4">
          <h2
            id="magic-cursor-catalog-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("catalogTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t("catalogDescription")}
          </p>
          <ul className="grid gap-2 sm:grid-cols-2" data-testid="magic-cursor-effect-catalog">
            {catalogItems.map((item) => (
              <li key={item.effect}>
                <MagicCursorLandingLinks
                  kind="hub_effect"
                  effect={item.effect}
                  href={magicCursorEffectPathname(item.effect)}
                  className="flex flex-col rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-xs transition-colors hover:bg-muted/40"
                >
                  <span className="font-medium text-foreground">{item.title}</span>
                  <span className="text-muted-foreground">{item.description}</span>
                </MagicCursorLandingLinks>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="magic-cursor-related-heading" className="space-y-4">
          <h2
            id="magic-cursor-related-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("relatedToolsTitle")}
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
                    <MagicCursorLandingLinks
                      kind="related_tool"
                      href={item.href}
                      analyticsTarget={item.analyticsTarget}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {tNav(`${item.id}.name`)}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </MagicCursorLandingLinks>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
