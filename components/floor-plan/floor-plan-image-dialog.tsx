"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FloorPlanImage } from "@/lib/floor-plan/export-image";
import { MobileBottomSheet } from "./mobile-bottom-sheet";

export function FloorPlanImageDialog({ open, onClose, image, error, locale, name }: {
  open: boolean; onClose: () => void; image: FloorPlanImage | null;
  error: boolean; locale?: string; name: string;
}) {
  const isZh = locale === "zh";
  return <MobileBottomSheet open={open} onClose={onClose} desktop testId="floor-plan-image-dialog"
    title={isZh ? "保存布局图" : "Save layout image"} closeLabel={isZh ? "关闭预览" : "Close preview"}>
    <div className="space-y-4">
      {image ? <Image src={image.data} alt={isZh ? "当前户型家具布局图" : "Current furniture layout"} width={image.width} height={image.height}
        unoptimized className="max-h-[45dvh] w-full rounded-xl border border-border object-contain" />
        : <p role="status" className="py-8 text-center text-sm text-muted-foreground">{error ? isZh ? "生成失败，请关闭后重试。" : "Unable to create image. Close and try again." : isZh ? "正在生成布局图…" : "Creating layout image…"}</p>}
      {image && <Button className="h-12 w-full" onClick={() => {
        const link = document.createElement("a"); link.href = image.data;
        link.download = `${name.replace(/[\\/:*?"<>|]/g, "-")}-布局图.png`; link.click();
      }}><Download />{isZh ? "保存 PNG 图片" : "Save PNG image"}</Button>}
      <p className="text-xs text-muted-foreground">{isZh ? "若手机浏览器打开图片预览，可长按图片保存。布局仅供参考，购买前请核对实测尺寸。" : "If your mobile browser opens the image, press and hold to save. Verify real measurements before purchasing."}</p>
    </div>
  </MobileBottomSheet>;
}
