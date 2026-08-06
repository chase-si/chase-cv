import { expect, test } from "@playwright/test";

test.describe("magic cursor SEO landing", () => {
  test("English hub exposes WebApplication JSON-LD and effect catalog", async ({ page }) => {
    await page.goto("/magic-cursor");

    await expect(
      page.getByRole("heading", { level: 1, name: "Magic Cursor effect library" }),
    ).toBeVisible();

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScripts).toHaveCount(1);
    const schema = JSON.parse((await jsonLdScripts.first().textContent()) ?? "{}");
    expect(schema["@type"]).toBe("WebApplication");

    await expect(page.getByTestId("magic-cursor-landing-content")).toBeVisible();
    await expect(page.getByTestId("magic-cursor-effect-catalog")).toContainText(/Ring cursor effect/i);
  });

  test("Chinese ring effect page renders localized copy and breadcrumb JSON-LD", async ({ page }) => {
    await page.goto("/zh/magic-cursor/ring");

    await expect(page.getByRole("heading", { level: 1, name: "环形光标效果" })).toBeVisible();
    await expect(page.getByTestId("magic-cursor-effect-landing-content")).toContainText(/适用场景/);

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScripts).toHaveCount(2);
    const schemas = await jsonLdScripts.evaluateAll((nodes) =>
      nodes.map((node) => JSON.parse(node.textContent ?? "{}")),
    );
    expect(schemas.some((schema) => schema["@type"] === "BreadcrumbList")).toBe(true);
    expect(schemas.some((schema) => schema["@type"] === "WebApplication")).toBe(true);
  });
});
