import { expect, test } from "@playwright/test";

test.describe("dudu scanner SEO landing", () => {
  test("English page exposes WebApplication JSON-LD and playful FAQ", async ({ page }) => {
    await page.goto("/dudu-scanner");

    await expect(page.getByRole("heading", { level: 1, name: "Dudu Scanner" })).toBeVisible();

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const schema = JSON.parse((await jsonLd.textContent()) ?? "{}");
    expect(schema["@type"]).toBe("WebApplication");

    await expect(page.getByTestId("dudu-scanner-landing-content")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-faq")).toContainText(/silly browser toy/i);
  });

  test("Chinese page renders localized landing copy", async ({ page }) => {
    await page.goto("/zh/dudu-scanner");

    await expect(page.getByRole("heading", { level: 1, name: "肚肚扫描仪" })).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-landing-content")).toContainText(/仅供娱乐/);
  });
});
