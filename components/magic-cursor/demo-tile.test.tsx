import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MAGIC_CURSOR_EFFECTS } from "@/lib/constants/magic-cursor";

const createEffect = vi.fn(() => ({ destroy: vi.fn() }));

vi.mock("magic-cursor-effect", () => ({
  createEffect: (...args: unknown[]) => createEffect(...args),
}));

vi.mock("@/components/theme-provider", () => ({
  useTheme: () => ({ resolvedTheme: "dark" }),
}));

function stubMotionEnvironment() {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(hover: hover) and (pointer: fine)",
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  vi.stubGlobal(
    "IntersectionObserver",
    class {
      callback: IntersectionObserverCallback;
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }
      observe(target: Element) {
        this.callback(
          [
            {
              isIntersecting: true,
              intersectionRatio: 1,
              target,
              time: 0,
              boundingClientRect: target.getBoundingClientRect(),
              intersectionRect: target.getBoundingClientRect(),
              rootBounds: null,
            } as IntersectionObserverEntry,
          ],
          this as unknown as IntersectionObserver,
        );
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = "";
      thresholds = [0];
    },
  );
}

describe("MagicCursorDemoTile", () => {
  beforeEach(() => {
    createEffect.mockClear();
    stubMotionEnvironment();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("keeps the cursor effect mounted after the parent re-renders", async () => {
    const { MagicCursorDemoTile } = await import("@/components/magic-cursor/demo-tile");
    const options = MAGIC_CURSOR_EFFECTS.TRAIL.options;

    const { rerender } = render(
      <MagicCursorDemoTile effect="trail" options={options} enabled />,
    );

    rerender(<MagicCursorDemoTile effect="trail" options={options} enabled />);

    const liveInstances = createEffect.mock.results.filter((result) => {
      if (result.type !== "return") return false;
      const instance = result.value as { destroy: ReturnType<typeof vi.fn> };
      return instance.destroy.mock.calls.length === 0;
    });

    expect(createEffect).toHaveBeenCalled();
    expect(liveInstances.length).toBe(1);
  });
});
