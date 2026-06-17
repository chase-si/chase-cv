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

export type MagneticEffectOptions = MagneticOptions & {
  /** 仅 demo 预览：磁吸块填充色，不传给 createEffect */
  itemColor?: string;
};

export type EffectOptions =
  | SpotlightOptions
  | TrailOptions
  | MagneticEffectOptions
  | RingOptions
  | MagnifierOptions
  | InvertRingOptions
  | FlameOptions
  | SmokeOptions;

export type OptionsByEffect = Record<EffectName, EffectOptions>;

