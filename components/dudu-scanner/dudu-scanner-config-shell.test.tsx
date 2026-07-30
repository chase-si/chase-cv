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
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("renders English defaults in mystery mode with sound enabled", () => {
    renderShell("en");

    expect(screen.getByRole("heading", { name: "Dudu Scanner" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mystery scan", pressed: true }),
    ).toBeInTheDocument();
    const operatorMode = screen.getByRole("button", { name: "Operator mode" });
    const mysteryMode = screen.getByRole("button", { name: "Mystery scan" });
    expect(
      screen.getAllByRole("button").indexOf(operatorMode),
    ).toBeLessThan(screen.getAllByRole("button").indexOf(mysteryMode));
    expect(screen.getByRole("button", { name: "Snack Scan", pressed: true })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Fry Sprite" })).not.toBeInTheDocument();
    expect(screen.getByTestId("dudu-scanner-mystery-summary")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Sound effects" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByText("For entertainment only — not a medical device.")).toBeInTheDocument();
  });

  it("renders localized Chinese copy", () => {
    renderShell("zh");

    expect(screen.getByRole("heading", { name: "肚肚扫描仪" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "神秘扫描", pressed: true }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "零食扫描", pressed: true })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "薯条精灵" })).not.toBeInTheDocument();
    expect(screen.getByText("仅供娱乐，非医疗工具。")).toBeInTheDocument();
  });

  it("falls back to defaults when stored preferences are corrupt", () => {
    window.localStorage.setItem(DUDU_SCANNER_CONFIG_STORAGE_KEY, "{broken");
    renderShell("en");
    expect(
      screen.getByRole("button", { name: "Mystery scan", pressed: true }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Snack Scan", pressed: true })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Fry Sprite" })).not.toBeInTheDocument();
  });

  it("shows only three targets for the active theme and keeps a valid selection", () => {
    renderShell("en");

    fireEvent.click(screen.getByRole("button", { name: "Operator mode" }));
    fireEvent.click(screen.getByRole("button", { name: "Tummy Creatures" }));

    const tummyTargets = ["Sleepy Bug", "Rumble Monster", "Rice Ball Sprite"];
    for (const name of tummyTargets) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
    expect(screen.queryByRole("button", { name: "Fry Sprite" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sleepy Bug", pressed: true })).toBeInTheDocument();
  });

  it("persists sound, theme, and target across reloads", () => {
    const { unmount } = renderShell("en");

    fireEvent.click(screen.getByRole("button", { name: "Operator mode" }));
    fireEvent.click(screen.getByRole("button", { name: "Tummy Creatures" }));
    fireEvent.click(screen.getByRole("button", { name: "Rumble Monster" }));
    fireEvent.click(screen.getByRole("switch", { name: "Sound effects" }));

    const stored = window.localStorage.getItem(DUDU_SCANNER_CONFIG_STORAGE_KEY);
    expect(stored).toContain("rumble-monster");
    expect(stored).toContain('"scanMode":"operator"');
    expect(stored).toContain('"soundEnabled":false');

    unmount();
    renderShell("en");

    expect(screen.getByRole("button", { name: "Tummy Creatures", pressed: true })).toBeInTheDocument();
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
});
