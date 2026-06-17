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
    expect(summary.style.getPropertyValue("--primary")).toBe("");
    expect(summary.style.getPropertyValue("--secondary")).toBe("");
    expect(summary.style.getPropertyValue("--accent")).toBe("");

    const preview = screen.getByTestId("saas-preview-surface");
    expect(preview.style.getPropertyValue("--primary")).toBe("rgb(255, 0, 136)");
    expect(preview.style.getPropertyValue("--secondary")).toBe("rgb(17, 34, 51)");
    expect(preview.style.getPropertyValue("--accent")).toBe("rgb(68, 85, 102)");
    expect(preview.className).toMatch(/tracking-normal/);

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

  it("switches between overview and settings tabs inside preview", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "mondrian",
          src: "/imgs/image-to-ui/mondrian-1280.webp",
        }}
        sampleTitleById={{ mondrian: "蒙德里安构成" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    const tabs = within(preview).getByRole("tablist", { name: "Preview sections" });
    const overviewTab = within(tabs).getByRole("tab", { name: "Overview" });
    const settingsTab = within(tabs).getByRole("tab", { name: "Workspace settings" });

    expect(overviewTab).toHaveAttribute("aria-selected", "true");
    expect(within(preview).getByTestId("saas-status-area")).toBeInTheDocument();
    expect(within(preview).queryByTestId("saas-settings-form")).not.toBeInTheDocument();

    fireEvent.click(settingsTab);
    expect(settingsTab).toHaveAttribute("aria-selected", "true");

    const settingsForm = within(preview).getByTestId("saas-settings-form");
    expect(within(preview).queryByTestId("saas-status-area")).not.toBeInTheDocument();
    expect(within(settingsForm).getByLabelText("Workspace name")).toBeInTheDocument();
    expect(within(settingsForm).getByRole("combobox", { name: "Plan" })).toBeInTheDocument();
    expect(within(settingsForm).getByRole("group", { name: "Auto-scale threshold" })).toBeInTheDocument();
    expect(within(settingsForm).getByRole("button", { name: "Enable maintenance mode" })).toBeInTheDocument();
    expect(
      within(settingsForm).getByRole("checkbox", { name: /Notify on-call via SMS/ }),
    ).toBeInTheDocument();
    expect(within(settingsForm).getByRole("switch", { name: "Allow public status page" })).toBeInTheDocument();
    expect(within(settingsForm).getByRole("button", { name: "Save changes" })).toBeInTheDocument();

    fireEvent.click(overviewTab);
    expect(within(preview).getByTestId("saas-metric-mrr")).toHaveTextContent("$84,200");
    expect(within(preview).getByTestId("saas-metric-incidents")).toHaveTextContent("3");
  });

  it("shows alert and accent sections in preview overview", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "mondrian",
          src: "/imgs/image-to-ui/mondrian-1280.webp",
        }}
        sampleTitleById={{ mondrian: "蒙德里安构成" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    expect(within(preview).getByTestId("saas-alert-notification")).toBeInTheDocument();
    expect(within(preview).getByTestId("saas-accent-section")).toBeInTheDocument();
  });

  it("renders display feedback primitives in the preview overview", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "mondrian",
          src: "/imgs/image-to-ui/mondrian-1280.webp",
        }}
        sampleTitleById={{ mondrian: "蒙德里安构成" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    expect(within(preview).getByTestId("saas-health-progress")).toBeInTheDocument();
    expect(within(preview).getByTestId("saas-overview-separator")).toBeInTheDocument();
    expect(within(preview).getByTestId("saas-response-team")).toHaveTextContent("+2");
    expect(
      within(preview).getByRole("button", { name: "Show incident response details" }),
    ).toBeInTheDocument();
  });

  it("renders a compact data table with status badges and accessible row actions", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "mondrian",
          src: "/imgs/image-to-ui/mondrian-1280.webp",
        }}
        sampleTitleById={{ mondrian: "蒙德里安构成" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    const tableSection = within(preview).getByTestId("saas-data-table-section");
    const table = within(tableSection).getByRole("table", { name: "Customer pipeline health" });
    expect(within(table).getByRole("columnheader", { name: "Customer" })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: "ARR" })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();
    expect(within(table).getByText("Acme Robotics")).toBeInTheDocument();
    expect(within(table).getByText("At risk")).toBeInTheDocument();
    expect(within(table).getByText("Healthy")).toBeInTheDocument();
    expect(within(table).getByRole("button", { name: "Open Acme Robotics account" })).toBeInTheDocument();
    expect(
      within(table).getByRole("button", { name: "Schedule QBR for Northwind Labs" }),
    ).toBeInTheDocument();
    expect(within(table).getByRole("button", { name: "Review Zephyr Mobility renewal" })).toBeInTheDocument();
  });

  it("shows primary secondary and accent roles in the preview section", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "mondrian",
          src: "/imgs/image-to-ui/mondrian-1280.webp",
        }}
        sampleTitleById={{ mondrian: "蒙德里安构成" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    expect(within(preview).getByTestId("saas-primary-action").className).toMatch(/bg-primary/);
    expect(within(preview).getByTestId("saas-secondary-chip").className).toMatch(/bg-secondary/);
    expect(within(preview).getByTestId("saas-accent-badge").className).toMatch(/bg-accent/);

    const tabs = within(preview).getByRole("tablist", { name: "Preview sections" });
    expect(within(tabs).getByRole("tab", { name: "Overview" }).className).toMatch(/aria-selected:bg-primary/);
    expect(within(preview).getByTestId("saas-primary-surface").className).toMatch(/bg-primary\/10/);
  });
});
