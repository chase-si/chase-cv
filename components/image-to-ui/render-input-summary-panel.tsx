"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveImageSrc, type ActiveImage } from "@/lib/image-to-ui/active-image-types";
import {
  buildImageToUiRenderInput,
  type ImageToUiRenderInput,
} from "@/lib/image-to-ui/build-image-to-ui-render-input";

type RenderInputSummaryPanelProps = {
  activeImage: ActiveImage;
  sampleTitleById: Record<string, string>;
  selectedColors: string[];
  onBackToEdit: () => void;
};

export function RenderInputSummaryPanel({
  activeImage,
  sampleTitleById,
  selectedColors,
  onBackToEdit,
}: RenderInputSummaryPanelProps) {
  const renderInput: ImageToUiRenderInput = buildImageToUiRenderInput(activeImage, selectedColors);
  const imageSrc = getActiveImageSrc(activeImage);
  const imageAlt =
    activeImage.type === "sample"
      ? sampleTitleById[activeImage.sampleId] ?? "示例图片"
      : "本地上传的图片";

  return (
    <section
      className="space-y-6"
      aria-label="渲染输入摘要"
      data-testid="render-input-summary"
      data-render-input={JSON.stringify({
        imageSrc: renderInput.imageSrc,
        colorRoles: renderInput.colorRoles,
      })}
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base">当前图片摘要</CardTitle>
          <CardDescription>将当前激活图片与三色角色一起作为渲染输入。</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            data-testid="render-input-image-summary"
            className="flex items-center gap-3 border border-border bg-muted/20 p-3"
          >
            <div
              data-testid="render-input-image-thumbnail"
              className="relative h-16 w-24 shrink-0 overflow-hidden border border-border bg-muted/40"
            >
              {activeImage.type === "sample" ? (
                <Image src={imageSrc} alt={imageAlt} fill sizes="96px" className="object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- blob object URLs are browser-local only
                <img src={imageSrc} alt={imageAlt} className="size-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">已选图片</p>
              <p className="truncate text-xs text-muted-foreground">{imageAlt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base">已选颜色角色</CardTitle>
          <CardDescription>按选择顺序对应主色、辅色与强调色。</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-3" aria-label="三色角色摘要">
            {renderInput.colorRoles.map((entry) => (
              <li
                key={entry.role}
                className="flex items-center gap-3 border border-border bg-card px-3 py-3"
                data-testid={`render-input-color-${entry.role}`}
              >
                <span
                  className="size-10 shrink-0 border border-border"
                  style={{ backgroundColor: entry.hex }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{entry.role}</p>
                  <p className="font-mono text-xs text-muted-foreground">{entry.hex}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-dashed shadow-md">
        <CardHeader>
          <CardTitle className="text-base">界面渲染</CardTitle>
          <CardDescription>生成式 UI 能力尚未接入。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p
            className="border border-border bg-muted/40 px-4 py-6 text-center text-sm font-medium text-muted-foreground"
            data-testid="render-placeholder-status"
          >
            待开发
          </p>
          <Button type="button" variant="outline" data-testid="render-back-to-edit" onClick={onBackToEdit}>
            返回编辑
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
