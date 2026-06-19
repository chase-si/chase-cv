import { describe, expect, it } from "vitest";

import {
  DEMO_RUNTIME_GREEN_ARROW_IDS,
  DEMO_RUNTIME_ID_COLOR_MAP,
  getDemoRuntimeHighlightPresentation,
} from "@/lib/flow/demo-runtime-highlight";
import {
  FLOW_SVG_RUNTIME_DEMO_BRANCH_FILL,
  FLOW_SVG_RUNTIME_DEMO_FINISHED_FILL,
} from "@/lib/flow/svg-presentation";

describe("getDemoRuntimeHighlightPresentation", () => {
  it("returns undefined when highlight is disabled", () => {
    expect(getDemoRuntimeHighlightPresentation(false)).toBeUndefined();
  });

  it("maps fixed top-level and nested demo nodes with semantic fills", () => {
    const presentation = getDemoRuntimeHighlightPresentation(true);
    expect(presentation).toBeDefined();
    expect(presentation!.idColorMap).toEqual(DEMO_RUNTIME_ID_COLOR_MAP);
    expect(presentation!.idColorMap.step001).toBe(FLOW_SVG_RUNTIME_DEMO_FINISHED_FILL);
    expect(presentation!.idColorMap.step004).toBe(FLOW_SVG_RUNTIME_DEMO_BRANCH_FILL);
    expect(presentation!.greenArrowIds).toEqual([...DEMO_RUNTIME_GREEN_ARROW_IDS]);
    expect(presentation!.greenArrowIds).toContain("step003");
  });
});
