import { describe, expect, it } from "vitest";

import { createDefaultImageToUiPathnameAdapter } from "@/lib/image-to-ui/image-to-ui-route-pathname";

describe("createDefaultImageToUiPathnameAdapter", () => {
  const { isImageToUiRoute } = createDefaultImageToUiPathnameAdapter();

  it("recognizes the default-locale image-to-ui route", () => {
    expect(isImageToUiRoute("/image-to-ui")).toBe(true);
    expect(isImageToUiRoute("/image-to-ui/")).toBe(true);
  });

  it("recognizes locale-prefixed image-to-ui routes", () => {
    expect(isImageToUiRoute("/zh/image-to-ui")).toBe(true);
    expect(isImageToUiRoute("/en/image-to-ui")).toBe(true);
  });

  it("does not treat unrelated routes as image-to-ui", () => {
    expect(isImageToUiRoute("/")).toBe(false);
    expect(isImageToUiRoute("/about")).toBe(false);
    expect(isImageToUiRoute("/image-to-ui/extra")).toBe(false);
  });
});
