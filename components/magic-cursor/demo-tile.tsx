"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

import type {
  Destroyable,
  EffectName,
  ElectricArcOptions,
  FlameOptions,
  InvertRingOptions,
  MagneticOptions,
  MagnifierOptions,
  RingOptions,
  SmokeOptions,
  SpotlightOptions,
  TrailOptions,
} from "magic-cursor-effect";
import { createEffect } from "magic-cursor-effect";
import { MAGIC_CURSOR_EFFECTS } from "@/lib/constants/magic-cursor";

import { cn } from "@/lib/utils";
import type { MagneticEffectOptions } from "@/components/magic-cursor/types";
import { toMagneticLibraryOptions } from "@/lib/magic-cursor/magnetic-options";
import { bindRingReachActivationSync } from "@/lib/magic-cursor/ring-reach-sync";

type Props = {
  effect: EffectName;
  options:
    | SpotlightOptions
    | TrailOptions
    | MagneticOptions
    | RingOptions
    | MagnifierOptions
    | InvertRingOptions
    | FlameOptions
    | SmokeOptions
    | ElectricArcOptions;
  enabled?: boolean;
  className?: string;
};

function create(effect: EffectName, root: HTMLDivElement, options: Props["options"]) {
  switch (effect) {
    case MAGIC_CURSOR_EFFECTS.SPOTLIGHT.type:
      return createEffect(MAGIC_CURSOR_EFFECTS.SPOTLIGHT.type, root, options as SpotlightOptions);
    case MAGIC_CURSOR_EFFECTS.TRAIL.type:
      return createEffect(MAGIC_CURSOR_EFFECTS.TRAIL.type, root, options as TrailOptions);
    case MAGIC_CURSOR_EFFECTS.MAGNETIC.type:
      return createEffect(
        MAGIC_CURSOR_EFFECTS.MAGNETIC.type,
        root,
        toMagneticLibraryOptions(options as MagneticEffectOptions),
      );
    case MAGIC_CURSOR_EFFECTS.RING.type:
      return createEffect(MAGIC_CURSOR_EFFECTS.RING.type, root, options as RingOptions);
    case MAGIC_CURSOR_EFFECTS.MAGNIFIER.type:
      return createEffect(MAGIC_CURSOR_EFFECTS.MAGNIFIER.type, root, options as MagnifierOptions);
    case MAGIC_CURSOR_EFFECTS.INVERT_RING.type:
      return createEffect(MAGIC_CURSOR_EFFECTS.INVERT_RING.type, root, options as InvertRingOptions);
    case MAGIC_CURSOR_EFFECTS.FLAME.type:
      return createEffect(MAGIC_CURSOR_EFFECTS.FLAME.type, root, options as FlameOptions);
    case MAGIC_CURSOR_EFFECTS.SMOKE.type:
      return createEffect(MAGIC_CURSOR_EFFECTS.SMOKE.type, root, options as SmokeOptions);
    case MAGIC_CURSOR_EFFECTS.ELECTRIC_ARC.type:
      return createEffect(
        MAGIC_CURSOR_EFFECTS.ELECTRIC_ARC.type,
        root,
        options as ElectricArcOptions,
      );
    default: {
      const _never: never = effect;
      throw new Error(`Unknown effect: ${_never}`);
    }
  }
}

const basicStyle =
  "relative overflow-hidden bg-card min-h-[240px] flex items-center justify-center text-3xl bold uppercase";

function hashStringToUint32(input: string) {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function MagicCursorDemoTile({
  effect,
  options,
  enabled = true,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const rootRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<Destroyable | null>(null);

  const optionsKey = useMemo(() => JSON.stringify(options), [options]);
  const randomMagneticItems = useMemo(() => {
    const seed = hashStringToUint32(`${effect}|${optionsKey}`);
    const rnd = mulberry32(seed);
    const rand = (min: number, max: number) => rnd() * (max - min) + min;

    return Array.from({ length: 3 }, (_, idx) => {
      return {
        id: `item-${idx}`,
        top: `${rand(0, 100).toFixed(1)}%`,
        left: `${rand(0, 100).toFixed(1)}%`,
        size: 60,
      };
    });
  }, [effect, optionsKey]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!enabled) {
      instanceRef.current?.destroy();
      instanceRef.current = null;
      return;
    }
    
    instanceRef.current?.destroy();
    instanceRef.current = create(effect, root, options);

    let unbindRingReachSync: (() => void) | undefined;
    if (effect === MAGIC_CURSOR_EFFECTS.RING.type) {
      unbindRingReachSync = bindRingReachActivationSync(root);
    }

    return () => {
      unbindRingReachSync?.();
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, effect, isLight, optionsKey]);

  if (effect === MAGIC_CURSOR_EFFECTS.MAGNETIC.type) {
    const itemColor = (options as MagneticEffectOptions).itemColor?.trim();
    return (
      <div ref={rootRef} className={cn(basicStyle, "flex items-center justify-center")}>
        <div>{effect}</div>
        {randomMagneticItems.map((item) => (
          <div
            key={item.id}
            data-magnetic
            className={cn(
              "absolute z-10 flex items-center justify-center text-sm shadow-xs",
              !itemColor && "bg-primary",
            )}
            style={{
              top: item.top,
              left: item.left,
              width: item.size,
              height: item.size,
              transform: "translate(-50%, -50%)",
              ...(itemColor ? { backgroundColor: itemColor } : {}),
            }}
          >
            {item.id}
          </div>
        ))}
      </div>
    );
  }

  if (effect === MAGIC_CURSOR_EFFECTS.INVERT_RING.type) {
    return (
      <div
        ref={rootRef}
        className={cn(
          basicStyle,
          "bg-[conic-gradient(from_180deg,#22c55e,#06b6d4,#3b82f6,#a855f7,#ec4899,#f97316,#facc15,#22c55e)]",
          "dark:bg-[conic-gradient(from_180deg,#ec4899,#f97316,#facc15,#22c55e,#06b6d4,#3b82f6,#a855f7,#ec4899)]",
        )}
      >
        {effect}
      </div>
    );
  }
  return (
    <div ref={rootRef} className={cn(basicStyle)}>
      {effect}
    </div>
  );
}
