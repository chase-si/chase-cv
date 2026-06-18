import type { ReactNode } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RenderInputSummaryPanel } from "@/components/image-to-ui/render-input-summary-panel";
import { buildImageToUiRenderInput } from "@/lib/image-to-ui/build-image-to-ui-render-input";
import { derivePreviewThemeTokens } from "@/lib/image-to-ui/derive-preview-theme";

const mockThemeState = vi.hoisted(() => ({
  resolvedTheme: "light",
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockThemeState.resolvedTheme,
  }),
}));

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

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children?: ReactNode }) => (
    <svg data-testid="mock-area-chart">{children}</svg>
  ),
  BarChart: ({ children }: { children?: ReactNode }) => (
    <svg data-testid="mock-bar-chart">{children}</svg>
  ),
  Area: ({ dataKey, fill, stroke }: { dataKey: string; fill: string; stroke: string }) => (
    <path data-testid={`mock-area-${dataKey}`} data-fill={fill} data-stroke={stroke} />
  ),
  Bar: ({ dataKey, fill }: { dataKey: string; fill: string }) => (
    <rect data-testid={`mock-bar-${dataKey}`} data-fill={fill} />
  ),
  CartesianGrid: () => <g data-testid="mock-cartesian-grid" />,
  Tooltip: () => <g data-testid="mock-chart-tooltip" />,
  XAxis: () => <g data-testid="mock-x-axis" />,
  YAxis: () => <g data-testid="mock-y-axis" />,
}));

afterEach(() => {
  mockThemeState.resolvedTheme = "light";
  cleanup();
});

