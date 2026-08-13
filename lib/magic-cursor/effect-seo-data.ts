import type { EffectName } from "magic-cursor-effect";

import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";

export const MAGIC_CURSOR_EFFECT_PARAM_KEYS = {
  ring: ["size", "color", "borderWidth", "smoothing"],
  magnifier: ["size", "zoom", "lensBlurPx", "lensBrightness", "lensSaturate", "smoothing"],
  trail: ["maxDots", "size", "color", "throttleMs"],
  spotlight: ["radius", "dimColor"],
  magnetic: ["strength", "selector", "itemColor"],
  flame: ["emission", "size", "lifeMs", "rise", "jitter", "maxDpr"],
  smoke: ["emission", "size", "lifeMs", "rise", "drift", "color"],
  invertRing: ["size", "color", "borderWidth", "smoothing", "blendMode", "blendBackground"],
  electricArc: ["emission", "length", "radius", "lifeMs", "color", "glowColor", "clickBurst"],
} as const satisfies Record<EffectName, readonly string[]>;

export const MAGIC_CURSOR_RELATED_EFFECTS: Record<EffectName, readonly EffectName[]> = {
  ring: ["magnifier", "invertRing", "trail"],
  magnifier: ["ring", "spotlight", "invertRing"],
  trail: ["flame", "smoke", "electricArc"],
  spotlight: ["magnifier", "magnetic", "invertRing"],
  magnetic: ["spotlight", "ring", "magnifier"],
  flame: ["smoke", "electricArc", "trail"],
  smoke: ["flame", "trail", "electricArc"],
  invertRing: ["ring", "magnifier", "spotlight"],
  electricArc: ["flame", "trail", "smoke"],
};

import type { MagicCursorEffectMetadataNamespace } from "@/lib/metadata";

export type { MagicCursorEffectMetadataNamespace };

export function magicCursorEffectMetadataNamespace(
  effect: EffectName,
): MagicCursorEffectMetadataNamespace {
  return `metadata.magicCursor.effects.${effect}`;
}

export function listMagicCursorEffectSeoEffects() {
  return MAGIC_CURSOR_EFFECT_ORDER;
}
