import { describe, expect, it } from "vitest";

import {
  imageToUiToolSessionReducer,
  initialImageToUiToolSessionFlowState,
  type ImageToUiToolSessionAction,
} from "@/lib/image-to-ui/image-to-ui-tool-session";

function reduce(actions: ImageToUiToolSessionAction[]) {
  return actions.reduce(
    (state, action) => imageToUiToolSessionReducer(state, action),
    initialImageToUiToolSessionFlowState(),
  );
}

describe("imageToUiToolSessionReducer flow step", () => {
  it("starts on step 1", () => {
    expect(initialImageToUiToolSessionFlowState().flowStep).toBe(1);
  });

  it("moves to step 2 when render is confirmed", () => {
    expect(reduce([{ type: "advance_to_render" }]).flowStep).toBe(2);
  });

  it("returns to step 1 when the user backs out of render", () => {
    expect(
      reduce([{ type: "advance_to_render" }, { type: "back_to_edit" }]).flowStep,
    ).toBe(1);
  });

  it("resets to step 1 when the active image changes (new upload or sample)", () => {
    expect(
      reduce([{ type: "advance_to_render" }, { type: "active_image_changed" }]).flowStep,
    ).toBe(1);
  });

  it("resets to step 1 on route restore (history back or bfcache pageshow)", () => {
    expect(
      reduce([{ type: "advance_to_render" }, { type: "route_restore" }]).flowStep,
    ).toBe(1);
  });
});
