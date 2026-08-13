import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Slider } from "@/components/ui/slider";

describe("Slider", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a single thumb when value is a number", () => {
    render(<Slider min={0} max={100} step={1} value={18} />);

    expect(document.querySelectorAll("[data-slot=slider-thumb]")).toHaveLength(1);
  });
});
