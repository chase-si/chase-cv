import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { MagicCursorEffectGalleryPage } from "@/components/magic-cursor/effect-gallery-page";
import enMessages from "@/messages/en.json";

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/magic-cursor/demo-tile", () => ({
  MagicCursorDemoTile: ({ effect }: { effect: string }) => <div>{effect}</div>,
}));

describe("MagicCursorEffectGalleryPage", () => {
  it("uses the shared tool page chrome", () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <MagicCursorEffectGalleryPage heading="Magic Cursor" description="Try effects" />
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId("tool-page-chrome")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Magic Cursor" })).toBeInTheDocument();
  });
});
