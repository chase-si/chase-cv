import { expect, test } from "@playwright/test";

import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_PATH,
} from "@/lib/seo/indexnow";

test.describe("Bing crawler surfaces", () => {
  test("serves the IndexNow key file", async ({ request }) => {
    const response = await request.get(INDEXNOW_KEY_PATH);

    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toMatch(/text\/plain/);
    expect((await response.text()).trim()).toBe(INDEXNOW_KEY);
  });

  test("allows Bingbot and lists the sitemap in robots.txt", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();

    expect(response.ok()).toBe(true);
    expect(body).toMatch(/User-agent: bingbot/i);
    expect(body).toMatch(/Allow: \//);
    expect(body).toMatch(/Sitemap: https:\/\/dashuaibi\.vip\/sitemap\.xml/);
  });
});
