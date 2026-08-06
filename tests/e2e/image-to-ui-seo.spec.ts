import { expect, test } from "@playwright/test";

test.describe("image-to-ui SEO landing", () => {
  test("English page exposes metadata keywords, JSON-LD, and indexable FAQ", async ({
    page,
  }) => {
    await page.goto("/image-to-ui");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Image Color Palette Extractor.*Theme Preview/i,
    );

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const schema = JSON.parse((await jsonLd.textContent()) ?? "{}");
    expect(schema["@type"]).toBe("WebApplication");
    expect(schema).not.toHaveProperty("aggregateRating");

    await expect(page.getByTestId("image-to-ui-landing-content")).toBeVisible();
    await expect(page.getByTestId("image-to-ui-faq")).toContainText(
      /does not generate installable theme files/i,
    );
  });

  test("Chinese page renders localized landing copy", async ({ page }) => {
    await page.goto("/zh/image-to-ui");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(/从图片提取界面配色/);
    await expect(page.getByTestId("image-to-ui-landing-content")).toContainText(
      /目前还不支持/,
    );
  });
});
