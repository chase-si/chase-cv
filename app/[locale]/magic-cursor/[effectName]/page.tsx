import type { EffectName } from "magic-cursor-effect";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { MagicCursorEffectPage } from "@/app/[locale]/magic-cursor/[effectName]/view";
import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";
import { localizePathname } from "@/lib/site";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: AppLocale; effectName: string }>;
};

function isEffectName(input: string): input is EffectName {
  return (MAGIC_CURSOR_EFFECT_ORDER as readonly string[]).includes(input);
}

export default async function Page(props: Props) {
  const { locale, effectName } = await props.params;
  if (!isEffectName(effectName)) redirect(localizePathname("/magic-cursor", locale));
  setRequestLocale(locale);

  return <MagicCursorEffectPage effect={effectName} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale, effectName } = await params;
  return buildLocalizedMetadata({
    locale,
    namespace: "metadata.magicCursor",
    pathname: isEffectName(effectName) ? `/magic-cursor/${effectName}` : "/magic-cursor",
  });
}
