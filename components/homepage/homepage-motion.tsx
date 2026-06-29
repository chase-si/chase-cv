import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

export type HomepageMotionKind = "hero" | "reveal" | "reveal-card";

type Props<T extends ElementType> = {
  as?: T;
  kind: HomepageMotionKind;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function HomepageMotion<T extends ElementType = "div">({
  as,
  kind,
  className,
  ...props
}: Props<T>) {
  const Component = as ?? "div";

  return (
    <Component
      data-homepage-motion={kind}
      className={cn(className)}
      {...props}
    />
  );
}
