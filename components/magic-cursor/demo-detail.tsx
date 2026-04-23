"use client";

import { useEffect, useMemo, useRef } from "react";

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
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

function create(effect: EffectName, root: HTMLDivElement, options: Props["options"]) {
  switch (effect) {
    case "spotlight":
      return createEffect("spotlight", root, options as SpotlightOptions);
    case "trail":
      return createEffect("trail", root, options as TrailOptions);
    case "magnetic":
      return createEffect("magnetic", root, options as MagneticOptions);
    case "ring":
      return createEffect("ring", root, options as RingOptions);
    case "magnifier":
      return createEffect("magnifier", root, options as MagnifierOptions);
    case "invertRing":
      return createEffect("invertRing", root, options as InvertRingOptions);
    case "flame":
      return createEffect("flame", root, options as FlameOptions);
    case "smoke":
      return createEffect("smoke", root, options as SmokeOptions);
    default: {
      const _never: never = effect;
      throw new Error(`Unknown effect: ${_never}`);
    }
  }
}

export function MagicCursorDemo({
  effect,
  options,
  enabled = true,
  className,
  style,
  children,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<Destroyable | null>(null);

  const optionsKey = useMemo(() => JSON.stringify(options), [options]);

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
  }, [enabled, effect, optionsKey]);

  return (
    <div ref={rootRef} className={cn("relative", className)} style={style}>
      {children}
    </div>
  );
}

