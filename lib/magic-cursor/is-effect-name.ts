import type { EffectName } from "magic-cursor-effect";

import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";

export function isMagicCursorEffectName(input: string): input is EffectName {
  return (MAGIC_CURSOR_EFFECT_ORDER as readonly string[]).includes(input);
}
