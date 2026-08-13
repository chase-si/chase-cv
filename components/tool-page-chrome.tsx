import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ToolPageChromeProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ToolPageChrome({
  title,
  description,
  actions,
  children,
  className,
}: ToolPageChromeProps) {
  const descriptionTitle = typeof description === "string" ? description : undefined;
  const headingTitle = typeof title === "string" ? title : undefined;

  return (
    <div
      data-testid="tool-page-chrome"
      className={cn(
        "relative flex min-h-0 w-full flex-1 flex-col lg:h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-4rem)] lg:overflow-hidden",
        className,
      )}
    >
      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-3 overflow-y-auto px-4 py-3 sm:px-6 lg:overflow-hidden">
        <header className="flex shrink-0 flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 space-y-1">
            <h1
              title={headingTitle}
              className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]"
            >
              {title}
            </h1>
            {description ? (
              <p
                title={descriptionTitle}
                className="truncate text-sm text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex min-w-0 shrink-0 items-center gap-3 overflow-visible sm:max-w-[min(100%,36rem)] lg:flex-nowrap">
              {actions}
            </div>
          ) : null}
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div>
      </main>
    </div>
  );
}
