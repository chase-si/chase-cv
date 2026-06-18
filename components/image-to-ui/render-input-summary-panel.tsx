"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";

import {
  RenderInputColorRoles,
  RenderInputImageSummary,
  RenderInputSummaryRoot,
  RenderPreviewTokenSwatchSummary,
} from "./render-input-summary-sections";
import { SaasThemePreviewSurface } from "./saas-theme-preview-surface";
import { useRenderInputSummaryModel } from "./use-render-input-summary-model";

type RenderInputSummaryPanelProps = {
  activeImage: ActiveImage;
  sampleTitleById: Record<string, string>;
  selectedColors: string[];
};

export function RenderInputSummaryPanel({
  activeImage,
  sampleTitleById,
  selectedColors,
}: RenderInputSummaryPanelProps) {
  const model = useRenderInputSummaryModel({ activeImage, sampleTitleById, selectedColors });

  return (
    <RenderInputSummaryRoot summaryDataAttr={model.summaryDataAttr}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] xl:items-start xl:gap-6">
        <aside className="xl:sticky xl:top-24" aria-label="渲染输入侧栏摘要">
          <Card size="sm" className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">输入摘要</CardTitle>
              <CardDescription className="text-xs">图片、三色与推导 Token（只读）。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 overflow-y-auto max-h-160">
              <RenderInputImageSummary
                activeImage={activeImage}
                imageSrc={model.imageSrc}
                imageAlt={model.imageAlt}
                compact
              />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-foreground">已选颜色角色</p>
                <RenderInputColorRoles colorRoles={model.renderInput.colorRoles} layout="stack" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-foreground">预览主题 Token</p>
                <RenderPreviewTokenSwatchSummary previewThemeTokens={model.previewThemeTokens} />
              </div>
            </CardContent>
          </Card>
        </aside>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">界面渲染</CardTitle>
            <CardDescription>Scoped theme 下的 dashboard 与 marketing 预览。</CardDescription>
          </CardHeader>
          <CardContent>
            <SaasThemePreviewSurface previewRootStyle={model.previewRootStyle} className="max-h-[min(40rem,70vh)] overflow-y-auto" />
          </CardContent>
        </Card>
      </div>
    </RenderInputSummaryRoot>
  );
}
