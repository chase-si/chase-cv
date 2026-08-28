"use client";

import { EyeOff, ImagePlus, ScanSearch, Trash2, Utensils } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DUDU_SCANNER_CUSTOM_LIBRARY_MAX } from "@/lib/dudu-scanner/custom-image-ingest";
import { useDuduScannerCustomLibrary } from "@/lib/dudu-scanner/dudu-scanner-custom-library-provider";
import { cn } from "@/lib/utils";

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/heic,image/heif,.png,.jpg,.jpeg,.webp,.heic,.heif";

export function DuduScannerCustomLibraryPanel() {
  const t = useTranslations("duduScanner.customLibrary");
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const {
    items,
    selectedAssetId,
    persistFailed,
    ingestNotice,
    toggleSelectedAssetId,
    addFiles,
    removeAsset,
    clearLibrary,
  } = useDuduScannerCustomLibrary();
  const remaining = DUDU_SCANNER_CUSTOM_LIBRARY_MAX - items.length;

  return (
    <div className="space-y-2" data-testid="dudu-scanner-custom-library">
      <div
        className="rounded-2xl border border-primary/30 bg-primary/5 p-3"
        data-testid="dudu-scanner-custom-game-guide"
      >
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Utensils className="size-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{t("gameTitle")}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {t("gameDescription")}
            </p>
          </div>
        </div>
        <ol className="mt-3 grid gap-2 sm:grid-cols-3" aria-label={t("gameStepsLabel")}>
          {[
            { icon: ImagePlus, text: t("gameSteps.upload") },
            { icon: EyeOff, text: t("gameSteps.hide") },
            { icon: ScanSearch, text: t("gameSteps.guess") },
          ].map(({ icon: Icon, text }, index) => (
            <li
              key={text}
              className="flex min-w-0 items-start gap-2 rounded-xl border border-border bg-card px-2.5 py-2 text-xs text-foreground shadow-xs"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {index + 1}
              </span>
              <Icon className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground">{t("heading")}</h2>
        {items.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => setConfirmClear(true)}
          >
            {t("clear")}
          </Button>
        ) : null}
      </div>
      {items.length === 0 ? (
        <Alert
          id="dudu-scanner-start-blocked"
          variant="accent"
          data-testid="dudu-scanner-start-blocked"
        >
          <AlertDescription className="flex items-start gap-2 text-sm text-foreground">
            <ImagePlus className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 space-y-1">
              <span>{t("startBlocked")}</span>
              <p className="text-xs text-muted-foreground">{t("customNote")}</p>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">{t("description")}</p>
      {persistFailed ? (
        <p className="text-xs text-muted-foreground" role="status" data-testid="dudu-scanner-custom-persist-warning">
          {t("persistWarning")}
        </p>
      ) : null}
      {ingestNotice ? (
        <p className="text-xs text-destructive" role="status" data-testid="dudu-scanner-custom-ingest-notice">
          {t(`skip.${ingestNotice}`)}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {items.map((item) => {
          const selected = selectedAssetId === item.id;
          return (
            <div key={item.id} className="relative">
              <button
                type="button"
                aria-pressed={selected}
                aria-label={t("selectImage")}
                onClick={() => toggleSelectedAssetId(item.id)}
                className={cn(
                  "flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border bg-card outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
                  selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:bg-muted/40",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.objectUrl} alt="" className="size-full object-contain" />
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute right-1 top-1 bg-background/80 text-destructive"
                aria-label={t("removeImage")}
                onClick={() => void removeAsset(item.id)}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          );
        })}
        {remaining > 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-primary/50 bg-primary/5 text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            data-testid="dudu-scanner-custom-upload"
          >
            <ImagePlus className="size-5" aria-hidden />
            <span className="px-1 text-center text-[10px] font-medium leading-tight">{t("upload")}</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        data-testid="dudu-scanner-custom-file-input"
        onChange={(event) => {
          const files = event.target.files ? [...event.target.files] : [];
          event.target.value = "";
          if (files.length > 0) {
            void addFiles(files);
          }
        }}
      />

      <ConfirmationDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title={t("clearTitle")}
        description={t("clearDescription")}
        confirmLabel={t("clearConfirm")}
        destructive
        onConfirm={() => void clearLibrary()}
      />
    </div>
  );
}
