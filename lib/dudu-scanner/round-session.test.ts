import { describe, expect, it, vi } from "vitest";

import {
  clearImmersiveHistoryEntry,
  clearImmersiveSessionMarker,
  DUDU_SCANNER_IMMERSIVE_SESSION_KEY,
  isImmersiveRoundPhase,
  pushImmersiveHistoryEntry,
  shouldHandleScannerPopState,
  syncImmersiveSessionMarker,
} from "@/lib/dudu-scanner/round-session";

describe("round-session", () => {
  it("identifies immersive phases", () => {
    expect(isImmersiveRoundPhase("scan")).toBe(true);
    expect(isImmersiveRoundPhase("result")).toBe(true);
    expect(isImmersiveRoundPhase("config")).toBe(false);
  });

  it("pushes a history entry for immersive rounds", () => {
    const pushState = vi.fn();
    pushImmersiveHistoryEntry({ pushState }, "https://example.test/scanner");
    expect(pushState).toHaveBeenCalledWith({ duduScannerImmersive: true }, "", "https://example.test/scanner");
  });

  it("handles popstate only while immersive", () => {
    expect(shouldHandleScannerPopState("scan")).toBe(true);
    expect(shouldHandleScannerPopState("config")).toBe(false);
  });

  it("syncs session marker with phase", () => {
    const storage = {
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    syncImmersiveSessionMarker(storage, "scan");
    expect(storage.setItem).toHaveBeenCalledWith(DUDU_SCANNER_IMMERSIVE_SESSION_KEY, "1");

    syncImmersiveSessionMarker(storage, "config");
    expect(storage.removeItem).toHaveBeenCalledWith(DUDU_SCANNER_IMMERSIVE_SESSION_KEY);
  });

  it("clears immersive session marker", () => {
    const removeItem = vi.fn();
    clearImmersiveSessionMarker({ removeItem });
    expect(removeItem).toHaveBeenCalledWith(DUDU_SCANNER_IMMERSIVE_SESSION_KEY);
  });

  it("replaces immersive history entry when leaving without back", () => {
    const replaceState = vi.fn();
    clearImmersiveHistoryEntry(
      {
        state: { duduScannerImmersive: true },
        replaceState,
      },
      "https://example.test/scanner",
    );
    expect(replaceState).toHaveBeenCalledWith(null, "", "https://example.test/scanner");
  });
});
