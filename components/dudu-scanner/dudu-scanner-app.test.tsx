import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DuduScannerApp } from "@/components/dudu-scanner/dudu-scanner-app";
import { DUDU_SCANNER_CONFIG_STORAGE_KEY } from "@/lib/dudu-scanner/config-persistence";
import enMessages from "@/messages/en.json";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

function renderApp() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <DuduScannerApp />
    </NextIntlClientProvider>,
  );
}

async function startScan() {
  fireEvent.click(screen.getByRole("button", { name: "Start scan" }));
  await screen.findByTestId("dudu-scanner-scan-view");
}

describe("DuduScannerApp controls", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    class OkImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      decode = vi.fn().mockResolvedValue(undefined);

      set src(_value: string) {
        queueMicrotask(() => {
          this.onload?.();
        });
      }
    }
    vi.stubGlobal("Image", OkImage as unknown as typeof Image);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(performance.now()), 0) as unknown as number;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      window.clearTimeout(id);
    });
    HTMLElement.prototype.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => null,
    });
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("pauses and resumes scanning with space", async () => {
    renderApp();
    await startScan();

    fireEvent.keyDown(window, { key: " " });
    expect(screen.getByTestId("dudu-scanner-fan-stage")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: " " });
    expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent("Scanning…");
  });

  it("reveals after pause when pressing 1", async () => {
    renderApp();
    await startScan();

    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "1" });
    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent("Signal detected");
    });
  });

  it("cancels a reveal with X and shows no signal", async () => {
    renderApp();
    await startScan();

    fireEvent.keyDown(window, { key: "1" });
    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-target-preview")).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: "x" });
    expect(screen.getByTestId("dudu-scanner-transient")).toHaveTextContent("No signal to lock");
    expect(screen.queryByTestId("dudu-scanner-target-preview")).not.toBeInTheDocument();
  });

  it("restarts scan with R", async () => {
    renderApp();
    await startScan();

    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "r" });
    expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent("Scanning…");
    expect(screen.queryByTestId("dudu-scanner-target-preview")).not.toBeInTheDocument();
  });

  it("ignores scan shortcuts on config", async () => {
    renderApp();
    fireEvent.keyDown(window, { key: "1" });
    expect(screen.getByRole("heading", { name: "Dudu Scanner" })).toBeInTheDocument();
  });

  it("returns to config on browser back from scan", async () => {
    const pushState = vi.spyOn(window.history, "pushState");
    renderApp();
    await startScan();
    expect(pushState).toHaveBeenCalled();

    window.dispatchEvent(new PopStateEvent("popstate"));
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Dudu Scanner" })).toBeInTheDocument();
    });
  });

  it("restores persisted config after refresh marker cleanup", async () => {
    window.localStorage.setItem(
      DUDU_SCANNER_CONFIG_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        themeId: "tummy-creatures",
        targetId: "rumble-monster",
        soundEnabled: false,
      }),
    );
    window.sessionStorage.setItem("dudu-scanner-immersive-v1", "1");

    renderApp();
    expect(screen.getByRole("button", { name: "Tummy Creatures", pressed: true })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rumble Monster", pressed: true })).toBeInTheDocument();
    expect(window.sessionStorage.getItem("dudu-scanner-immersive-v1")).toBeNull();
  });

  it("keeps the selection and uses the shared silhouette when preload fails", async () => {
    class FailImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        queueMicrotask(() => {
          this.onerror?.();
        });
      }
    }

    vi.stubGlobal("Image", FailImage as unknown as typeof Image);

    renderApp();
    await startScan();
    fireEvent.keyDown(window, { key: "1" });

    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-target-preview")).toBeInTheDocument();
    });

    const preview = screen.getByTestId("dudu-scanner-target-preview").querySelector("img");
    expect(preview).toHaveAttribute("src", "/dudu-scanner/placeholders/fry-sprite.svg");
  });
});
