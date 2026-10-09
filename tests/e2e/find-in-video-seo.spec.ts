import { expect, test } from "@playwright/test";

test.describe("find in video SEO landing", () => {
  test("English page exposes WebApplication JSON-LD and the research notice", async ({ page }) => {
    await page.goto("/find-in-video");

    await expect(page.getByRole("heading", { level: 1, name: "Find in Video" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Load recognition model" })).toBeVisible();
    await expect(page.getByText(/non-commercial research/i)).toBeVisible();

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const schema = JSON.parse((await jsonLd.textContent()) ?? "{}");
    expect(schema["@type"]).toBe("WebApplication");

    await expect(page.getByTestId("find-in-video-landing-content")).toBeHidden();
    await expect(page.getByTestId("find-in-video-faq")).toContainText(/Are the photos or video uploaded/i);
  });

  test("Chinese page renders localized landing copy", async ({ page }) => {
    await page.goto("/zh/find-in-video");

    await expect(page.getByRole("heading", { level: 1, name: "视频人物查找" })).toBeVisible();
    await expect(page.getByTestId("find-in-video-landing-content")).toContainText(/照片或视频会上传吗/);
  });
});
