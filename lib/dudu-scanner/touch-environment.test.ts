import { describe, expect, it, vi } from "vitest";

import {
  prefersTouchOperatorControls,
  TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY,
} from "@/lib/dudu-scanner/touch-environment";

describe("prefersTouchOperatorControls", () => {
  it("matches coarse pointer environments", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query === TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    expect(prefersTouchOperatorControls()).toBe(true);
    vi.unstubAllGlobals();
  });
});
