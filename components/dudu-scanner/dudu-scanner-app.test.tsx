import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DuduScannerApp } from "@/components/dudu-scanner/dudu-scanner-app";
import { DUDU_SCANNER_CONFIG_STORAGE_KEY } from "@/lib/dudu-scanner/config-persistence";
import { TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY } from "@/lib/dudu-scanner/touch-environment";
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

function mockTouchOperatorEnvironment() {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === TOUCH_OPERATOR_CONTROLS_MEDIA_QUERY,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
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
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses space as a director override during initialization", async () => {
    renderApp();
    await startScan();

    fireEvent.keyDown(window, { key: " " });
    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent("Signal detected");
    });
  });

  it("shows instrument initialization before entering manual search", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    try {
      renderApp();
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Start scan" }));
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent(
        "Initializing scanner…",
      );

      await act(async () => {
        await vi.advanceTimersByTimeAsync(4_000);
      });

      expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent(
        "Move the probe to find a signal",
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("cancels a reveal with X and shows no signal", async () => {
    renderApp();
    await startScan();

    fireEvent.keyDown(window, { key: " " });
    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent("Signal detected");
    });

    fireEvent.keyDown(window, { key: "x" });
    expect(screen.getByTestId("dudu-scanner-transient")).toHaveTextContent("No signal to lock");
    expect(screen.getByTestId("dudu-scanner-fan-stage")).toBeInTheDocument();
  });

  it("restarts scan with R", async () => {
    renderApp();
    await startScan();

    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "r" });
    expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent(
      "Initializing scanner…",
    );
  });

  it("ignores scan shortcuts on config", async () => {
    renderApp();
    fireEvent.keyDown(window, { key: " " });
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
    const assignedSources: string[] = [];
    class FailImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(value: string) {
        assignedSources.push(value);
        queueMicrotask(() => {
          this.onerror?.();
        });
      }
    }

    vi.stubGlobal("Image", FailImage as unknown as typeof Image);

    renderApp();
    await startScan();
    fireEvent.keyDown(window, { key: " " });

    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent("Signal detected");
    });
    expect(assignedSources).toContain("/dudu-scanner/placeholders/fry-sprite.svg");
  });

  it("reveals and locks through the touch operator bar", async () => {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => {
      now += 600;
      return now;
    });
    mockTouchOperatorEnvironment();
    renderApp();
    await startScan();

    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-operator-bar")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("dudu-scanner-operator-bar-toggle"));
    fireEvent.click(screen.getByTestId("dudu-scanner-operator-reveal"));
    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-status")).toHaveTextContent("Signal detected");
    });
    fireEvent.click(screen.getByTestId("dudu-scanner-operator-lock"));
    await waitFor(() => {
      expect(screen.getByTestId("dudu-scanner-lock-frame")).toBeInTheDocument();
    });
  });
});
