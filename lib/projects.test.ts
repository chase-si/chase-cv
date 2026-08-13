import { describe, expect, it } from "vitest";

import { homepageProjectShowcaseOrder, projectNavigationItems } from "@/lib/projects";

describe("project navigation and homepage showcase order", () => {
  it("lists Dudu Scanner first in the Playground nav", () => {
    expect(projectNavigationItems.map((item) => item.id)).toEqual([
      "duduScanner",
      "magicCursor",
      "imageToUi",
      "flowEditor",
    ]);
  });

  it("lists Dudu Scanner, Image to UI, then Magic Cursor on the homepage", () => {
    expect(homepageProjectShowcaseOrder).toEqual(["duduScanner", "imageToUi", "magicCursor"]);
  });
});
