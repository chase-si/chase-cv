import { afterEach, describe, expect, it, vi } from "vitest";

import { buildSearchEngineVerification } from "./search-engine-verification";

describe("buildSearchEngineVerification", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("omits verification tags when no webmaster tokens are configured", () => {
    vi.stubEnv("NEXT_PUBLIC_BING_SITE_VERIFICATION", "");

    expect(buildSearchEngineVerification()).toBeUndefined();
  });

  it("emits Bing Webmaster msvalidate.01 when the token is set", () => {
    vi.stubEnv("NEXT_PUBLIC_BING_SITE_VERIFICATION", "  ABC123TOKEN  ");

    expect(buildSearchEngineVerification()).toEqual({
      other: {
        "msvalidate.01": "ABC123TOKEN",
      },
    });
  });
});
