"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import type {
  ThemePaletteRoleLabels,
  ThemePaletteRoleRationaleLabels,
} from "@/lib/image-to-ui/classify-palette-theme-roles";

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
  labels?: {
    summaryAsideAria: string;
    summaryTitle: string;
    summaryDescription: string;
    selectedImage: string;
    selectedColorRoles: string;
    previewTokens: string;
    renderTitle: string;
    renderDescription: string;
    colorRolesAria: string;
    tokensAria: string;
    summaryRootAria: string;
    sampleImage: string;
    uploadedImage: string;
    roles: ThemePaletteRoleLabels;
    roleRationales: ThemePaletteRoleRationaleLabels;
  };
};

export function RenderInputSummaryPanel({
  activeImage,
  sampleTitleById,
  selectedColors,
  labels = {
    summaryAsideAria: "主题输入摘要",
    summaryTitle: "主题来源",
    summaryDescription: "图片、三色角色与推导 token（只读）。",
    selectedImage: "已选图片",
    selectedColorRoles: "已选颜色角色",
    previewTokens: "预览主题 Token",
    renderTitle: "主题预览",
    renderDescription: "查看这组名画配色在 dashboard 与 landing page 中的效果。",
    colorRolesAria: "三色角色摘要",
    tokensAria: "预览主题 token 摘要",
    summaryRootAria: "主题输入摘要",
    sampleImage: "示例图片",
    uploadedImage: "本地上传的图片",
    roles: {
      surface: "表面基底",
      action: "动作色",
      support: "辅助色",
    },
    roleRationales: {
      surfaceLowSaturation: "偏亮且低饱和，适合作背景与表面基底",
      surfaceBrighter: "相对更亮，适合作背景与表面层级",
      surfaceCalm: "饱和度较低、偏平静，适合作表面与弱化区域",
      surfaceDefault: "表面适应性最高，适合作背景与卡片基底",
      actionVivid: (contrast) => `与表面基底${contrast}且色彩鲜明，适合作主操作与焦点色`,
      actionDefault: (contrast) => `与表面基底${contrast}，适合作主操作与焦点色`,
      supportNeutral: "中调中性色，适合作边框、输入框与弱强调",
      supportSecondary: "中调辅助色，适合作次要界面与弱强调",
      supportMuted: "偏中性，适合作边框与弱化层次",
      supportDefault: "辅助适应性最高，适合作次要界面元素",
      contrastHigh: "高对比",
      contrastMedium: "较高对比",
      contrastUsable: "可用对比",
    },
  },
}: RenderInputSummaryPanelProps) {
  const model = useRenderInputSummaryModel({ activeImage, sampleTitleById, selectedColors, labels });

  return (
    <RenderInputSummaryRoot
      summaryDataAttr={model.summaryDataAttr}
      ariaLabel={labels.summaryRootAria}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] xl:items-start xl:gap-6">
        <aside className="xl:sticky xl:top-24" aria-label={labels.summaryAsideAria}>
          <Card size="sm" className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{labels.summaryTitle}</CardTitle>
              <CardDescription className="text-xs">
                {labels.summaryDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 overflow-y-auto max-h-160">
              <RenderInputImageSummary
                activeImage={activeImage}
                imageSrc={model.imageSrc}
                imageAlt={model.imageAlt}
                compact
                label={labels.selectedImage}
              />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-foreground">
                  {labels.selectedColorRoles}
                </p>
                <RenderInputColorRoles
                  colorRoles={model.renderInput.colorRoles}
                  layout="stack"
                  ariaLabel={labels.colorRolesAria}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-foreground">{labels.previewTokens}</p>
                <RenderPreviewTokenSwatchSummary
                  previewThemeTokens={model.previewThemeTokens}
                  ariaLabel={labels.tokensAria}
                />
              </div>
            </CardContent>
          </Card>
        </aside>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{labels.renderTitle}</CardTitle>
            <CardDescription>{labels.renderDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <SaasThemePreviewSurface previewRootStyle={model.previewRootStyle} className="max-h-[min(40rem,70vh)] overflow-y-auto" />
          </CardContent>
        </Card>
      </div>
    </RenderInputSummaryRoot>
  );
}
