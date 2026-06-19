"use client";

import Image from "next/image";
import { Check, PanelLeft } from "lucide-react";
import { useMessages, useTranslations } from "next-intl";

import { ActiveImagePreview } from "@/components/image-to-ui/active-image-preview";
import { ExtractedPalettePanel } from "@/components/image-to-ui/extracted-palette-panel";
import { ImageUploadZone } from "@/components/image-to-ui/image-upload-zone";
import { ImageToUiStepIndicator } from "@/components/image-to-ui/step-indicator";
import { RenderInputSummaryPanel } from "@/components/image-to-ui/render-input-summary-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IMAGE_TO_UI_SAMPLE_IMAGES } from "@/lib/constants/image-to-ui-samples";
import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import { useImageToUiToolSession } from "@/lib/image-to-ui/use-image-to-ui-tool-session";
import { cn } from "@/lib/utils";

export function ImageToUiToolShell() {
  const t = useTranslations("imageToUi");
  const messages = useMessages();
  const sampleMessages = (
    messages as {
      imageToUi?: {
        samples?: Record<string, { title: string; description: string }>;
      };
    }
  ).imageToUi?.samples ?? {};
  const sampleTitleById = Object.fromEntries(
    IMAGE_TO_UI_SAMPLE_IMAGES.map((sample) => [
      sample.id,
      sampleMessages[sample.id]?.title ?? sample.title,
    ]),
  );
  const previewLabels = {
    emptyPreview: t("emptyPreview"),
    sampleImage: t("sampleImage"),
    uploadedImage: t("uploadedImage"),
  };
  const roleLabels = {
    surface: t("roles.surface"),
    action: t("roles.action"),
    support: t("roles.support"),
  };
  const roleRationaleLabels = {
    surfaceLowSaturation: t("roleRationales.surfaceLowSaturation"),
    surfaceBrighter: t("roleRationales.surfaceBrighter"),
    surfaceCalm: t("roleRationales.surfaceCalm"),
    surfaceDefault: t("roleRationales.surfaceDefault"),
    actionVivid: (contrast: string) =>
      t("roleRationales.actionVivid", { contrast }),
    actionDefault: (contrast: string) =>
      t("roleRationales.actionDefault", { contrast }),
    supportNeutral: t("roleRationales.supportNeutral"),
    supportSecondary: t("roleRationales.supportSecondary"),
    supportMuted: t("roleRationales.supportMuted"),
    supportDefault: t("roleRationales.supportDefault"),
    contrastHigh: t("contrast.high"),
    contrastMedium: t("contrast.medium"),
    contrastUsable: t("contrast.usable"),
  };
  const {
    activeImage,
    paletteSelection,
    displayStep,
    selectSample,
    selectUpload,
    setSelectedPaletteColors,
    backToEdit,
    confirmRender,
  } = useImageToUiToolSession({
    extractionErrorMessage: t("extractionError"),
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <main className="mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {displayStep === 1
                ? t("stepOneDescription")
                : t("stepTwoDescription")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ImageToUiStepIndicator
              activeStep={displayStep}
              labels={{
                stepsAria: t("stepsAria"),
                select: t("steps.select"),
                render: t("steps.render"),
              }}
            />
            {displayStep === 2 ? (
              <Button
                type="button"
                variant="ghost"
                data-testid="render-back-to-edit"
                className='shadow-sm hover:shadow-md'
                onClick={backToEdit}
              >
                {t("backToEdit")}
              </Button>
            ) : null}
          </div>
        </header>

        {displayStep === 1 ? (
          <div className="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)] xl:items-start xl:gap-8">
            <aside className="space-y-4 xl:sticky xl:top-24" aria-label={t("sourceAria")}>
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <PanelLeft className="size-4 text-primary" aria-hidden />
                    <CardTitle className="text-base">{t("sourceTitle")}</CardTitle>
                  </div>
                  <CardDescription>{t("sourceDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploadZone
                    onFileSelected={selectUpload}
                    labels={{
                      uploadAria: t("uploadAria"),
                      uploadButton: t("uploadButton"),
                      uploadHelp: t("uploadHelp"),
                    }}
                  />
                  <div className="max-h-112 space-y-2 overflow-y-auto pr-1">
                    {IMAGE_TO_UI_SAMPLE_IMAGES.map((sample) => (
                      <SampleListButton
                        key={sample.id}
                        id={sample.id}
                        imagePath={sample.imagePath}
                        title={sampleMessages[sample.id]?.title ?? sample.title}
                        description={
                          sampleMessages[sample.id]?.description ?? sample.description
                        }
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

            <section className="space-y-6" aria-label={t("previewAria")}>
              <PreviewCard
                activeImage={activeImage}
                sampleTitleById={sampleTitleById}
                labels={previewLabels}
              />
              <PaletteCard
                activeImage={activeImage}
                paletteSelection={paletteSelection}
                setSelectedPaletteColors={setSelectedPaletteColors}
                onRender={confirmRender}
                labels={{
                  paletteTitle: t("paletteTitle"),
                  paletteDescription: t("paletteDescription"),
                  paletteEmpty: t("paletteEmpty"),
                  paletteLoading: t("paletteLoading"),
                  paletteAria: t("paletteAria"),
                  paletteShare: (percent) => t("paletteShare", { percent }),
                  paletteSwatchAria: (hex, percent) =>
                    t("paletteSwatchAria", { hex, percent }),
                  paletteInsufficient: (count) =>
                    t("paletteInsufficient", { count }),
                  selectionLimit: t("selectionLimit"),
                  renderButton: t("renderButton"),
                  selectionProgress: (selected, required) =>
                    t("selectionProgress", { selected, required }),
                  selectedColor: (index) => t("selectedColor", { index }),
                }}
              />
            </section>
          </div>
        ) : activeImage ? (
          <RenderInputSummaryPanel
            activeImage={activeImage}
            sampleTitleById={sampleTitleById}
            selectedColors={paletteSelection.selectedColors}
            labels={{
              summaryAsideAria: t("summaryAsideAria"),
              summaryTitle: t("summaryTitle"),
              summaryDescription: t("summaryDescription"),
              selectedImage: t("selectedImage"),
              selectedColorRoles: t("selectedColorRoles"),
              previewTokens: t("previewTokens"),
              renderTitle: t("renderTitle"),
              renderDescription: t("renderDescription"),
              colorRolesAria: t("colorRolesAria"),
              tokensAria: t("tokensAria"),
              summaryRootAria: t("summaryRootAria"),
              sampleImage: t("sampleImage"),
              uploadedImage: t("uploadedImage"),
              roles: roleLabels,
              roleRationales: roleRationaleLabels,
            }}
          />
        ) : null}
      </main>
    </div>
  );
}

function PreviewCard({
  activeImage,
  sampleTitleById,
  labels,
}: {
  activeImage: ActiveImage | null;
  sampleTitleById: Record<string, string>;
  labels: {
    emptyPreview: string;
    sampleImage: string;
    uploadedImage: string;
  };
}) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{useTranslations("imageToUi")("previewTitle")}</CardTitle>
        <CardDescription>{useTranslations("imageToUi")("previewDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ActiveImagePreview
          activeImage={activeImage}
          sampleTitleById={sampleTitleById}
          labels={labels}
        />
      </CardContent>
    </Card>
  );
}

function PaletteCard({
  activeImage,
  paletteSelection,
  setSelectedPaletteColors,
  onRender,
  labels,
}: {
  activeImage: ActiveImage | null;
  paletteSelection: ReturnType<typeof useImageToUiToolSession>["paletteSelection"];
  setSelectedPaletteColors: (colors: string[]) => void;
  onRender: () => void;
  labels: {
    paletteTitle: string;
    paletteDescription: string;
    paletteEmpty: string;
    paletteLoading: string;
    paletteAria: string;
    paletteShare: (percent: string) => string;
    paletteSwatchAria: (hex: string, percent: string) => string;
    paletteInsufficient: (count: number) => string;
    selectionLimit: string;
    renderButton: string;
    selectionProgress: (selected: number, required: number) => string;
    selectedColor: (index: number) => string;
  };
}) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-base">{labels.paletteTitle}</CardTitle>
        <CardDescription>{labels.paletteDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ExtractedPalettePanel
          hasActiveImage={Boolean(activeImage)}
          paletteSelection={paletteSelection}
          onSelectedColorsChange={setSelectedPaletteColors}
          onRender={onRender}
          labels={labels}
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
