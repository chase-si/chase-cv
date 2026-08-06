import { describe, expect, it } from "vitest";

import { MAGIC_CURSOR_EFFECT_ORDER } from "@/lib/constants/magic-cursor";
import { isMagicCursorEffectName } from "@/lib/magic-cursor/is-effect-name";

describe("isMagicCursorEffectName", () => {
  it("accepts every supported effect slug", () => {
    for (const effect of MAGIC_CURSOR_EFFECT_ORDER) {
      expect(isMagicCursorEffectName(effect)).toBe(true);
    }
  });

  it("rejects unknown slugs that should redirect to the hub", () => {
    expect(isMagicCursorEffectName("not-an-effect")).toBe(false);
    expect(isMagicCursorEffectName("Ring")).toBe(false);
  });
});
