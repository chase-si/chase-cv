import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ImageToUiSampleCard } from "@/components/image-to-ui/sample-image-card";

describe("ImageToUiSampleCard", () => {
  it("shows 待补充 when the sample image fails to load", () => {
    render(
      <ImageToUiSampleCard
        id="test-sample"
        imagePath="/missing-sample.png"
        title="示例标题"
        description="示例描述"
      />,
    );

    const img = screen.getByRole("img", { name: "示例标题" });
    fireEvent.error(img);

    expect(screen.getByText("待补充")).toBeInTheDocument();
    expect(screen.getByText("示例标题")).toBeInTheDocument();
    expect(screen.getByText("示例描述")).toBeInTheDocument();
  });
});
