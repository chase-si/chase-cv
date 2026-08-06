export const MAGIC_CURSOR_HUB_PATHNAME = "/magic-cursor" as const;

export function magicCursorEffectPathname(effect: string) {
  return `${MAGIC_CURSOR_HUB_PATHNAME}/${effect}`;
}
