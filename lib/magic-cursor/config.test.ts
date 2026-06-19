import { describe, expect, it } from "vitest";

import {
  MAGIC_CURSOR_EFFECT_ORDER,
  MAGIC_CURSOR_EFFECTS,
  defaultOptionsByEffect,
  clampMagicCursorNumber,
  resolveInvertRingBlendModeSelectValue,
  MAGIC_CURSOR_MAGNETIC_SIDEBAR,
  MAGIC_CURSOR_SIDEBAR_BOUNDS,
} from "@/lib/magic-cursor/config";

describe("magic-cursor gallery config", () => {
  it("orders every configured effect exactly once", () => {
    const types = Object.values(MAGIC_CURSOR_EFFECTS).map((e) => e.type);
    expect([...MAGIC_CURSOR_EFFECT_ORDER].sort()).toEqual([...types].sort());
    expect(new Set(MAGIC_CURSOR_EFFECT_ORDER).size).toBe(MAGIC_CURSOR_EFFECT_ORDER.length);
  });

  it("provides default options for each effect in the gallery order", () => {
    for (const effect of MAGIC_CURSOR_EFFECT_ORDER) {
      expect(defaultOptionsByEffect[effect]).toBeDefined();
    }
  });
});

describe("magic-cursor magnetic sidebar config", () => {
  it("exposes stable selector default and strength bounds", () => {
    expect(MAGIC_CURSOR_MAGNETIC_SIDEBAR.defaultSelector).toBe("[data-magnetic]");
    expect(MAGIC_CURSOR_MAGNETIC_SIDEBAR.strength.min).toBe(0);
    expect(MAGIC_CURSOR_MAGNETIC_SIDEBAR.strength.max).toBe(1);
    expect(defaultOptionsByEffect.magnetic.selector).toBe(
      MAGIC_CURSOR_MAGNETIC_SIDEBAR.defaultSelector,
    );
  });
});

describe("clampMagicCursorNumber", () => {
  it("clamps values to the given range", () => {
    expect(clampMagicCursorNumber(5, 0, 3)).toBe(3);
    expect(clampMagicCursorNumber(-1, 0, 1)).toBe(0);
    expect(clampMagicCursorNumber(0.5, 0, 1)).toBe(0.5);
  });
});

describe("resolveInvertRingBlendModeSelectValue", () => {
  it("falls back to difference when blend mode is missing or unknown", () => {
    expect(resolveInvertRingBlendModeSelectValue({})).toBe("difference");
    expect(resolveInvertRingBlendModeSelectValue({ blendMode: "not-a-mode" })).toBe(
      "difference",
    );
  });

  it("keeps a known blend mode from the option list", () => {
    expect(resolveInvertRingBlendModeSelectValue({ blendMode: "multiply" })).toBe("multiply");
  });
});

describe("MAGIC_CURSOR_SIDEBAR_BOUNDS", () => {
  it("defines spotlight radius bounds used by the sidebar", () => {
    expect(MAGIC_CURSOR_SIDEBAR_BOUNDS.spotlight.radius).toEqual({
      min: 10,
      max: 260,
      step: 1,
      fallback: 140,
    });
  });
});
