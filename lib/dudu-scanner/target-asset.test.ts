import { afterEach, describe, expect, it, vi } from "vitest";

import { getTargetRecord } from "@/lib/dudu-scanner/catalog";
import {
  preloadTargetImage,
  resetTargetImageCacheForTests,
  resolveTargetDisplaySrc,
} from "@/lib/dudu-scanner/target-asset";

describe("target asset helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    resetTargetImageCacheForTests();
  });

  it("resolves production src by default and per-target placeholder on fallback", () => {
    const production = getTargetRecord("fry-sprite").imageSrc;
    const placeholder = getTargetRecord("fry-sprite").placeholderSrc;
    expect(resolveTargetDisplaySrc("fry-sprite", false)).toBe(production);
    expect(resolveTargetDisplaySrc("fry-sprite", true)).toBe(placeholder);
    expect(resolveTargetDisplaySrc("boba-bubbles", true)).toBe(
      getTargetRecord("boba-bubbles").placeholderSrc,
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
