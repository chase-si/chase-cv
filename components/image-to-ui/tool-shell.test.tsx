import type { ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageToUiToolShell } from "@/components/image-to-ui/tool-shell";
import zhMessages from "@/messages/zh.json";

vi.mock("next/navigation", () => ({
  usePathname: () => "/image-to-ui",
}));

vi.mock("@/lib/image-to-ui/extract-palette-from-image-src", () => ({
  extractPaletteFromImageSrc: vi.fn().mockResolvedValue([
    { role: "Dominant1", hex: "#FF0088", proportion: 0.35 },
    { role: "Dominant2", hex: "#112233", proportion: 0.22 },
    { role: "Dominant3", hex: "#445566", proportion: 0.15 },
  ]),
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
  Area: ({ dataKey }: { dataKey: string }) => <path data-testid={`mock-area-${dataKey}`} />,
  Bar: ({ dataKey }: { dataKey: string }) => <rect data-testid={`mock-bar-${dataKey}`} />,
  CartesianGrid: () => <g data-testid="mock-cartesian-grid" />,
  Tooltip: () => <g data-testid="mock-chart-tooltip" />,
  XAxis: () => <g data-testid="mock-x-axis" />,
  YAxis: () => <g data-testid="mock-y-axis" />,
}));

afterEach(() => {
  cleanup();
});

function getSampleCard(sampleId: string) {
  const card = document.querySelector(`[data-sample-id="${sampleId}"]`);
  if (!card) {
    throw new Error(`Sample card not found: ${sampleId}`);
  }
  return card as HTMLElement;
}

function renderToolShell() {
  return render(
    <NextIntlClientProvider locale="zh" messages={zhMessages}>
      <ImageToUiToolShell />
    </NextIntlClientProvider>,
  );
}

describe("ImageToUiToolShell active image selection", () => {
  it("shows the selected sample in the main preview with contain fitting", () => {
    renderToolShell();

    fireEvent.click(getSampleCard("great-wave"));

    const preview = screen.getByTestId("active-image-preview");
    const img = within(preview).getByRole("img", { name: "神奈川冲浪里" });
    expect(img).toHaveAttribute("src", "/imgs/image-to-ui/great-wave-1280.webp");
    expect(img.className).toMatch(/object-contain/);
  });

  it("replaces the active image when a local file is uploaded", () => {
    const createObjectURL = vi.fn(() => "blob:local-preview");
    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL: vi.fn(),
    });

    renderToolShell();

    fireEvent.click(getSampleCard("great-wave"));
    const fileInput = screen.getByLabelText("从本地上传图片");
    const file = new File(["pixels"], "local.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const previewImg = screen.getByRole("img", { name: "本地上传的图片" });
    expect(previewImg).toHaveAttribute("src", "blob:local-preview");
    expect(createObjectURL).toHaveBeenCalledWith(file);
  });

  it("keeps sample thumbnails compact with cover cropping", () => {
    renderToolShell();

    const sampleCard = getSampleCard("great-wave");
    const thumbnail = within(sampleCard).getByRole("presentation");
    expect(thumbnail.className).toMatch(/object-cover/);
  });
});

