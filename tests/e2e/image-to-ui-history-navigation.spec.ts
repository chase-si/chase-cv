import { expect, test } from "@playwright/test";

import { openRenderStep, SAMPLE_IMAGE_ID } from "./helpers/image-to-ui";

test.describe("image-to-ui browser history", () => {
  test("back and forward restore step 1 with interactive source sidebar", async ({ page }) => {
    await openRenderStep(page);

    await page.getByRole("link", { name: "Chase" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/image-to-ui$/);
    await expect(page.getByLabel("Image source")).toBeVisible();
    await expect(page.getByText("Source", { exact: true })).toBeVisible();
    await expect(page.getByTestId("render-input-summary")).toHaveCount(0);
    await expect(page.getByLabel("Tool steps")).toContainText("Choose image and colors");

    await page.locator(`[data-sample-id="${SAMPLE_IMAGE_ID}"]`).click();
    await expect(page.getByTestId("palette-swatch-Dominant1")).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/\/$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/image-to-ui$/);
    await expect(page.getByLabel("Image source")).toBeVisible();
    await expect(page.getByTestId("render-input-summary")).toHaveCount(0);

    await page.locator(`[data-sample-id="${SAMPLE_IMAGE_ID}"]`).click();
    await expect(page.getByTestId("palette-swatch-Dominant1")).toBeVisible();
  });
});
