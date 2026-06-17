"use client";

import type { ReactNode } from "react";
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
import type { MagneticEffectOptions } from "@/components/magic-cursor/types";
import { toMagneticLibraryOptions } from "@/lib/magic-cursor/magnetic-options";

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
  children?: ReactNode;
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
    default: {
      const _never: never = effect;
      throw new Error(`Unknown effect: ${_never}`);
    }
  }
}

const basicStyle =
  "relative overflow-hidden border border-border bg-card min-h-[240px] flex items-center justify-center text-3xl bold uppercase";

export function MagicCursorDemoDetail({
  effect,
  options,
  enabled = true,
  children,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const rootRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<Destroyable | null>(null);

  const optionsKey = useMemo(() => JSON.stringify(options), [options]);
  const MAGNETIC_ITEMS = useMemo(() => [
    {
      id: "1",
      top: "15%",
      left: "10%",
      size: 60,
    },
    {
      id: "2",
      top: "20%",
      left: "80%",
      size: 60,
    },
    {
      id: "3",
      top: "80%",
      left: "65%",
      size: 60,
    },
  ], []);

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
    const itemColor = (options as MagneticEffectOptions).itemColor?.trim();
    return (
      <div ref={rootRef} className={cn(basicStyle, "flex items-center justify-center")}>
        <div>{effect}</div>
        {children}
        {MAGNETIC_ITEMS.map((item) => (
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
        {children}
      </div>
    );
  }
  return (
    <div ref={rootRef} className={cn(basicStyle)}>
      {effect}
      {children}
    </div>
  );
}
