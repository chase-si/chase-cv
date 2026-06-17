"use client";

import { useState } from "react";

import { ActiveImagePreview } from "@/components/image-to-ui/active-image-preview";
import { ExtractedPalettePanel } from "@/components/image-to-ui/extracted-palette-panel";
import { ImageUploadZone } from "@/components/image-to-ui/image-upload-zone";
import { ImageToUiSampleCard } from "@/components/image-to-ui/sample-image-card";
import { ImageToUiStepIndicator } from "@/components/image-to-ui/step-indicator";
import { RenderInputSummaryPanel } from "@/components/image-to-ui/render-input-summary-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IMAGE_TO_UI_SAMPLE_IMAGES } from "@/lib/constants/image-to-ui-samples";
import { useActiveImageSelection } from "@/lib/image-to-ui/use-active-image-selection";

const sampleTitleById = Object.fromEntries(
  IMAGE_TO_UI_SAMPLE_IMAGES.map((sample) => [sample.id, sample.title]),
);

type ImageToUiFlowStep = 1 | 2;

export function ImageToUiToolShell() {
  const { activeImage, paletteSelection, selectSample, selectUpload, setSelectedPaletteColors } =
    useActiveImageSelection();
  const [flowStep, setFlowStep] = useState<ImageToUiFlowStep>(1);

  const handleRender = () => {
    if (!activeImage || paletteSelection.selectedColors.length < 3) {
      return;
    }
    setFlowStep(2);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">实验工具</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              图片转界面
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {flowStep === 1
                ? "上传或选择示例图片，提取主色调并挑选 3 个颜色，为后续界面渲染步骤做准备。"
                : "确认当前图片与三色角色；界面生成功能即将接入。"}
            </p>
          </div>
          <ImageToUiStepIndicator activeStep={flowStep} />
        </header>

        {flowStep === 1 ? (
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <section className="space-y-6 lg:col-span-5" aria-label="图片来源">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">图片来源</CardTitle>
                  <CardDescription>
                    从本地上传或选择下方示例图片，当前仅保留一个活动图片。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploadZone onFileSelected={selectUpload} />
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div>
                  <h2 className="text-base font-medium text-foreground">示例图片</h2>
                  <p className="text-sm text-muted-foreground">
                    点击卡片选中示例；缺失资源会显示「待补充」，不影响本地上传。
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {IMAGE_TO_UI_SAMPLE_IMAGES.map((sample) => (
                    <ImageToUiSampleCard
                      key={sample.id}
                      id={sample.id}
                      imagePath={sample.imagePath}
                      title={sample.title}
                      description={sample.description}
                      selected={
                        activeImage?.type === "sample" && activeImage.sampleId === sample.id
                      }
                      onSelect={() => selectSample(sample.id, sample.imagePath)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6 lg:col-span-7" aria-label="预览与色板">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">当前图片预览</CardTitle>
                  <CardDescription>选中图片后在此以 contain 方式展示完整画面。</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActiveImagePreview
                    activeImage={activeImage}
                    sampleTitleById={sampleTitleById}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">提取色板</CardTitle>
                  <CardDescription>
                    自动提取 Vibrant / Muted 等 swatch，并选择 3 个颜色后进入渲染步骤。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExtractedPalettePanel
                    hasActiveImage={Boolean(activeImage)}
                    paletteSelection={paletteSelection}
                    onSelectedColorsChange={setSelectedPaletteColors}
                    onRender={handleRender}
                  />
                </CardContent>
              </Card>
            </section>
          </div>
        ) : activeImage ? (
          <RenderInputSummaryPanel
            activeImage={activeImage}
            sampleTitleById={sampleTitleById}
            selectedColors={paletteSelection.selectedColors}
            onBackToEdit={() => setFlowStep(1)}
          />
        ) : null}
      </main>
    </div>
  );
}
