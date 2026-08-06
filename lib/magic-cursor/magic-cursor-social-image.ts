import type { EffectName } from "magic-cursor-effect";

export const MAGIC_CURSOR_HUB_OG_IMAGE = {
  path: "/og/magic-cursor.jpg",
  width: 1200,
  height: 630,
} as const;

export function magicCursorEffectOgImage(effect: EffectName) {
  return {
    path: `/og/magic-cursor/${effect}.jpg`,
    width: 1200,
    height: 630,
  } as const;
}
