import type { EffectName } from "magic-cursor-effect";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import { MagicCursorLandingLinks } from "@/components/magic-cursor/landing-links";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MAGIC_CURSOR_EFFECT_PARAM_KEYS,
  MAGIC_CURSOR_RELATED_EFFECTS,
  magicCursorEffectMetadataNamespace,
} from "@/lib/magic-cursor/effect-seo-data";
import { MAGIC_CURSOR_HUB_PATHNAME, magicCursorEffectPathname } from "@/lib/magic-cursor/routes";
import { projectNavigationItems } from "@/lib/projects";

type Props = {
  effect: EffectName;
};

export async function MagicCursorEffectLandingContent({ effect }: Props) {
  const t = await getTranslations("magicCursor.landing");
  const tMeta = await getTranslations(magicCursorEffectMetadataNamespace(effect));
  const relatedEffects = MAGIC_CURSOR_RELATED_EFFECTS[effect];
  const paramKeys = MAGIC_CURSOR_EFFECT_PARAM_KEYS[effect];
  const relatedTools = projectNavigationItems.filter((item) => item.id !== "magicCursor");
  const tNav = await getTranslations("siteNav.projects.items");
  const relatedEffectLinks = await Promise.all(
    relatedEffects.map(async (related) => {
      const tRelated = await getTranslations(magicCursorEffectMetadataNamespace(related));
      return {
        effect: related,
        label: tRelated("h1"),
      };
    }),
  );

  return (
    <div
      className="border-t border-border bg-muted/20"
      data-testid="magic-cursor-effect-landing-content"
    >
      <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
        <p>
          <MagicCursorLandingLinks
            kind="hub"
            href={MAGIC_CURSOR_HUB_PATHNAME}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("backToHub")}
          </MagicCursorLandingLinks>
        </p>

        <section aria-labelledby="magic-cursor-behavior-heading" className="space-y-3">
          <h2
            id="magic-cursor-behavior-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("behaviorTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {tMeta("behavior")}
          </p>
        </section>

        <section aria-labelledby="magic-cursor-use-cases-heading" className="space-y-3">
          <h2
            id="magic-cursor-use-cases-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("useCasesTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {tMeta("useCases")}
          </p>
        </section>

        <section aria-labelledby="magic-cursor-params-heading" className="space-y-4">
          <h2
            id="magic-cursor-params-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("paramsTitle")}
          </h2>
          <ul
            className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base"
            data-testid="magic-cursor-effect-params"
          >
            {paramKeys.map((key) => (
              <li key={key}>{tMeta(`params.${key}`)}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="magic-cursor-related-effects-heading" className="space-y-4">
          <h2
            id="magic-cursor-related-effects-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {t("relatedEffectsTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("relatedEffectsDescription")}</p>
          <ul className="space-y-2" data-testid="magic-cursor-related-effects">
            {relatedEffectLinks.map((item) => (
              <li key={item.effect}>
                <MagicCursorLandingLinks
                  kind="related_effect"
                  effect={item.effect}
                  href={magicCursorEffectPathname(item.effect)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {item.label}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </MagicCursorLandingLinks>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="magic-cursor-related-tools-heading" className="space-y-4">
          <h2
            id="magic-cursor-related-tools-heading"
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
