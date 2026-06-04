"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  POSTER_CANVAS_HEIGHT,
  POSTER_CANVAS_WIDTH,
} from "./poster-canvas";

export function ScaledPosterCanvas({
  children,
  className,
  "data-testid": dataTestId,
}: {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;

    if (!outer) {
      return;
    }

    const updateScale = () => {
      const width = outer.clientWidth;

      if (width <= 0) {
        return;
      }

      setScale(width / POSTER_CANVAS_WIDTH);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(outer);

    return () => observer.disconnect();
  }, []);

  const scaledHeight = POSTER_CANVAS_HEIGHT * scale;

  return (
    <div
      ref={outerRef}
      className={cn("relative w-full", className)}
      data-testid={dataTestId}
      style={{ height: scaledHeight }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          height: POSTER_CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          width: POSTER_CANVAS_WIDTH,
        }}
      >
        {children}
      </div>
    </div>
  );
}
