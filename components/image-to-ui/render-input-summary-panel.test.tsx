import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RenderInputSummaryPanel } from "@/components/image-to-ui/render-input-summary-panel";

vi.mock("next/image", () => ({
  default: function MockNextImage({
    alt,
    src,
    className,
  }: {
    alt: string;
    src: string;
    className?: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element -- test double for next/image
    return <img alt={alt} src={src} className={className} />;
  },
}));

afterEach(() => {
  cleanup();
});

describe("RenderInputSummaryPanel", () => {
  it("exposes the image-and-color contract on the summary root", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "minimal-dashboard",
          src: "/image-to-ui/samples/minimal-dashboard.png",
        }}
        sampleTitleById={{ "minimal-dashboard": "极简仪表盘" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
        onBackToEdit={() => {}}
      />,
    );

    const summary = screen.getByTestId("render-input-summary");
    expect(summary).toHaveAttribute(
      "data-render-input",
      JSON.stringify({
        imageSrc: "/image-to-ui/samples/minimal-dashboard.png",
        colorRoles: [
          { role: "主色", hex: "#FF0088" },
          { role: "辅色", hex: "#112233" },
          { role: "强调色", hex: "#445566" },
        ],
      }),
    );
  });

  it("calls back to edit when the return action is used", () => {
    const onBackToEdit = vi.fn();
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "minimal-dashboard",
          src: "/image-to-ui/samples/minimal-dashboard.png",
        }}
        sampleTitleById={{ "minimal-dashboard": "极简仪表盘" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
        onBackToEdit={onBackToEdit}
      />,
    );

    const summary = screen.getByTestId("render-input-summary");
    fireEvent.click(within(summary).getByTestId("render-back-to-edit"));
    expect(onBackToEdit).toHaveBeenCalledTimes(1);
  });
});
