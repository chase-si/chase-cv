import { describe, expect, it } from "vitest";

import { homepageProjectShowcaseOrder } from "@/lib/projects";

describe("homepageProjectShowcaseOrder", () => {
  it("lists Image to UI, Magic Cursor, then Flow Editor", () => {
    expect(homepageProjectShowcaseOrder).toEqual(["imageToUi", "magicCursor", "flowEditor"]);
  });
});
