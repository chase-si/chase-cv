import { describe, expect, it } from "vitest";

import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";
import { MAGIC_CURSOR_EFFECT_PARAM_KEYS } from "@/lib/magic-cursor/effect-seo-data";
import {
  MAGIC_CURSOR_HUB_OG_IMAGE,
  magicCursorEffectOgImage,
} from "@/lib/magic-cursor/magic-cursor-social-image";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

function effectMeta(locale: typeof enMessages, effect: string) {
  return locale.metadata.magicCursor.effects[
    effect as keyof typeof locale.metadata.magicCursor.effects
  ];
}

describe("Magic Cursor SEO catalog", () => {
  it("uses unique bilingual titles and descriptions for the hub and every effect", () => {
    for (const messages of [enMessages, zhMessages]) {
      const hub = messages.metadata.magicCursor.hub;
      const titles = new Set<string>([hub.title]);
      const descriptions = new Set<string>([hub.description]);

      for (const effect of MAGIC_CURSOR_EFFECT_ORDER) {
        const meta = effectMeta(messages, effect);
        expect(titles.has(meta.title)).toBe(false);
        expect(descriptions.has(meta.description)).toBe(false);
        titles.add(meta.title);
        descriptions.add(meta.description);
        expect(meta.h1.length).toBeGreaterThan(0);
        expect(meta.behavior.length).toBeGreaterThan(0);
        expect(meta.useCases.length).toBeGreaterThan(0);
      }
    }
  });

  it("documents every sidebar parameter key in locale metadata", () => {
    for (const messages of [enMessages, zhMessages]) {
      for (const effect of MAGIC_CURSOR_EFFECT_ORDER) {
        const meta = effectMeta(messages, effect);
        for (const key of MAGIC_CURSOR_EFFECT_PARAM_KEYS[effect]) {
          expect(meta.params[key as keyof typeof meta.params]).toMatch(key);
        }
      }
    }
  });

  it("assigns distinct social preview paths for the hub and each effect", () => {
    const paths = new Set<string>([MAGIC_CURSOR_HUB_OG_IMAGE.path]);
    for (const effect of MAGIC_CURSOR_EFFECT_ORDER) {
      const image = magicCursorEffectOgImage(effect);
      expect(paths.has(image.path)).toBe(false);
      paths.add(image.path);
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
    }
  });
});
