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
  test("renders page labels and footer, blocks empty-title export, and warns on overflow risk", async ({
    page,
  }) => {
    await page.goto("/poster-maker");

    const mainPreview = page.getByLabel("Current poster page preview");

    await page.getByRole("button", { name: "Add page" }).click();
    await page.getByLabel("Page title").fill("Second Page");
    await page.getByLabel("Page description").fill("Second page notes");

    await page.getByLabel("Show page labels").check();
    await page.getByLabel("Global footer").fill("chase-cv export proof");

    await expect(mainPreview.getByText("02 / 02")).toBeVisible();
    await expect(mainPreview.getByText("chase-cv export proof")).toBeVisible();

    await page.getByRole("button", { name: /把复杂能力讲清楚/ }).click();
    await expect(mainPreview.getByText("01 / 02")).toBeVisible();

    await page.getByLabel("Page title").fill("");
    await page.getByRole("button", { name: "Export poster pages" }).click();

    await expect(page.getByLabel("Page title")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(
      page.getByText("Add a title before exporting every poster page."),
    ).toBeVisible();

    await page.getByLabel("Page title").fill("Long Content");
    await page
      .getByLabel("Page description")
      .fill(`${"Overflow warning line\n".repeat(18)}Final line`);

    await expect(page.getByRole("status", { name: "Poster warnings" })).toContainText(
      "may overflow",
    );

    await page.getByRole("button", { name: "Export poster pages" }).click();
    await expect(page.getByRole("status", { name: "Export status" })).toContainText(
      "Export ready",
    );
  });

  test("imports Markdown pages by replacing and appending parsed headings", async ({
    page,
  }) => {
    await page.goto("/poster-maker");

    const pageList = page.getByRole("list", { name: "Poster pages" });
    const mainPreview = page.getByLabel("Current poster page preview");
    const markdownInput = page.getByLabel("Markdown import");
    const importStatus = page.getByRole("status", {
      name: "Import feedback",
    });

    await markdownInput.fill("Intro without a heading");
    await page.getByRole("button", { name: "Replace pages" }).click();
    await expect(importStatus).toContainText(
      "Add at least one Markdown heading",
    );
    await expect(page.getByLabel("Page title")).toHaveValue(
      "把复杂能力讲清楚",
    );

    await markdownInput.fill(`# Launch Plan
First line
Second line

## Metrics Snapshot
Revenue up 18%`);
    await page.getByRole("button", { name: "Replace pages" }).click();

    await expect(importStatus).toContainText("Imported 2 pages");
    await expect(page.getByLabel("Page title")).toHaveValue("Launch Plan");
    await expect(mainPreview.getByText("Launch Plan")).toBeVisible();
    await expect(mainPreview.getByText("First line")).toBeVisible();
    await expect(mainPreview.getByText("Second line")).toBeVisible();
    await expect(pageList.getByRole("listitem").first()).toContainText(
      "Launch Plan",
    );
    await expect(pageList.getByRole("listitem").nth(1)).toContainText(
      "Metrics Snapshot",
    );
    await expect(
      pageList.getByRole("button", { name: /把复杂能力讲清楚/ }),
    ).toBeHidden();

    await markdownInput.fill(`# Risks
Line A
Line B`);
    await page.getByRole("button", { name: "Append pages" }).click();

    await expect(importStatus).toContainText("Appended 1 page");
    await expect(pageList.getByRole("listitem").nth(0)).toContainText(
      "Launch Plan",
    );
    await expect(pageList.getByRole("listitem").nth(1)).toContainText(
      "Metrics Snapshot",
    );
    await expect(pageList.getByRole("listitem").nth(2)).toContainText("Risks");

    await page.getByRole("button", { name: /Risks/ }).click();
    await expect(page.getByLabel("Page description")).toHaveValue(
      "Line A\nLine B",
    );
    await expect(mainPreview.getByText("Line A")).toBeVisible();
    await expect(mainPreview.getByText("Line B")).toBeVisible();
  });

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
