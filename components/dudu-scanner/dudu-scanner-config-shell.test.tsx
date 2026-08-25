import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DuduScannerConfigShell } from "@/components/dudu-scanner/dudu-scanner-config-shell";
import { DUDU_SCANNER_CONFIG_STORAGE_KEY } from "@/lib/dudu-scanner/config-persistence";
import { DuduScannerConfigProvider } from "@/lib/dudu-scanner/dudu-scanner-config-provider";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

function renderShell(locale: "en" | "zh") {
  const messages = locale === "zh" ? zhMessages : enMessages;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DuduScannerConfigProvider>
        <DuduScannerConfigShell />
      </DuduScannerConfigProvider>
    </NextIntlClientProvider>,
  );
}

describe("DuduScannerConfigShell", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("renders English defaults in operator mode with sound enabled", () => {
    renderShell("en");

    expect(
      screen.getByRole("heading", { name: "Dudu Scanner" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tool-page-chrome")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Operator mode", pressed: true }),
    ).toBeInTheDocument();
    const operatorMode = screen.getByRole("button", { name: "Operator mode" });
    const mysteryMode = screen.getByRole("button", { name: "Mystery scan" });
    const customMode = screen.getByRole("button", { name: "Custom scan" });
    expect(
      screen.getAllByRole("button").indexOf(operatorMode),
    ).toBeLessThan(screen.getAllByRole("button").indexOf(mysteryMode));
    expect(
      screen.getAllByRole("button").indexOf(mysteryMode),
    ).toBeLessThan(screen.getAllByRole("button").indexOf(customMode));
    expect(screen.queryByRole("button", { name: "Snack Scan" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Tummy Creatures" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fry Sprite" })).toBeInTheDocument();
    expect(screen.queryByTestId("dudu-scanner-mystery-summary")).not.toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Sound effects" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByTestId("dudu-scanner-how-to-play")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Move the mouse-controlled probe/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Person's belly")).toBeInTheDocument();
    expect(screen.getByText("Scan here")).toBeInTheDocument();
    expect(screen.getByText("For entertainment only — not a medical device.")).toBeInTheDocument();
  });

  it("renders localized Chinese copy", () => {
    renderShell("zh");

    expect(screen.getByRole("heading", { name: "肚肚扫描仪" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "操作者模式", pressed: true }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "零食扫描" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "肚肚生物" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "薯条精灵" })).toBeInTheDocument();
    expect(screen.getByText("玩法演示")).toBeInTheDocument();
    expect(screen.getByText("人的肚子")).toBeInTheDocument();
    expect(screen.getByText("扫描这里")).toBeInTheDocument();
    expect(screen.getByText("贴住肚子")).toBeInTheDocument();
    expect(screen.getByText("仅供娱乐，非医疗工具。")).toBeInTheDocument();
  });

  it("falls back to defaults when stored preferences are corrupt", () => {
    window.localStorage.setItem(DUDU_SCANNER_CONFIG_STORAGE_KEY, "{broken");
    renderShell("en");
    expect(
      screen.getByRole("button", { name: "Operator mode", pressed: true }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Snack Scan" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fry Sprite" })).toBeInTheDocument();
  });

  it("shows all targets together and keeps the selected target", () => {
    renderShell("en");

    fireEvent.click(screen.getByRole("button", { name: "Operator mode" }));
    const targets = [
      "Fry Sprite",
      "Candy Critter",
      "Boba Bubbles",
      "Sleepy Bug",
      "Rumble Monster",
      "Rice Ball Sprite",
      "Eye Guard",
      "Motion Energy Ball",
      "Toothbrush Knight",
      "Breakfast Wake-up Bird",
    ];
    for (const name of targets) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole("button", { name: "Sleepy Bug" }));
    expect(screen.getByRole("button", { name: "Sleepy Bug", pressed: true })).toBeInTheDocument();
  });

  it("persists sound, theme, and target across reloads", () => {
    const { unmount } = renderShell("en");

    fireEvent.click(screen.getByRole("button", { name: "Operator mode" }));
    fireEvent.click(screen.getByRole("button", { name: "Rumble Monster" }));
    fireEvent.click(screen.getByRole("switch", { name: "Sound effects" }));

    const stored = window.localStorage.getItem(DUDU_SCANNER_CONFIG_STORAGE_KEY);
    expect(stored).toContain("rumble-monster");
    expect(stored).toContain('"scanMode":"operator"');
    expect(stored).toContain('"soundEnabled":false');

    unmount();
    renderShell("en");

    expect(screen.queryByRole("button", { name: "Tummy Creatures" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Operator mode", pressed: true }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rumble Monster", pressed: true })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Sound effects" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("lists localized shortcut guidance", () => {
    renderShell("en");
    expect(screen.getByText("Operator shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Force target discovery")).toBeInTheDocument();
  });

  it("keeps sound controls inside the operator shortcuts card", () => {
    renderShell("en");
    const shortcutsHeading = screen.getByText("Operator shortcuts");
    const shortcutsCard = shortcutsHeading.closest("[data-slot='card']");
    expect(shortcutsCard).toBeTruthy();
    expect(shortcutsCard).toContainElement(screen.getByRole("switch", { name: "Sound effects" }));
    expect(shortcutsCard).toContainElement(screen.getByText("Force target discovery"));
  });

  it("blocks start in custom mode until a picture is uploaded", () => {
    renderShell("en");
    fireEvent.click(screen.getByRole("button", { name: "Custom scan" }));
    expect(screen.getByRole("button", { name: "Start scan" })).toBeDisabled();
    expect(screen.getByTestId("dudu-scanner-start-blocked")).toHaveTextContent(
      "Upload a picture before starting this scan.",
    );
    expect(screen.getByTestId("dudu-scanner-custom-library")).toBeInTheDocument();
  });
});
