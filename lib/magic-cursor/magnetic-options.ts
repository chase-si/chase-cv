import type { MagneticOptions } from "magic-cursor-effect";

import type { MagneticEffectOptions } from "@/components/magic-cursor/types";

export function toMagneticLibraryOptions(options: MagneticEffectOptions): MagneticOptions {
  const { itemColor, ...rest } = options;
  void itemColor;
  return rest;
}

export function stripMagneticDemoOptions<T extends Record<string, unknown>>(options: T) {
  const { itemColor, ...rest } = options;
  void itemColor;
  return rest;
}
