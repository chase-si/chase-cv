import { expect, test } from "@playwright/test";
import { readFile, readdir } from "node:fs/promises";

import { ensureDownloadsDir } from "./fixtures/downloads";

test.describe("poster maker navigation", () => {
  test("opens template selection from the top navigation", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "模板图片" }).click();

    await expect(page).toHaveURL(/\/poster-maker$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Poster Maker" }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Template selection" }),
    ).toBeVisible();
  });
});

test.describe("poster maker templates", () => {
  test("selects templates in place and opens the editor for the selected style", async ({
    page,
  }) => {
    await page.goto("/poster-maker");

    const selection = page.getByRole("region", { name: "Template selection" });
    const mainPreview = page.getByLabel("Selected template preview");

    await expect(selection.getByRole("button", { name: /Minimalist/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(selection.getByRole("button", { name: /Magazine/ })).toBeVisible();
    await expect(selection.getByRole("button", { name: /Retro/ })).toBeVisible();
    await expect(selection.getByRole("button", { name: /Tech/ })).toBeVisible();
    await expect(mainPreview).toContainText("Minimalist");
    await expect(mainPreview).toContainText("把复杂能力讲清楚");
    await expect(
      page.locator('link[data-poster-template="minimalist"]'),
    ).toHaveAttribute("href", /\/poster-templates\/generated\/minimalist.css$/);
    await expect(
      page.locator('link[data-poster-template="base"]'),
    ).toHaveAttribute("href", /\/poster-templates\/generated\/base.css$/);

    await selection.getByRole("button", { name: /Magazine/ }).click();

    await expect(selection.getByRole("button", { name: /Magazine/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(mainPreview).toContainText("Magazine");
    await expect(page).toHaveURL(/\/poster-maker$/);

    await page.getByRole("button", { name: "Use this template" }).click();

    await expect(page).toHaveURL(/\/poster-maker\/magazine$/);
    await expect(
      page.getByRole("region", { name: "Poster maker workbench" }),
    ).toBeVisible();
    await expect(page.getByText("模板Magazine")).toBeVisible();
  });

  test("preselects the last edited template when returning from the editor", async ({
    page,
  }) => {
    await page.goto("/poster-maker/tech");

    await expect(page.getByText("模板Tech")).toBeVisible();

    await page.goto("/poster-maker");

    const selection = page.getByRole("region", { name: "Template selection" });
    await expect(selection.getByRole("button", { name: /Tech/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByLabel("Selected template preview")).toContainText("Tech");
  });
});

test.describe("poster maker page editor", () => {
  test("completes the full poster maker journey and downloads fallback PNGs", async ({
    page,
  }) => {
    const downloadsDir = await ensureDownloadsDir();
    const downloadEvents: string[] = [];

    await page.addInitScript(() => {
      Object.defineProperty(window, "showDirectoryPicker", {
        configurable: true,
        value: undefined,
      });
    });
    page.on("download", async (download) => {
      const suggestedFilename = download.suggestedFilename();
      await download.saveAs(`${downloadsDir}/${suggestedFilename}`);
      downloadEvents.push(suggestedFilename);
    });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await page.getByRole("button", { name: "模板图片" }).click();

    await expect(page).toHaveURL(/\/poster-maker$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Poster Maker" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Use this template" }).click();
    await expect(page).toHaveURL(/\/poster-maker\/minimalist$/);

    const templateGallery = page.getByRole("region", {
      name: "Template gallery",
    });
    const pageList = page.getByRole("list", { name: "Poster pages" });
    const mainPreview = page.getByLabel("Current poster page preview");
    const markdownInput = page.getByLabel("Markdown import");

    await page.getByRole("button", { exact: true, name: "Editorial" }).click();
    await templateGallery.getByRole("button", { name: /Magazine/ }).click();
    await expect(mainPreview).toContainText("Magazine");

    await markdownInput.fill(`# Launch Plan
First line
Second line

## Metrics Snapshot
Revenue up 18%`);
    await page.getByRole("button", { name: "Replace pages" }).click();

    await expect(pageList.getByRole("listitem").first()).toContainText(
      "Launch Plan",
    );
    await expect(pageList.getByRole("listitem").nth(1)).toContainText(
      "Metrics Snapshot",
    );

    await markdownInput.fill(`# Risks
Line A
Line B`);
    await page.getByRole("button", { name: "Append pages" }).click();

    await expect(pageList.getByRole("listitem").nth(2)).toContainText("Risks");

    await page.getByRole("button", { name: /Risks/ }).click();
    await page.getByRole("button", { name: "Move page up" }).click();
    await expect(pageList.getByRole("listitem").nth(1)).toContainText("Risks");
    await expect(pageList.getByRole("listitem").nth(2)).toContainText(
      "Metrics Snapshot",
    );
    await expect(mainPreview.getByText("Risks")).toBeVisible();
    await expect(mainPreview.getByText("Line A")).toBeVisible();

    await page.getByLabel("Show page labels").check();
    await page.getByLabel("Global footer").fill("chase-cv journey proof");

    await expect(mainPreview.getByText("02 / 03")).toBeVisible();
    await expect(mainPreview.getByText("chase-cv journey proof")).toBeVisible();

    await page.getByRole("button", { name: "Export poster pages" }).click();

    await expect
      .poll(() => downloadEvents.length, { message: "fallback PNG downloads" })
      .toBe(3);
    await expect(page.getByRole("status", { name: "Export status" })).toContainText(
      "Downloaded 3 PNG files",
    );
    expect(downloadEvents.toSorted()).toEqual([
      "poster-01-launch-plan.png",
      "poster-02-risks.png",
      "poster-03-metrics-snapshot.png",
    ].toSorted());

    const savedFiles = await readdir(downloadsDir);
    for (const filename of downloadEvents) {
      expect(savedFiles).toContain(filename);
      await expectPngDimensions(`${downloadsDir}/${filename}`, {
        height: 1440,
        width: 1080,
      });
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(
      page.getByRole("region", { name: "Poster maker workbench" }),
    ).toBeVisible();
    await expect(mainPreview).toBeVisible();
    await expect(page.getByRole("button", { name: "Export poster pages" })).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(horizontalOverflow).toBe(false);
  });

  test("renders page labels and footer, blocks empty-title export, and warns on overflow risk", async ({
    page,
  }) => {
    const downloadEvents: string[] = [];

    await page.addInitScript(() => {
      Object.defineProperty(window, "showDirectoryPicker", {
        configurable: true,
        value: undefined,
      });
    });
    page.on("download", (download) => {
      downloadEvents.push(download.suggestedFilename());
    });
    await page.goto("/poster-maker/minimalist");

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
    const invalidDownloadAttempt = page
      .waitForEvent("download", { timeout: 500 })
      .then(() => true)
      .catch(() => false);
    await page.getByRole("button", { name: "Export poster pages" }).click();

    await expect(page.getByLabel("Page title")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(
      page.getByText("Add a title before exporting every poster page."),
    ).toBeVisible();
    await expect(invalidDownloadAttempt).resolves.toBe(false);
    expect(downloadEvents).toEqual([]);

    await page.getByLabel("Page title").fill("Long Content");
    await page
      .getByLabel("Page description")
      .fill(`${"Overflow warning line\n".repeat(18)}Final line`);

    await expect(page.getByRole("status", { name: "Poster warnings" })).toContainText(
      "may overflow",
    );

    await page.getByRole("button", { name: "Export poster pages" }).click();
    await expect(page.getByRole("status", { name: "Export status" })).toContainText(
      "Downloaded 2 PNG files",
    );
    await expect
      .poll(() => downloadEvents.length, { message: "valid export downloads" })
      .toBe(2);
  });

  test("saves PNGs through the directory picker when available", async ({
    page,
  }) => {
    const downloadEvents: string[] = [];

    await page.addInitScript(() => {
      Object.defineProperty(window, "__directoryWrites", {
        configurable: true,
        value: [],
      });
      Object.defineProperty(window, "showDirectoryPicker", {
        configurable: true,
        value: async () => ({
          getFileHandle: async (
            name: string,
            options?: { create?: boolean },
          ) => {
            (
              window as unknown as { __directoryWrites: string[] }
            ).__directoryWrites.push(`${name}:${String(options?.create)}`);

            return {
              createWritable: async () => ({
                close: async () => {},
                write: async (blob: Blob) => {
                  (
                    window as unknown as { __directoryWrites: string[] }
                  ).__directoryWrites.push(`${name}:${blob.type}:${blob.size > 0}`);
                },
              }),
            };
          },
        }),
      });
    });
    page.on("download", (download) => {
      downloadEvents.push(download.suggestedFilename());
    });

    await page.goto("/poster-maker/minimalist");
    await page.getByLabel("Markdown import").fill(`# Launch Plan
First line

## Metrics Snapshot
Revenue up 18%`);
    await page.getByRole("button", { name: "Replace pages" }).click();
    await page.getByRole("button", { name: "Export poster pages" }).click();

    await expect(page.getByRole("status", { name: "Export status" })).toContainText(
      "Saved 2 PNG files to selected directory",
    );
    expect(downloadEvents).toEqual([]);
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { __directoryWrites: string[] }).__directoryWrites,
        ),
      )
      .toEqual([
        "poster-01-launch-plan.png:true",
        "poster-01-launch-plan.png:image/png:true",
        "poster-02-metrics-snapshot.png:true",
        "poster-02-metrics-snapshot.png:image/png:true",
      ]);
  });

  test("imports Markdown pages by replacing and appending parsed headings", async ({
    page,
  }) => {
    await page.goto("/poster-maker/minimalist");

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
    await page.goto("/poster-maker/minimalist");

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

async function expectPngDimensions(
  filePath: string,
  expectedSize: { height: number; width: number },
) {
  const png = await readFile(filePath);

  expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(png.readUInt32BE(16)).toBe(expectedSize.width);
  expect(png.readUInt32BE(20)).toBe(expectedSize.height);
}
