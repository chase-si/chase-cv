"use client";

import type { ReactNode } from "react";
import Image from "next/image";

import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";
import type { ImageToUiRenderInput } from "@/lib/image-to-ui/build-image-to-ui-render-input";
import type { PreviewThemeTokenKey, PreviewThemeTokens } from "@/lib/image-to-ui/derive-preview-theme";
import { cn } from "@/lib/utils";

import { PREVIEW_TOKEN_SUMMARY_KEYS } from "./use-render-input-summary-model";

export function RenderInputImageSummary({
  activeImage,
  imageSrc,
  imageAlt,
  compact = false,
}: {
  activeImage: ActiveImage;
  imageSrc: string;
  imageAlt: string;
  compact?: boolean;
}) {
  return (
    <div
      data-testid="render-input-image-summary"
      className={cn(
        "flex items-center gap-3 border border-border bg-muted/20",
        compact ? "p-2" : "p-3",
      )}
    >
      <div
        data-testid="render-input-image-thumbnail"
        className={cn(
          "relative shrink-0 overflow-hidden border border-border bg-muted/40",
          compact ? "h-12 w-16" : "h-16 w-24",
        )}
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
  );
}

export function RenderInputColorRoles({
  colorRoles,
  layout = "grid",
}: {
  colorRoles: ImageToUiRenderInput["colorRoles"];
  layout?: "grid" | "stack";
}) {
  return (
    <ul
      className={cn("gap-2", layout === "stack" ? "flex flex-col" : "grid sm:grid-cols-3")}
      aria-label="三色角色摘要"
    >
      {colorRoles.map((entry) => (
        <li
          key={entry.role}
          className="flex items-center gap-3 border border-border bg-card px-3 py-2.5"
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
  );
}

export function RenderPreviewTokenSwatchSummary({
  previewThemeTokens,
}: {
  previewThemeTokens: PreviewThemeTokens;
}) {
  return (
    <ul
      className="grid gap-2"
      aria-label="预览主题 token 摘要"
      data-testid="render-preview-token-summary"
    >
      {PREVIEW_TOKEN_SUMMARY_KEYS.map((token) => (
        <TokenSwatchRow key={token} token={token} value={previewThemeTokens[token]} />
      ))}
    </ul>
  );
}

function TokenSwatchRow({ token, value }: { token: PreviewThemeTokenKey; value: string }) {
  return (
    <li
      className="flex items-center gap-3 border border-border bg-card px-3 py-2"
      data-testid={`preview-token-${token}`}
    >
      <span
        className="size-10 shrink-0 border border-border"
        style={{ backgroundColor: value }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground">{token}</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground">{value}</p>
      </div>
    </li>
  );
}

export function RenderInputSummaryRoot({
  summaryDataAttr,
  children,
}: {
  summaryDataAttr: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label="渲染输入摘要"
      data-testid="render-input-summary"
      data-render-input={summaryDataAttr}
    >
      {children}
    </section>
  );
}
