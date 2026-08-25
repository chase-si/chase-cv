import { describe, expect, it, vi } from "vitest";

import {
  applyScanModeToUrl,
  readScanModeFromSearch,
  syncScanModeQueryParam,
} from "@/lib/dudu-scanner/mode-query";

describe("dudu scanner mode query", () => {
  it("reads operator, mystery, and custom from a readable mode param", () => {
    expect(readScanModeFromSearch("?mode=operator")).toBe("operator");
    expect(readScanModeFromSearch("mode=mystery")).toBe("mystery");
    expect(readScanModeFromSearch("?mode=custom&foo=1")).toBe("custom");
  });

  it("ignores missing or unknown mode values", () => {
    expect(readScanModeFromSearch("")).toBeNull();
    expect(readScanModeFromSearch("?mode=photo")).toBeNull();
  });

  it("writes a readable mode query without dropping sibling params", () => {
    expect(applyScanModeToUrl("/en/dudu-scanner?foo=1", "mystery")).toBe(
      "/en/dudu-scanner?foo=1&mode=mystery",
    );
    expect(applyScanModeToUrl("/en/dudu-scanner?mode=operator", "custom")).toBe(
      "/en/dudu-scanner?mode=custom",
    );
  });

  it("replace-syncs the address bar when the mode differs", () => {
    const replaceState = vi.fn();
    syncScanModeQueryParam(
      { replaceState, state: { keep: true } },
      {
        href: "https://example.test/en/dudu-scanner",
        pathname: "/en/dudu-scanner",
        search: "",
        hash: "",
      },
      "mystery",
    );
    expect(replaceState).toHaveBeenCalledWith(
      { keep: true },
      "",
      "https://example.test/en/dudu-scanner?mode=mystery",
    );
  });
});
