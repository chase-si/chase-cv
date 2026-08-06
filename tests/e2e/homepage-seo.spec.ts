import { expect, test } from "@playwright/test";

test.describe("homepage SEO", () => {
  test("English home exposes ProfilePage JSON-LD and tool context links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("homepage-seo-content")).toBeVisible();
    await expect(page.getByText("Product frontend", { exact: true })).toBeVisible();

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const schema = JSON.parse((await jsonLd.textContent()) ?? "{}");
    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema.mainEntity["@type"]).toBe("Person");
    expect(schema.mainEntity.name).toBe("Chase");
    expect(schema.mainEntity).not.toHaveProperty("image");
  });

  test("Chinese home renders localized SEO tool grid", async ({ page }) => {
    await page.goto("/zh");

    await expect(page.getByTestId("homepage-seo-content")).toContainText(/游乐场工具/);
    await expect(page.getByText("产品化前端", { exact: true })).toBeVisible();
  });
});
