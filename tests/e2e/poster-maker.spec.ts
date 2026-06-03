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

test.describe("poster maker page editor", () => {
  test("edits pages, follows the selected page, persists drafts, clears with confirmation, and resets examples", async ({
    page,
  }) => {
    await page.goto("/poster-maker");

    await page.getByLabel("Page title").fill("Launch Plan");
    await page
      .getByLabel("Page description")
      .fill("First line\nSecond line");

    const mainPreview = page.getByLabel("Current poster page preview");
    await expect(mainPreview.getByText("Launch Plan")).toBeVisible();
    await expect(mainPreview.getByText("First line")).toBeVisible();
    await expect(mainPreview.getByText("Second line")).toBeVisible();

    await page.getByRole("button", { name: "Add page" }).click();
    await page.getByLabel("Page title").fill("Metrics Snapshot");
    await page.getByLabel("Page description").fill("Revenue up 18%");
    await expect(mainPreview.getByText("Metrics Snapshot")).toBeVisible();

    await page.getByRole("button", { name: /Launch Plan/ }).click();
    await expect(page.getByLabel("Page title")).toHaveValue("Launch Plan");
    await expect(mainPreview.getByText("Launch Plan")).toBeVisible();

    await page.getByRole("button", { name: "Move page down" }).click();
    const pageList = page.getByRole("list", { name: "Poster pages" });
    await expect(pageList.getByRole("listitem").first()).toContainText(
      "Metrics Snapshot",
    );

    await page.getByRole("button", { name: /Metrics Snapshot/ }).click();
    await page.getByRole("button", { name: "Delete page" }).click();
    await expect(pageList.getByRole("button", { name: /Metrics Snapshot/ })).toBeHidden();
    await expect(mainPreview.getByText("Launch Plan")).toBeVisible();

    await page.getByRole("button", { name: /Magazine/ }).click();
    await expect(page.getByText("模板Magazine")).toBeVisible();

    await page.reload();
    await expect(page.getByLabel("Page title")).toHaveValue("Launch Plan");
    await expect(mainPreview.getByText("Launch Plan")).toBeVisible();
    await expect(page.getByText("模板Magazine")).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Clear all poster content");
      await dialog.dismiss();
    });
    await page.getByRole("button", { name: "Clear all content" }).click();
    await expect(page.getByLabel("Page title")).toHaveValue("Launch Plan");

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Clear all poster content");
      await dialog.accept();
    });
    await page.getByRole("button", { name: "Clear all content" }).click();
    await expect(page.getByLabel("Page title")).toHaveValue("");
    await expect(mainPreview.getByText("Untitled page")).toBeVisible();

    await page.getByRole("button", { name: "Reset to example content" }).click();
    await expect(page.getByLabel("Page title")).toHaveValue("把复杂能力讲清楚");
    await expect(mainPreview.getByText("把复杂能力讲清楚")).toBeVisible();
  });
});