describe("RenderInputSummaryPanel", () => {
  it("exposes the image-and-color contract on the summary root", () => {
    const selectedColors = ["#FF0088", "#112233", "#445566"];
    const activeImage = {
      type: "sample" as const,
      sampleId: "great-wave",
      src: "/imgs/image-to-ui/great-wave-1280.webp",
    };
    const renderInput = buildImageToUiRenderInput(activeImage, selectedColors);

    render(
      <RenderInputSummaryPanel
        activeImage={activeImage}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
        selectedColors={selectedColors}
      />,
    );

    const summary = screen.getByTestId("render-input-summary");
    expect(summary).toHaveAttribute(
      "data-render-input",
      JSON.stringify({
        imageSrc: renderInput.imageSrc,
        colorRoles: renderInput.colorRoles,
      }),
    );
    expect(screen.getByTestId("render-input-image-summary")).toBeInTheDocument();
    expect(screen.getByTestId("render-input-image-thumbnail")).toBeInTheDocument();
    expect(screen.queryByTestId("active-image-preview")).not.toBeInTheDocument();
    expect(summary.style.getPropertyValue("--primary")).toBe("");
    expect(summary.style.getPropertyValue("--secondary")).toBe("");
    expect(summary.style.getPropertyValue("--accent")).toBe("");

    const preview = screen.getByTestId("saas-preview-surface");
    const lightTokens = derivePreviewThemeTokens({
      selectedColors,
      mode: "light",
    });
    expect(preview.style.getPropertyValue("--primary")).toBe(lightTokens.primary);
    expect(preview.style.getPropertyValue("--secondary")).toBe(lightTokens.secondary);
    expect(preview.style.getPropertyValue("--accent")).toBe(lightTokens.accent);
    expect(preview.style.getPropertyValue("--popover")).toBe(lightTokens.popover);
    expect(preview.style.getPropertyValue("--radius")).toBe(lightTokens.radius);
    expect(preview.style.getPropertyValue("--shadow-sm")).toBe(lightTokens["shadow-sm"]);
    expect(preview.className).toMatch(/tracking-normal/);

    const tokenSummary = screen.getByTestId("render-preview-token-summary");
    expect(within(tokenSummary).getByTestId("preview-token-primary")).toHaveTextContent(
      lightTokens.primary,
    );
    expect(within(tokenSummary).getByTestId("preview-token-background")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-card")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-popover")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-muted")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-input")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-foreground")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-border")).toBeInTheDocument();
    expect(within(tokenSummary).getByTestId("preview-token-ring")).toBeInTheDocument();
  });

  it("updates scoped preview tokens when the global color scheme changes", () => {
    const props = {
      activeImage: {
        type: "sample" as const,
        sampleId: "great-wave",
        src: "/imgs/image-to-ui/great-wave-1280.webp",
      },
      sampleTitleById: { "great-wave": "神奈川冲浪里" },
      selectedColors: ["#3366FF", "#00AA55", "#FFAA00"],
    };
    const { rerender } = render(<RenderInputSummaryPanel {...props} />);

    const preview = screen.getByTestId("saas-preview-surface");
    const lightTokens = derivePreviewThemeTokens({
      selectedColors: props.selectedColors,
      mode: "light",
    });
    expect(preview.style.getPropertyValue("--background")).toBe(lightTokens.background);
    expect(preview.style.getPropertyValue("--primary")).toBe(lightTokens.primary);

    mockThemeState.resolvedTheme = "dark";
    rerender(<RenderInputSummaryPanel {...props} />);

    const darkTokens = derivePreviewThemeTokens({
      selectedColors: props.selectedColors,
      mode: "dark",
    });
    expect(preview.style.getPropertyValue("--background")).toBe(darkTokens.background);
    expect(preview.style.getPropertyValue("--primary")).toBe(darkTokens.primary);
  });

  it("switches between overview and settings tabs inside preview", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "great-wave",
          src: "/imgs/image-to-ui/great-wave-1280.webp",
        }}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    const tabs = within(preview).getByRole("tablist", { name: "Preview sections" });
    const overviewTab = within(tabs).getByRole("tab", { name: "Overview" });
    const settingsTab = within(tabs).getByRole("tab", { name: "Workspace settings" });
    const landingTab = within(tabs).getByRole("tab", { name: "Landing page" });

    expect(overviewTab).toHaveAttribute("aria-selected", "true");
    expect(within(preview).getByTestId("saas-status-area")).toBeInTheDocument();
    expect(within(preview).queryByTestId("saas-settings-form")).not.toBeInTheDocument();

    fireEvent.click(settingsTab);
    expect(settingsTab).toHaveAttribute("aria-selected", "true");

    const settingsGallery = within(preview).getByTestId("saas-settings-form");
    expect(within(preview).queryByTestId("saas-status-area")).not.toBeInTheDocument();
    expect(within(settingsGallery).getByText("Upgrade your subscription")).toBeInTheDocument();
    expect(within(settingsGallery).getByText("Team Members")).toBeInTheDocument();
    expect(within(settingsGallery).getByText("Create an account")).toBeInTheDocument();
    expect(within(settingsGallery).getByLabelText("Workspace name")).toBeInTheDocument();
    expect(within(settingsGallery).getByRole("combobox", { name: "Plan" })).toBeInTheDocument();
    expect(within(settingsGallery).getByRole("group", { name: "Auto-scale threshold" })).toBeInTheDocument();
    expect(
      within(settingsGallery).getByRole("button", { name: "Enable maintenance mode" }),
    ).toBeInTheDocument();
    expect(
      within(settingsGallery).getByRole("checkbox", { name: /Notify on-call via SMS/ }),
    ).toBeInTheDocument();
    expect(within(settingsGallery).getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    expect(within(settingsGallery).getByText("Cookie Settings")).toBeInTheDocument();

    fireEvent.click(overviewTab);
    expect(within(preview).getByTestId("saas-metric-mrr")).toHaveTextContent("$84,200");
    expect(within(preview).getByTestId("saas-metric-incidents")).toHaveTextContent("3");

    fireEvent.click(landingTab);
    expect(landingTab).toHaveAttribute("aria-selected", "true");
    expect(within(preview).queryByTestId("saas-status-area")).not.toBeInTheDocument();
    expect(within(preview).getByTestId("landing-page-preview")).toBeInTheDocument();
    expect(within(preview).getByTestId("landing-hero")).toHaveTextContent("Launch customer success faster");
    expect(within(preview).getByRole("button", { name: "Start free trial" }).className).toMatch(/bg-primary/);
    expect(within(preview).getByRole("button", { name: "View demo" }).className).toMatch(/border-primary/);
    expect(within(preview).getByTestId("landing-nav")).toBeInTheDocument();
    expect(within(preview).getByTestId("landing-hero-panel")).toBeInTheDocument();
    expect(within(preview).getAllByTestId("landing-feature-card")).toHaveLength(3);
    expect(within(preview).getByTestId("landing-social-proof")).toHaveTextContent("+8");
    expect(within(preview).getByTestId("landing-conversion-strip")).toBeInTheDocument();
  });

  it("shows alert and accent sections in preview overview", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "great-wave",
          src: "/imgs/image-to-ui/great-wave-1280.webp",
        }}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    expect(within(preview).getByTestId("saas-alert-notification")).toBeInTheDocument();
    expect(within(preview).getByTestId("saas-accent-section")).toBeInTheDocument();
  });

  it("renders dashboard navigation and Recharts-powered chart sections in the preview overview", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "great-wave",
          src: "/imgs/image-to-ui/great-wave-1280.webp",
        }}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    expect(within(preview).getByTestId("saas-dashboard-sidebar")).toHaveTextContent("Dashboard");
    expect(within(preview).getByTestId("saas-dashboard-toolbar")).toHaveTextContent("Quick Create");
    expect(within(preview).getAllByTestId("saas-kpi-card")).toHaveLength(4);
    expect(within(preview).getByTestId("saas-revenue-chart-section")).toBeInTheDocument();
    expect(within(preview).getByTestId("saas-segment-chart-section")).toBeInTheDocument();
    expect(within(preview).getByTestId("mock-area-chart")).toBeInTheDocument();
    expect(within(preview).getByTestId("mock-bar-chart")).toBeInTheDocument();
    expect(within(preview).getByTestId("mock-area-revenue")).toHaveAttribute("data-stroke", "var(--primary)");
    expect(within(preview).getByTestId("mock-area-expansion")).toHaveAttribute("data-stroke", "var(--accent)");
    expect(within(preview).getByTestId("mock-bar-active")).toHaveAttribute("data-fill", "var(--secondary)");
    expect(within(preview).getByTestId("mock-bar-risk")).toHaveAttribute("data-fill", "var(--accent)");
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
          sampleId: "great-wave",
          src: "/imgs/image-to-ui/great-wave-1280.webp",
        }}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
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
          sampleId: "great-wave",
          src: "/imgs/image-to-ui/great-wave-1280.webp",
        }}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
        selectedColors={["#FF0088", "#112233", "#445566"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    expect(within(preview).getByTestId("saas-primary-action").className).toMatch(/bg-primary/);
    expect(within(preview).getByTestId("saas-secondary-chip").className).toMatch(/bg-secondary/);
    expect(within(preview).getByTestId("saas-accent-badge").className).toMatch(/bg-accent/);

    const tabs = within(preview).getByRole("tablist", { name: "Preview sections" });
    expect(within(tabs).getByRole("tab", { name: "Overview" }).className).toMatch(/aria-selected:bg-primary/);
    expect(within(preview).getByTestId("saas-dashboard-sidebar").className).toMatch(/bg-card/);
  });

  it("scopes portaled select popup theme variables to the preview palette", () => {
    const selectedColors = ["#FF0088", "#112233", "#445566"];
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "great-wave",
          src: "/imgs/image-to-ui/great-wave-1280.webp",
        }}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
        selectedColors={selectedColors}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    const lightTokens = derivePreviewThemeTokens({ selectedColors, mode: "light" });

    fireEvent.click(within(preview).getByRole("tab", { name: "Workspace settings" }));
    fireEvent.click(within(preview).getByRole("combobox", { name: "Plan" }));

    const selectPopup = document.querySelector('[data-slot="select-content"]');
    expect(selectPopup).toBeTruthy();
    expect((selectPopup as HTMLElement).style.getPropertyValue("--primary")).toBe(lightTokens.primary);
    expect((selectPopup as HTMLElement).style.getPropertyValue("--accent")).toBe(lightTokens.accent);
  });

  it("reserves primary for actions and high-emphasis states instead of large preview surfaces", () => {
    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "great-wave",
          src: "/imgs/image-to-ui/great-wave-1280.webp",
        }}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
        selectedColors={["#faf8f0", "#09568c", "#9e9982"]}
      />,
    );

    const preview = screen.getByTestId("saas-preview-surface");
    const overviewLargeSurfaceTestIds = [
      "saas-status-area",
      "saas-revenue-chart-section",
      "saas-segment-chart-section",
    ];

    for (const testId of overviewLargeSurfaceTestIds) {
      const className = within(preview).getByTestId(testId).className;
      expect(className).not.toMatch(/(?:bg|border)-primary/);
    }

    expect(within(preview).getByTestId("saas-primary-action").className).toMatch(/bg-primary/);

    fireEvent.click(within(preview).getByRole("tab", { name: "Landing page" }));

    expect(within(preview).getByTestId("landing-hero").className).not.toMatch(
      /(?:bg|border)-primary/,
    );
    expect(within(preview).getByTestId("landing-primary-cta").className).toMatch(/bg-primary/);
  });

  it("shows classified role labels and short rationales for each selected color", () => {
    const selectedColors = ["#faf8f0", "#09568c", "#9e9982"];
    const renderInput = buildImageToUiRenderInput(
      {
        type: "sample",
        sampleId: "great-wave",
        src: "/imgs/image-to-ui/great-wave-1280.webp",
      },
      selectedColors,
    );

    render(
      <RenderInputSummaryPanel
        activeImage={{
          type: "sample",
          sampleId: "great-wave",
          src: "/imgs/image-to-ui/great-wave-1280.webp",
        }}
        sampleTitleById={{ "great-wave": "神奈川冲浪里" }}
        selectedColors={selectedColors}
      />,
    );

    for (const entry of renderInput.colorRoles) {
      const row = screen.getByTestId(`render-input-color-${entry.role}`);
      expect(within(row).getByText(entry.role)).toBeInTheDocument();
      expect(within(row).getByTestId("render-input-color-rationale")).toHaveTextContent(
        entry.rationale,
      );
    }
  });
});