async function selectThreePaletteSwatches() {
  fireEvent.click(getSampleCard("great-wave"));

  await waitFor(() => {
    expect(screen.getByTestId("palette-swatch-Dominant1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("palette-swatch-Dominant1"));
  fireEvent.click(screen.getByTestId("palette-swatch-Dominant2"));
  fireEvent.click(screen.getByTestId("palette-swatch-Dominant3"));
}

describe("ImageToUiToolShell palette selection", () => {
  it("enables render only after three ordered swatches are selected", async () => {
    renderToolShell();

    fireEvent.click(getSampleCard("great-wave"));

    await waitFor(() => {
      expect(screen.getByTestId("palette-swatch-Dominant1")).toBeInTheDocument();
    });

    const renderButton = screen.getByTestId("palette-render-button");
    expect(renderButton).toBeDisabled();

    fireEvent.click(screen.getByTestId("palette-swatch-Dominant1"));
    fireEvent.click(screen.getByTestId("palette-swatch-Dominant2"));
    expect(renderButton).toBeDisabled();

    fireEvent.click(screen.getByTestId("palette-swatch-Dominant3"));
    expect(renderButton).toBeEnabled();
    expect(screen.getByTestId("palette-swatch-role-Dominant1")).toHaveTextContent("已选色 1");
    expect(screen.getByTestId("palette-swatch-role-Dominant3")).toHaveTextContent("已选色 3");
  });
});

describe("ImageToUiToolShell render input summary", () => {
  it("switches to the summary step without leaving the page when Render is clicked", async () => {
    renderToolShell();

    await selectThreePaletteSwatches();
    fireEvent.click(screen.getByTestId("palette-render-button"));

    expect(screen.getByTestId("render-input-summary")).toBeInTheDocument();
    expect(screen.getByTestId("saas-preview-surface")).toBeInTheDocument();
    expect(screen.queryByTestId("palette-selection")).not.toBeInTheDocument();
    expect(screen.getByText("渲染界面")).toBeInTheDocument();
    expect(screen.queryByText("界面生成功能即将接入。")).not.toBeInTheDocument();
  });

  it("shows the active image and three color roles on the summary step", async () => {
    renderToolShell();

    await selectThreePaletteSwatches();
    fireEvent.click(screen.getByTestId("palette-render-button"));

    const summary = screen.getByTestId("render-input-summary");
    const imageSummary = within(summary).getByTestId("render-input-image-summary");
    expect(within(imageSummary).getByRole("img", { name: "神奈川冲浪里" })).toBeInTheDocument();
    expect(screen.queryByTestId("active-image-preview")).not.toBeInTheDocument();

    expect(screen.getByTestId("render-input-color-动作色")).toHaveTextContent("#FF0088");
    expect(screen.getByTestId("render-input-color-表面基底")).toHaveTextContent("#445566");
    expect(screen.getByTestId("render-input-color-辅助色")).toHaveTextContent("#112233");
  });

  it("applies derived css variables only on the preview root", async () => {
    renderToolShell();

    await selectThreePaletteSwatches();
    fireEvent.click(screen.getByTestId("palette-render-button"));

    const summaryRoot = screen.getByTestId("render-input-summary");
    expect(summaryRoot.style.getPropertyValue("--primary")).toBe("");
    expect(summaryRoot.style.getPropertyValue("--ring")).toBe("");

    const previewRoot = screen.getByTestId("saas-preview-surface");
    expect(previewRoot.style.getPropertyValue("--primary")).toBe("rgb(255, 0, 136)");
    expect(previewRoot.style.getPropertyValue("--ring")).toBe("rgb(255, 0, 136)");

    const pageMain = screen.getByRole("main");
    expect(pageMain.style.getPropertyValue("--primary")).toBe("");
    expect(pageMain.style.getPropertyValue("--ring")).toBe("");
  });

  it("localizes Chinese workflow labels and preview content", async () => {
    renderToolShell();

    await selectThreePaletteSwatches();
    fireEvent.click(screen.getByTestId("palette-render-button"));

    expect(screen.getByText("图片转界面")).toBeInTheDocument();
    expect(screen.getByText("确认当前图片与三色角色；查看完整预览并可返回继续编辑。")).toBeInTheDocument();

    const preview = screen.getByTestId("saas-preview-surface");
    expect(within(preview).getByRole("tab", { name: "概览" })).toBeInTheDocument();
    expect(within(preview).getByRole("tab", { name: "工作区设置" })).toBeInTheDocument();
    expect(within(preview).getByTestId("saas-dashboard-toolbar")).toHaveTextContent("文档");
    expect(within(preview).getByTestId("saas-revenue-chart-section")).toBeInTheDocument();
  });

  it("returns to edit and preserves image and color choices", async () => {
    renderToolShell();

    await selectThreePaletteSwatches();
    fireEvent.click(screen.getByTestId("palette-render-button"));
    fireEvent.click(screen.getByTestId("render-back-to-edit"));

    expect(screen.getByTestId("palette-selection")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "神奈川冲浪里" })).toBeInTheDocument();
    expect(screen.getByTestId("palette-swatch-role-Dominant1")).toHaveTextContent("已选色 1");
    expect(screen.getByTestId("palette-render-button")).toBeEnabled();
  });
});

describe("ImageToUiToolShell route restore", () => {
  it("returns to step 1 with the source sidebar after a persisted pageshow", async () => {
    renderToolShell();

    await selectThreePaletteSwatches();
    fireEvent.click(screen.getByTestId("palette-render-button"));
    expect(screen.getByTestId("render-input-summary")).toBeInTheDocument();

    fireEvent(window, new PageTransitionEvent("pageshow", { persisted: true }));

    expect(screen.getByLabelText("图片来源")).toBeInTheDocument();
    expect(screen.queryByTestId("render-input-summary")).not.toBeInTheDocument();
    expect(screen.getByLabelText("工具步骤")).toHaveTextContent("选择图片与颜色");
    expect(screen.getByTestId("palette-selection")).toBeInTheDocument();
  });
});
