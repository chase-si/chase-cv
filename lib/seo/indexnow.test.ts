import { describe, expect, it, vi } from "vitest";

import { buildSitemapEntries } from "./sitemap-entries";
import { siteUrl } from "./urls";
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KEY_PATH,
  buildIndexNowPayload,
  createIndexNowKeyResponse,
  submitIndexNow,
} from "./indexnow";

describe("IndexNow payload", () => {
  it("uses a public hex key and well-known key location", () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
    expect(INDEXNOW_KEY_PATH).toBe("/.well-known/indexnow.txt");
    expect(INDEXNOW_ENDPOINT).toBe("https://api.indexnow.org/indexnow");
  });

  it("submits every sitemap URL for the production host", () => {
    const payload = buildIndexNowPayload();
    const sitemapUrls = buildSitemapEntries().map((entry) => entry.url);

    expect(payload.host).toBe(siteUrl.hostname);
    expect(payload.key).toBe(INDEXNOW_KEY);
    expect(payload.keyLocation).toBe(new URL(INDEXNOW_KEY_PATH, siteUrl).toString());
    expect(payload.urlList).toEqual(sitemapUrls);
    expect(payload.urlList.length).toBeGreaterThan(0);
  });

  it("serves the key as plain text for Bing keyLocation checks", async () => {
    const response = createIndexNowKeyResponse();

    expect(response.headers.get("content-type")).toMatch(/text\/plain/);
    await expect(response.text()).resolves.toBe(INDEXNOW_KEY);
  });

  it("POSTs the sitemap payload to the IndexNow endpoint", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }));

    const response = await submitIndexNow(fetchImpl);

    expect(response.status).toBe(200);
    expect(fetchImpl).toHaveBeenCalledWith(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(buildIndexNowPayload()),
    });
  });
});
