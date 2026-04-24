import type {
  EffectName,
  FlameOptions,
  InvertRingOptions,
  MagneticOptions,
  MagnifierOptions,
  RingOptions,
  SmokeOptions,
  SpotlightOptions,
  TrailOptions,
} from "magic-cursor-effect";

import type { OptionsByEffect } from "@/components/magic-cursor/types";

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
    } satisfies MagneticOptions,
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
      color: "rgba(226,232,240,0.18)",
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

export const defaultOptionsByEffect: OptionsByEffect = Object.values(
  MAGIC_CURSOR_EFFECTS,
).reduce(
  (acc, { type, options }) => {
    acc[type] = options;
    return acc;
  },
  {} as OptionsByEffect,
);
