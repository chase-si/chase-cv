import { describe, expect, it } from "vitest";

import { shouldSkipWebGpu } from "./webgpu-policy";

const desktop = {
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
  platform: "MacIntel",
  maxTouchPoints: 0,
};

describe("shouldSkipWebGpu", () => {
  it("keeps WebGPU available on desktop browsers", () => {
    expect(shouldSkipWebGpu(desktop)).toBe(false);
  });

  it("skips WebGPU on iPhone, iPad, and iPadOS desktop user agents", () => {
    expect(
      shouldSkipWebGpu({
        ...desktop,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15",
        platform: "iPhone",
        maxTouchPoints: 5,
      }),
    ).toBe(true);
    expect(
      shouldSkipWebGpu({
        ...desktop,
        maxTouchPoints: 5,
      }),
    ).toBe(true);
  });

  it("skips WebGPU in in-app browsers", () => {
    expect(
      shouldSkipWebGpu({
        ...desktop,
        userAgent: `${desktop.userAgent} MicroMessenger/8.0.0`,
      }),
    ).toBe(true);
    expect(
      shouldSkipWebGpu({
        ...desktop,
        userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36",
        platform: "Linux armv8l",
        maxTouchPoints: 5,
      }),
    ).toBe(true);
  });
});
