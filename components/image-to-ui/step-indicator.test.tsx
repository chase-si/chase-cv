import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ImageToUiStepIndicator } from "@/components/image-to-ui/step-indicator";

describe("ImageToUiStepIndicator", () => {
  it("shows two steps for color selection and rendering", () => {
    render(<ImageToUiStepIndicator activeStep={1} />);

    expect(screen.getByText("选择图片与颜色")).toBeInTheDocument();
    expect(screen.getByText("渲染界面")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
