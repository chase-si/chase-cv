import Image from "next/image";

import { getActiveImageSrc, type ActiveImage } from "@/lib/image-to-ui/active-image-types";

type ActiveImagePreviewProps = {
  activeImage: ActiveImage | null;
  sampleTitleById: Record<string, string>;
};

export function ActiveImagePreview({
  activeImage,
  sampleTitleById,
}: ActiveImagePreviewProps) {
  if (!activeImage) {
    return (
      <div
        data-testid="active-image-preview"
        className="flex aspect-video items-center justify-center border border-border bg-muted/30 text-sm text-muted-foreground"
      >
        尚未选择图片
      </div>
    );
  }

  const src = getActiveImageSrc(activeImage);
  const alt =
    activeImage.type === "sample"
      ? sampleTitleById[activeImage.sampleId] ?? "示例图片"
      : "本地上传的图片";

  return (
    <div
      data-testid="active-image-preview"
      className="relative aspect-video overflow-hidden border border-border bg-muted/30"
    >
      {activeImage.type === "sample" ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-contain"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- blob object URLs are browser-local only
        <img src={src} alt={alt} className="size-full object-contain" />
      )}
    </div>
  );
}
