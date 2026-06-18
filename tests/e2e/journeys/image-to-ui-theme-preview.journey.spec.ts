import { expect, test } from "@playwright/test";

import { preparePreviewStep, SAMPLE_IMAGE_ID } from "../helpers/image-to-ui";

test.describe("image-to-ui themed preview journey", () => {
  test("smoke journey: select, render preview, and return with state intact", async ({ page }) => {
    const selectedSwatches = await preparePreviewStep(page);

    await expect(page.getByTestId("render-preview-token-summary")).toBeVisible();
    await expect(page.getByTestId("saas-status-area")).toBeVisible();
    await expect(page.getByTestId("saas-dashboard-toolbar")).toBeVisible();
    await expect(page.getByTestId("saas-revenue-chart-section")).toBeVisible();
    await expect(page.getByTestId("saas-segment-chart-section")).toBeVisible();
    await expect(page.getByTestId("saas-recharts-area").locator("svg")).toBeVisible();
    await expect(page.getByTestId("saas-recharts-bar").locator("svg")).toBeVisible();
    await expect(page.getByTestId("saas-data-table-section")).toBeVisible();
    await expect(page.getByTestId("saas-accent-section")).toBeVisible();

    await page.getByRole("tab", { name: "Workspace settings" }).click();
    await expect(page.getByText("Upgrade your subscription")).toBeVisible();
    await expect(page.getByText("Team Members", { exact: true })).toBeVisible();
    await expect(page.getByText("Create an account")).toBeVisible();

    await page.getByRole("tab", { name: "Landing page" }).click();
    await expect(page.getByTestId("landing-page-preview")).toBeVisible();
    await expect(page.getByTestId("landing-nav")).toBeVisible();
    await expect(page.getByTestId("landing-hero")).toContainText("Launch customer success faster");
    await expect(page.getByTestId("landing-hero-panel")).toBeVisible();
    await expect(page.getByTestId("landing-conversion-strip")).toBeVisible();

    await page.getByTestId("render-back-to-edit").click();
    await expect(page.locator(`[data-sample-id="${SAMPLE_IMAGE_ID}"]`)).toHaveAttribute("aria-pressed", "true");

    for (const swatch of selectedSwatches) {
      await expect(page.getByTestId(swatch.swatchTestId)).toHaveAttribute("aria-pressed", "true");
    }
    await expect(page.getByTestId("palette-render-button")).toBeEnabled();
  });
});
