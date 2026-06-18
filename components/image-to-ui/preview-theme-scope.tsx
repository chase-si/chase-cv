"use client";

import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext } from "react";

import { SelectContent } from "@/components/ui/select";
import { TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type PreviewThemeScopeValue = {
  previewRootStyle: CSSProperties;
};

const PreviewThemeScopeContext = createContext<PreviewThemeScopeValue | null>(null);

export function PreviewThemeScopeProvider({
  previewRootStyle,
  children,
}: {
  previewRootStyle: CSSProperties;
  children: ReactNode;
}) {
  return (
    <PreviewThemeScopeContext.Provider value={{ previewRootStyle }}>
      {children}
    </PreviewThemeScopeContext.Provider>
  );
}

export function usePreviewThemeScope(): CSSProperties {
  const context = useContext(PreviewThemeScopeContext);
  if (!context) {
    throw new Error("usePreviewThemeScope must be used within PreviewThemeScopeProvider");
  }
  return context.previewRootStyle;
}

export function PreviewSelectContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SelectContent>) {
  const previewRootStyle = usePreviewThemeScope();
  return (
    <SelectContent
      className={className}
      style={{ ...previewRootStyle, ...style }}
      {...props}
    />
  );
}

export function PreviewTooltipContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof TooltipContent>) {
  const previewRootStyle = usePreviewThemeScope();
  return (
    <TooltipContent
      className={cn(className)}
      style={{ ...previewRootStyle, ...style }}
      {...props}
    />
  );
}
