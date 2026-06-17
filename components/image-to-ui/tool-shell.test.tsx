import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageToUiToolShell } from "@/components/image-to-ui/tool-shell";

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

function getSampleCard(sampleId: string) {
  const card = document.querySelector(`[data-sample-id="${sampleId}"]`);
  if (!card) {
    throw new Error(`Sample card not found: ${sampleId}`);
  }
  return card as HTMLElement;
}

describe("ImageToUiToolShell active image selection", () => {
  it("shows the selected sample in the main preview with contain fitting", () => {
    render(<ImageToUiToolShell />);

    fireEvent.click(getSampleCard("minimal-dashboard"));

    const preview = screen.getByTestId("active-image-preview");
    const img = within(preview).getByRole("img", { name: "极简仪表盘" });
    expect(img).toHaveAttribute("src", "/image-to-ui/samples/minimal-dashboard.png");
    expect(img.className).toMatch(/object-contain/);
  });

  it("replaces the active image when a local file is uploaded", () => {
    const createObjectURL = vi.fn(() => "blob:local-preview");
    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL: vi.fn(),
    });

    render(<ImageToUiToolShell />);

    fireEvent.click(getSampleCard("minimal-dashboard"));
    const fileInput = screen.getByLabelText("从本地上传图片");
    const file = new File(["pixels"], "local.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const previewImg = screen.getByRole("img", { name: "本地上传的图片" });
    expect(previewImg).toHaveAttribute("src", "blob:local-preview");
    expect(createObjectURL).toHaveBeenCalledWith(file);
  });

  it("keeps sample thumbnails compact with cover cropping", () => {
    render(<ImageToUiToolShell />);

    const sampleCard = getSampleCard("minimal-dashboard");
    const thumbnail = within(sampleCard).getByRole("presentation");
    expect(thumbnail.className).toMatch(/object-cover/);
  });
});
