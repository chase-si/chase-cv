import { describe, expect, it } from "vitest";

import { IMAGE_TO_UI_SAMPLE_IMAGES } from "@/lib/constants/image-to-ui-samples";

describe("IMAGE_TO_UI_SAMPLE_IMAGES", () => {
  it("exposes stable ids and metadata for each configured sample", () => {
    expect(IMAGE_TO_UI_SAMPLE_IMAGES.length).toBeGreaterThan(0);

    const ids = new Set<string>();
    for (const sample of IMAGE_TO_UI_SAMPLE_IMAGES) {
      expect(sample.id).toMatch(/^[a-z0-9-]+$/);
      expect(ids.has(sample.id)).toBe(false);
      ids.add(sample.id);

      expect(sample.imagePath.startsWith("/")).toBe(true);
      expect(sample.title.trim().length).toBeGreaterThan(0);
      expect(sample.description.trim().length).toBeGreaterThan(0);
    }
  });
});
