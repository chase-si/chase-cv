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
          sampleId: "mondrian",
          src: "/imgs/image-to-ui/mondrian-1280.webp",
        }}
        sampleTitleById={{ mondrian: "蒙德里安构成" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
        onBackToEdit={() => {}}
      />,
    );

    const summary = screen.getByTestId("render-input-summary");
    expect(summary).toHaveAttribute(
      "data-render-input",
      JSON.stringify({
        imageSrc: "/imgs/image-to-ui/mondrian-1280.webp",
        colorRoles: [
          { role: "主色", hex: "#FF0088" },
          { role: "辅色", hex: "#112233" },
          { role: "强调色", hex: "#445566" },
        ],
      }),
    );
    expect(screen.getByTestId("render-input-image-summary")).toBeInTheDocument();
    expect(screen.getByTestId("render-input-image-thumbnail")).toBeInTheDocument();
    expect(screen.queryByTestId("active-image-preview")).not.toBeInTheDocument();
    expect(summary.style.getPropertyValue("--primary")).toBe("rgb(255, 0, 136)");
    expect(summary.style.getPropertyValue("--secondary")).toBe("rgb(17, 34, 51)");
    expect(summary.style.getPropertyValue("--accent")).toBe("rgb(68, 85, 102)");

    const tokenSummary = screen.getByTestId("render-preview-token-summary");
    expect(within(tokenSummary).getByTestId("preview-token-primary")).toHaveTextContent(
      "rgb(255, 0, 136)",
    );
    expect(within(tokenSummary).getByTestId("preview-token-background")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-card")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-foreground")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-border")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-ring")).toBeInTheDocument();
  });

  it("calls back to edit when the return action is used", () => {
    const onBackToEdit = vi.fn();
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "mondrian",
          src: "/imgs/image-to-ui/mondrian-1280.webp",
        }}
        sampleTitleById={{ mondrian: "蒙德里安构成" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
        onBackToEdit={onBackToEdit}
      />,
    );

    const summary = screen.getByTestId("render-input-summary");
    fireEvent.click(within(summary).getByTestId("render-back-to-edit"));
    expect(onBackToEdit).toHaveBeenCalledTimes(1);
  });
});
