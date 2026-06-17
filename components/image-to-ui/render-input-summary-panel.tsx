"use client";

import { ActiveImagePreview } from "@/components/image-to-ui/active-image-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
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
          <CardTitle className="text-base">当前图片</CardTitle>
          <CardDescription>以下图片与三色角色将用于后续界面生成。</CardDescription>
        </CardHeader>
        <CardContent>
          <ActiveImagePreview activeImage={activeImage} sampleTitleById={sampleTitleById} />
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
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3"
                data-testid={`render-input-color-${entry.role}`}
              >
                <span
                  className="size-10 shrink-0 rounded-md border border-border"
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
            className="rounded-lg border border-border bg-muted/40 px-4 py-6 text-center text-sm font-medium text-muted-foreground"
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
