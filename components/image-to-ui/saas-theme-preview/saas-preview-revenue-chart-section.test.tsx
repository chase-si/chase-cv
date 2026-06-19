import type { ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PreviewThemeScopeProvider } from "@/components/image-to-ui/preview-theme-scope";
import { SaasPreviewRevenueChartSection } from "@/components/image-to-ui/saas-theme-preview/saas-preview-revenue-chart-section";
import enMessages from "@/messages/en.json";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children?: ReactNode }) => (
    <svg data-testid="mock-area-chart">{children}</svg>
  ),
  Area: ({ dataKey, fill, stroke }: { dataKey: string; fill: string; stroke: string }) => (
    <path data-testid={`mock-area-${dataKey}`} data-fill={fill} data-stroke={stroke} />
  ),
  CartesianGrid: () => <g data-testid="mock-cartesian-grid" />,
  Tooltip: () => <g data-testid="mock-chart-tooltip" />,
  XAxis: () => <g data-testid="mock-x-axis" />,
  YAxis: () => <g data-testid="mock-y-axis" />,
}));

afterEach(() => {
  cleanup();
});

function renderBlock(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <PreviewThemeScopeProvider previewRootStyle={{ color: "var(--foreground)" }}>
        {ui}
      </PreviewThemeScopeProvider>
    </NextIntlClientProvider>,
  );
}

describe("SaasPreviewRevenueChartSection", () => {
  it("binds revenue series strokes to scoped primary and accent tokens", () => {
    renderBlock(<SaasPreviewRevenueChartSection />);

    expect(screen.getByTestId("saas-revenue-chart-section")).toBeInTheDocument();
    expect(screen.getByTestId("saas-recharts-area")).toBeInTheDocument();

    const revenueSeries = screen.getByTestId("mock-area-revenue");
    expect(revenueSeries).toHaveAttribute("data-fill", "var(--primary)");
    expect(revenueSeries).toHaveAttribute("data-stroke", "var(--primary)");

    const expansionSeries = screen.getByTestId("mock-area-expansion");
    expect(expansionSeries).toHaveAttribute("data-fill", "var(--accent)");
    expect(expansionSeries).toHaveAttribute("data-stroke", "var(--accent)");
  });
});
