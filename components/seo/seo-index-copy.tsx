import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SeoIndexCopyProps = ComponentProps<"div">;

/** Server-rendered indexable copy kept in HTML but out of the visual layout. */
export function SeoIndexCopy({ children, className, ...props }: SeoIndexCopyProps) {
  return (
    <div {...props} hidden className={cn("hidden", className)}>
      {children}
    </div>
  );
}
