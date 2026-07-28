import { afterEach, describe, expect, it, vi } from "vitest";

import { getTargetRecord } from "@/lib/dudu-scanner/catalog";
import {
  DUDU_SCANNER_SHARED_CHARACTER_FALLBACK_SRC,
  preloadTargetImage,
  resolveTargetDisplaySrc,
} from "@/lib/dudu-scanner/target-asset";

describe("target asset helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves production src by default and shared silhouette on fallback", () => {
    const production = getTargetRecord("fry-sprite").imageSrc;
    expect(resolveTargetDisplaySrc("fry-sprite", false)).toBe(production);
    expect(resolveTargetDisplaySrc("fry-sprite", true)).toBe(
      DUDU_SCANNER_SHARED_CHARACTER_FALLBACK_SRC,
    );
  });

  it("reports preload success when the image loads and decodes", async () => {
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      decode = vi.fn().mockResolvedValue(undefined);

      set src(_value: string) {
        queueMicrotask(() => {
          this.onload?.();
        });
      }
    }

    vi.stubGlobal("Image", MockImage as unknown as typeof Image);

    await expect(preloadTargetImage("/dudu-scanner/characters/fry-sprite.png")).resolves.toBe(
      true,
    );
  });

  it("reports preload failure without throwing", async () => {
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        queueMicrotask(() => {
          this.onerror?.();
        });
      }
    }

    vi.stubGlobal("Image", MockImage as unknown as typeof Image);

    await expect(preloadTargetImage("/missing.png")).resolves.toBe(false);
  });
});
