import type { EffectName } from "magic-cursor-effect";
import { redirect } from "next/navigation";

import { MagicCursorEffectPage } from "@/app/magic-cursor/[effectName]/view";

import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";

type Props = {
  params: Promise<{ effectName: string }>;
};

function isEffectName(input: string): input is EffectName {
  return (MAGIC_CURSOR_EFFECT_ORDER as readonly string[]).includes(input);
}

export default async function Page(props: Props) {
  const { effectName } = await props.params;
  if (!isEffectName(effectName)) redirect("/magic-cursor");

  return <MagicCursorEffectPage effect={effectName} />;
}

