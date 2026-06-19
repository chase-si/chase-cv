import type {
  EffectName,
  FlameOptions,
  InvertRingOptions,
  MagnifierOptions,
  RingOptions,
  SmokeOptions,
  SpotlightOptions,
  TrailOptions,
} from "magic-cursor-effect";

import type { MagneticEffectOptions, OptionsByEffect } from "@/components/magic-cursor/types";

export const MAGIC_CURSOR_EFFECTS = {
  RING: {
    type: "ring" as const,
    options: {
      size: 38,
      color: "rgba(99, 102, 241, 0.95)",
      borderWidth: 2,
      smoothing: 0.9,
    } satisfies RingOptions,
  },
  MAGNIFIER: {
    type: "magnifier" as const,
    options: {
      size: 52,
      color: "rgba(99, 102, 241, 0.95)",
      borderWidth: 2,
      smoothing: 0.9,
      zoom: 1.6,
      lensBlurPx: 6,
      lensBrightness: 1.15,
      lensSaturate: 1.25,
      lensFillOpacity: 0.06,
    } satisfies MagnifierOptions,
  },
  TRAIL: {
    type: "trail" as const,
    options: {
      maxDots: 50,
      color: "rgba(54, 255, 155, 0.65)",
      size: 18,
      throttleMs: 5,
    } satisfies TrailOptions,
  },
  SPOTLIGHT: {
    type: "spotlight" as const,
    options: {
      radius: 80,
      dimColor: "rgba(0, 0, 0, 0.82)",
    } satisfies SpotlightOptions,
  },
  MAGNETIC: {
    type: "magnetic" as const,
    options: {
      strength: 0.35,
      selector: "[data-magnetic]",
      itemColor: "",
    } satisfies MagneticEffectOptions,
  },
  FLAME: {
    type: "flame" as const,
    options: {
      emission: 2,
      size: 10,
      lifeMs: 700,
      rise: 1.6,
      jitter: 0.9,
      maxDpr: 2,
    } satisfies FlameOptions,
  },
  SMOKE: {
    type: "smoke" as const,
    options: {
      emission: 2,
      size: 18,
      lifeMs: 1400,
      rise: 0.8,
      drift: 0.7,
      color: "rgba(99, 102, 241, 0.95)",
    } satisfies SmokeOptions,
  },
  INVERT_RING: {
    type: "invertRing" as const,
    options: {
      size: 42,
      color: "rgba(99, 102, 241, 0.95)",
      borderWidth: 2,
      smoothing: 0.9,
      blendMode: "difference",
    } satisfies InvertRingOptions,
  },
} as const;

export const MAGIC_CURSOR_EFFECT_ORDER: readonly EffectName[] = [
  "ring",
  "magnifier",
  "trail",
  "spotlight",
  "magnetic",
  "flame",
  "smoke",
  "invertRing",
];

export const INVERT_RING_BLEND_MODE_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "normal", label: "normal" },
  { value: "multiply", label: "multiply" },
  { value: "screen", label: "screen" },
  { value: "overlay", label: "overlay" },
  { value: "darken", label: "darken" },
  { value: "lighten", label: "lighten" },
  { value: "color-dodge", label: "color-dodge" },
  { value: "color-burn", label: "color-burn" },
  { value: "hard-light", label: "hard-light" },
  { value: "soft-light", label: "soft-light" },
  { value: "difference", label: "difference（默认）" },
  { value: "exclusion", label: "exclusion" },
  { value: "hue", label: "hue" },
  { value: "saturation", label: "saturation" },
  { value: "color", label: "color" },
  { value: "luminosity", label: "luminosity" },
  { value: "plus-darker", label: "plus-darker" },
  { value: "plus-lighter", label: "plus-lighter" },
];

export const defaultOptionsByEffect: OptionsByEffect = Object.values(
  MAGIC_CURSOR_EFFECTS,
).reduce(
  (acc, { type, options }) => {
    acc[type] = options;
    return acc;
  },
  {} as OptionsByEffect,
);

export const MAGIC_CURSOR_MAGNETIC_SIDEBAR = {
  defaultSelector: "[data-magnetic]",
  strength: { min: 0, max: 1, step: 0.01, fallback: 0.35 },
} as const;

type SliderBound = { min: number; max: number; step: number; fallback: number };

export const MAGIC_CURSOR_SIDEBAR_BOUNDS = {
  spotlight: {
    radius: { min: 10, max: 260, step: 1, fallback: 140 } satisfies SliderBound,
  },
  trail: {
    maxDots: { min: 6, max: 2000, step: 1, fallback: 24 } satisfies SliderBound,
    size: { min: 2, max: 180, step: 1, fallback: 6 } satisfies SliderBound,
    throttleMs: { min: 0, max: 40, step: 1, fallback: 16 } satisfies SliderBound,
  },
  ring: {
    size: { min: 18, max: 120, step: 1, fallback: 36 } satisfies SliderBound,
    borderWidth: { min: 1, max: 8, step: 1, fallback: 2 } satisfies SliderBound,
    borderWidthInvertRingMin: 0,
    smoothing: { min: 0.02, max: 0.5, step: 0.01, fallback: 0.18 } satisfies SliderBound,
  },
  magnifier: {
    zoom: { min: 1, max: 2.6, step: 0.05, fallback: 1.6 } satisfies SliderBound,
    lensBlurPx: { min: 0, max: 24, step: 1, fallback: 6 } satisfies SliderBound,
    lensBrightness: { min: 0.5, max: 2, step: 0.05, fallback: 1.15 } satisfies SliderBound,
    lensSaturate: { min: 0, max: 2.5, step: 0.05, fallback: 1.25 } satisfies SliderBound,
    lensFillOpacity: { min: 0, max: 0.35, step: 0.01, fallback: 0.06 } satisfies SliderBound,
  },
  flameSmoke: {
    emission: { min: 1, max: 8, step: 1, fallback: 2 } satisfies SliderBound,
    size: { min: 4, max: 40, step: 1, fallback: 10 } satisfies SliderBound,
    lifeMs: { min: 200, max: 2400, step: 20, fallback: 700 } satisfies SliderBound,
  },
  flame: {
    rise: { min: 0, max: 4, step: 0.05, fallback: 1.6 } satisfies SliderBound,
    jitter: { min: 0, max: 3, step: 0.05, fallback: 0.9 } satisfies SliderBound,
    maxDpr: { min: 1, max: 4, step: 0.5, fallback: 2 } satisfies SliderBound,
  },
  smoke: {
    rise: { min: 0, max: 2.4, step: 0.05, fallback: 0.8 } satisfies SliderBound,
    drift: { min: 0, max: 2, step: 0.05, fallback: 0.7 } satisfies SliderBound,
  },
} as const;

export function clampMagicCursorNumber(input: number, min: number, max: number) {
  return Math.min(max, Math.max(min, input));
}

export function resolveInvertRingBlendModeSelectValue(
  options: Pick<InvertRingOptions, "blendMode">,
): string {
  const raw = options.blendMode ?? "difference";
  return INVERT_RING_BLEND_MODE_OPTIONS.some((o) => o.value === raw) ? raw : "difference";
}

export function ringBorderWidthMinForEffect(effect: EffectName): number {
  return effect === "invertRing"
    ? MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.borderWidthInvertRingMin
    : MAGIC_CURSOR_SIDEBAR_BOUNDS.ring.borderWidth.min;
}
