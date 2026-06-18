"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, PanelLeft } from "lucide-react";

import { ActiveImagePreview } from "@/components/image-to-ui/active-image-preview";
import { ExtractedPalettePanel } from "@/components/image-to-ui/extracted-palette-panel";
import { ImageUploadZone } from "@/components/image-to-ui/image-upload-zone";
import { ImageToUiStepIndicator } from "@/components/image-to-ui/step-indicator";
import { RenderInputSummaryPanel } from "@/components/image-to-ui/render-input-summary-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IMAGE_TO_UI_SAMPLE_IMAGES } from "@/lib/constants/image-to-ui-samples";
import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import { useActiveImageSelection } from "@/lib/image-to-ui/use-active-image-selection";
import { cn } from "@/lib/utils";

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
      <main className="mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              图片转界面
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {flowStep === 1
                ? "上传或选择示例图片，提取主色调并挑选 3 个颜色，为后续界面渲染步骤做准备。"
                : "确认当前图片与三色角色；查看完整预览并可返回继续编辑。"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ImageToUiStepIndicator activeStep={flowStep} />
            {flowStep === 2 ? (
              <Button
                type="button"
                variant="ghost"
                data-testid="render-back-to-edit"
                className='shadow-sm hover:shadow-md'
                onClick={() => setFlowStep(1)}
              >
                返回编辑
              </Button>
            ) : null}
          </div>
        </header>

        {flowStep === 1 ? (
          <div className="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)] xl:items-start xl:gap-8">
            <aside className="space-y-4 xl:sticky xl:top-24" aria-label="图片来源">
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <PanelLeft className="size-4 text-primary" aria-hidden />
                    <CardTitle className="text-base">来源</CardTitle>
                  </div>
                  <CardDescription>上传图片，或从紧凑列表选一个示例。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploadZone onFileSelected={selectUpload} />
                  <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                    {IMAGE_TO_UI_SAMPLE_IMAGES.map((sample) => (
                      <SampleListButton
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
                </CardContent>
              </Card>
            </aside>

            <section className="space-y-6" aria-label="预览与色板">
              <PreviewCard activeImage={activeImage} />
              <PaletteCard
                activeImage={activeImage}
                paletteSelection={paletteSelection}
                setSelectedPaletteColors={setSelectedPaletteColors}
                onRender={handleRender}
              />
            </section>
          </div>
        ) : activeImage ? (
          <RenderInputSummaryPanel
            activeImage={activeImage}
            sampleTitleById={sampleTitleById}
            selectedColors={paletteSelection.selectedColors}
          />
        ) : null}
      </main>
    </div>
  );
}

function PreviewCard({ activeImage }: { activeImage: ActiveImage | null }) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">当前图片预览</CardTitle>
        <CardDescription>选中图片后在此以 contain 方式展示完整画面。</CardDescription>
      </CardHeader>
      <CardContent>
        <ActiveImagePreview activeImage={activeImage} sampleTitleById={sampleTitleById} />
      </CardContent>
    </Card>
  );
}

function PaletteCard({
  activeImage,
  paletteSelection,
  setSelectedPaletteColors,
  onRender,
}: {
  activeImage: ActiveImage | null;
  paletteSelection: ReturnType<typeof useActiveImageSelection>["paletteSelection"];
  setSelectedPaletteColors: (colors: string[]) => void;
  onRender: () => void;
}) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-base">提取色板</CardTitle>
        <CardDescription>
          按像素占比提取主导色，并选择 3 个颜色后进入渲染步骤。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExtractedPalettePanel
          hasActiveImage={Boolean(activeImage)}
          paletteSelection={paletteSelection}
          onSelectedColorsChange={setSelectedPaletteColors}
          onRender={onRender}
        />
      </CardContent>
    </Card>
  );
}

function SampleListButton({
  id,
  imagePath,
  title,
  description,
  selected,
  onSelect,
}: {
  id: string;
  imagePath: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-sample-id={id}
      aria-pressed={selected}
      aria-label={title}
      className={cn(
        "flex w-full items-center gap-3 border border-border bg-background p-2 text-left transition-colors",
        "hover:bg-muted/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        selected && "border-primary bg-primary/10",
      )}
      onClick={onSelect}
    >
      <span className="relative size-14 shrink-0 overflow-hidden bg-muted">
        <Image src={imagePath} alt="" fill sizes="56px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{title}</span>
        <span className="line-clamp-2 text-xs text-muted-foreground">{description}</span>
      </span>
      {selected ? <Check className="size-4 shrink-0 text-primary" aria-hidden /> : null}
    </button>
  );
}
