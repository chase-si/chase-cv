"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import type {
  Destroyable,
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
import { createEffect } from "magic-cursor-effect";
import { MAGIC_CURSOR_EFFECTS } from "@/lib/constants/magic-cursor";

import { cn } from "@/lib/utils";

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
    | SmokeOptions;
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
      return createEffect(MAGIC_CURSOR_EFFECTS.MAGNETIC.type, root, options as MagneticOptions);
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

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, effect, isLight, optionsKey]);

  if (effect === MAGIC_CURSOR_EFFECTS.MAGNETIC.type) {
    return (
      <div ref={rootRef} className={cn(basicStyle, "flex items-center justify-center")}>
        <div>{effect}</div>
        {randomMagneticItems.map((item) => (
          <div
            key={item.id}
            data-magnetic
            className="absolute shadow-xs z-10 rounded-full bg-primary text-sm flex items-center justify-center"
            style={{
              top: item.top,
              left: item.left,
              width: item.size,
              height: item.size,
              transform: "translate(-50%, -50%)",
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

