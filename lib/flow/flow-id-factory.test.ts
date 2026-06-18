import { describe, expect, it } from "vitest";

import { defaultFlowIdFactory } from "@/lib/flow/flow-id-factory";

describe("defaultFlowIdFactory", () => {
  it("returns distinct UUID strings", () => {
    const a = defaultFlowIdFactory();
    const b = defaultFlowIdFactory();

    expect(a).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(b).not.toBe(a);
  });
});
