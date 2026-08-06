import { expect, test } from "@playwright/test";

test.describe("flow SEO landing", () => {
  test("English page exposes WebApplication JSON-LD and FAQ", async ({ page }) => {
    await page.goto("/flow");

    await expect(page.getByRole("heading", { level: 1, name: "Flow Editor" })).toBeVisible();

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const schema = JSON.parse((await jsonLd.textContent()) ?? "{}");
    expect(schema["@type"]).toBe("WebApplication");

    await expect(page.getByTestId("flow-landing-content")).toBeVisible();
    await expect(page.getByTestId("flow-faq")).toContainText(/import my own production flow/i);
  });

  test("Chinese page renders localized landing copy", async ({ page }) => {
    await page.goto("/zh/flow");

    await expect(page.getByRole("heading", { level: 1, name: "流程编辑器" })).toBeVisible();
    await expect(page.getByTestId("flow-landing-content")).toContainText(/示例流程/);
  });
});
