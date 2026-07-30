import { describe, expect, it, vi } from "vitest";

import { DUDU_SCANNER_DEFAULT_CONFIG } from "@/lib/dudu-scanner/catalog";
import {
  DUDU_SCANNER_CONFIG_STORAGE_KEY,
  parseStoredDuduScannerConfig,
  readDuduScannerConfig,
  writeDuduScannerConfig,
} from "@/lib/dudu-scanner/config-persistence";

describe("dudu scanner config persistence", () => {
  it("round-trips a valid stored configuration", () => {
    const storage = createMemoryStorage();
    writeDuduScannerConfig(storage, {
      scanMode: "operator",
      themeId: "tummy-creatures",
      targetId: "sleepy-bug",
      soundEnabled: false,
    });

    expect(readDuduScannerConfig(storage)).toEqual({
      scanMode: "operator",
      themeId: "tummy-creatures",
      targetId: "sleepy-bug",
      soundEnabled: false,
    });
  });

  it("falls back to defaults for missing, corrupt, or unknown stored data", () => {
    expect(parseStoredDuduScannerConfig(null)).toEqual(DUDU_SCANNER_DEFAULT_CONFIG);
    expect(parseStoredDuduScannerConfig("not-json")).toEqual(DUDU_SCANNER_DEFAULT_CONFIG);
    expect(
      parseStoredDuduScannerConfig(
        JSON.stringify({ version: 99, themeId: "snack-scan", targetId: "fry-sprite" }),
      ),
    ).toEqual(DUDU_SCANNER_DEFAULT_CONFIG);
    expect(
      parseStoredDuduScannerConfig(
        JSON.stringify({
          version: 1,
          themeId: "snack-scan",
          targetId: "sleepy-bug",
          soundEnabled: true,
        }),
      ),
    ).toEqual(DUDU_SCANNER_DEFAULT_CONFIG);
  });

  it("recovers valid stored preferences after reload", () => {
    const storage = createMemoryStorage();
    writeDuduScannerConfig(storage, {
      scanMode: "mystery",
      themeId: "tummy-creatures",
      targetId: "rice-ball-sprite",
      soundEnabled: false,
    });
    expect(readDuduScannerConfig(storage)).toEqual({
      scanMode: "mystery",
      themeId: "tummy-creatures",
      targetId: "rice-ball-sprite",
      soundEnabled: false,
    });
  });

  it("migrates stored target selections to operator mode", () => {
    expect(
      parseStoredDuduScannerConfig(
        JSON.stringify({
          version: 1,
          themeId: "snack-scan",
          targetId: "candy-critter",
          soundEnabled: true,
        }),
      ),
    ).toMatchObject({
      scanMode: "operator",
      targetId: "candy-critter",
    });
  });

  it("uses a versioned storage key", () => {
    expect(DUDU_SCANNER_CONFIG_STORAGE_KEY).toMatch(/v\d+$/);
  });
});

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => map.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      map.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      map.delete(key);
    }),
  };
}
