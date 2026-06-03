import { expect, test } from "@playwright/test";

test.describe("poster maker navigation", () => {
  test("opens the poster maker workbench from the top navigation", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "模板图片" }).click();

    await expect(page).toHaveURL(/\/poster-maker$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Poster Maker" }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Poster maker workbench" }),
    ).toBeVisible();
  });
});

test.describe("poster maker templates", () => {
  test("filters templates, selects one, and keeps previews in sync with content and theme", async ({
    page,
  }) => {
    await page.goto("/poster-maker");

    const templateGallery = page.getByRole("region", {
      name: "Template gallery",
    });
    const mainPreview = page.getByTestId("main-template-preview");
    const firstTemplatePreview = templateGallery
      .getByTestId("template-preview")
      .first();

    await expect(templateGallery.getByRole("button", { name: /Minimalist/ })).toBeVisible();
    await expect(templateGallery.getByRole("button", { name: /Magazine/ })).toBeVisible();
    await expect(templateGallery.getByRole("button", { name: /Retro/ })).toBeVisible();
    await expect(templateGallery.getByRole("button", { name: /Tech/ })).toBeVisible();
    await expect(firstTemplatePreview.getByText("把复杂能力讲清楚")).toBeVisible();
    await expect(
      page.locator('link[data-poster-template="minimalist"]'),
    ).toHaveAttribute("href", /\/poster-templates\/minimalist.css$/);

    await page.getByRole("button", { exact: true, name: "Editorial" }).click();

    await expect(templateGallery.getByRole("button", { name: /Magazine/ })).toBeVisible();
    await expect(templateGallery.getByRole("button", { name: /Minimalist/ })).toBeHidden();
    await expect(templateGallery.getByRole("button", { name: /Retro/ })).toBeHidden();

    await templateGallery.getByRole("button", { name: /Magazine/ }).click();

    await expect(mainPreview).toContainText("Magazine");
    await expect(mainPreview.getByText("把复杂能力讲清楚")).toBeVisible();
    await expect(page.getByText("模板Magazine")).toBeVisible();

    const lightBackground = await firstTemplatePreview.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );

    await page.getByRole("button", { name: "切换为深色" }).click();
    await expect(page.getByRole("button", { name: "切换为浅色" })).toBeVisible();

    const darkBackground = await firstTemplatePreview.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    expect(darkBackground).not.toBe(lightBackground);
  });
});
