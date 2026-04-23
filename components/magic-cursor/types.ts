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

export type EffectOptions =
  | SpotlightOptions
  | TrailOptions
  | MagneticOptions
  | RingOptions
  | MagnifierOptions
  | InvertRingOptions
  | FlameOptions
  | SmokeOptions;

export type OptionsByEffect = Record<EffectName, EffectOptions>;

