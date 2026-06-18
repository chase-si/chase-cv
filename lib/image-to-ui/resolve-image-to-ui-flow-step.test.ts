import { describe, expect, it } from "vitest";

import { resolveImageToUiFlowStep } from "@/lib/image-to-ui/resolve-image-to-ui-flow-step";

describe("resolveImageToUiFlowStep", () => {
  it("keeps step 1 when there is no active image", () => {
    expect(resolveImageToUiFlowStep(1, false)).toBe(1);
  });

  it("keeps step 2 when an active image exists", () => {
    expect(resolveImageToUiFlowStep(2, true)).toBe(2);
  });

  it("falls back to step 1 when step 2 has no active image", () => {
    expect(resolveImageToUiFlowStep(2, false)).toBe(1);
  });
});
