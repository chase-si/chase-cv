import { expect, test } from "@playwright/test";

test.describe("dudu scanner metadata", () => {
  test("English page exposes WebApplication JSON-LD without a long-form landing section", async ({ page }) => {
    await page.goto("/dudu-scanner");

    await expect(page.getByRole("heading", { level: 1, name: "Tummy Scanner" })).toBeVisible();

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const schema = JSON.parse((await jsonLd.textContent()) ?? "{}");
    expect(schema["@type"]).toBe("SoftwareApplication");
    expect(schema.name).toBe("Tummy Scanner");
    expect(schema.alternateName).toEqual(["Dudu Scanner", "肚肚扫描仪"]);

    await expect(page.getByTestId("dudu-scanner-landing-content")).toHaveCount(0);
  });
});
