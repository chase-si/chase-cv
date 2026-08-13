import type { ActiveImage } from "@/lib/image-to-ui/active-image-types";

export function imageToUiAnalyticsImageKey(activeImage: ActiveImage) {
  return activeImage.type === "sample"
    ? `sample:${activeImage.sampleId}`
    : "upload:local";
}
