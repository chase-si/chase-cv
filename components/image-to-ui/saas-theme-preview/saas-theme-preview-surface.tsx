"use client";

import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { SaasPreviewDashboard } from "@/components/image-to-ui/saas-theme-preview/saas-preview-dashboard";
import { SaasPreviewMarketing } from "@/components/image-to-ui/saas-theme-preview/saas-preview-marketing";
import { SaasPreviewSettings } from "@/components/image-to-ui/saas-theme-preview/saas-preview-settings";
import {
  PreviewThemeScopeProvider,
} from "@/components/image-to-ui/preview-theme-scope";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SaasThemePreviewSurfaceProps = {
  previewRootStyle: CSSProperties;
  className?: string;
};

export function SaasThemePreviewSurface({
  previewRootStyle,
  className,
}: SaasThemePreviewSurfaceProps) {
  const t = useTranslations("imageToUi.preview");

  return (
    <section
      data-testid="saas-preview-surface"
      className={cn(
        "border border-border bg-background p-3 text-foreground tracking-normal sm:p-4",
        className,
      )}
      aria-label={t("surfaceAria")}
      style={previewRootStyle}
    >
      <PreviewThemeScopeProvider previewRootStyle={previewRootStyle}>
        <TooltipProvider>
          <Tabs defaultValue="overview">
            <div className="flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                  <Sparkles className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">Atlas Control Room</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t("subtitle")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <TabsList aria-label={t("tabsAria")}>
                  <TabsTrigger
                    value="overview"
                    className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                  >
                    {t("overview")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                  >
                    {t("settings")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="landing"
                    className="aria-selected:bg-primary aria-selected:text-primary-foreground"
                  >
                    {t("landing")}
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="overview">
              <SaasPreviewDashboard />
            </TabsContent>

            <TabsContent value="settings">
              <SaasPreviewSettings />
            </TabsContent>

            <TabsContent value="landing">
              <SaasPreviewMarketing />
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </PreviewThemeScopeProvider>
    </section>
  );
}
