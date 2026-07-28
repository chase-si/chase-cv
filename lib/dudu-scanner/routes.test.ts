import { describe, expect, it } from "vitest";

import { isDuduScannerPathname } from "@/lib/dudu-scanner/routes";

describe("dudu scanner route helpers", () => {
  it("recognizes localized scanner pathnames without site navigation", () => {
    expect(isDuduScannerPathname("/dudu-scanner")).toBe(true);
    expect(isDuduScannerPathname("/flow")).toBe(false);
  });
});
