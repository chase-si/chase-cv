import { expect, test } from "@playwright/test";

import {
  CLASSIFIED_THEME_ROLE_LABELS,
  preparePreviewStep,
  SAMPLE_IMAGE_ID,
} from "./helpers/image-to-ui";

test.describe("image-to-ui themed preview e2e", () => {
  test("case 1: render opens themed preview from sample image", async ({ page }) => {
    const selectedSwatches = await preparePreviewStep(page);

    await expect(page).toHaveURL(/\/image-to-ui$/);
    await expect(page.getByLabel("Tool steps")).toContainText("Render interface");
    await expect(page.getByTestId("render-input-summary")).toBeVisible();
    await expect(page.getByTestId("saas-preview-surface")).toBeVisible();
    await expect(
      page.getByText(
        "Upload or choose a sample image, extract dominant colors, and pick three colors for the interface rendering step.",
      ),
    ).toHaveCount(0);
    await expect(page.getByTestId("render-input-image-summary")).toBeVisible();

    const renderInputData = await page.getByTestId("render-input-summary").getAttribute("data-render-input");
    expect(renderInputData).toBeTruthy();
    const parsed = JSON.parse(renderInputData ?? "{}") as { colorRoles: Array<{ role: string; hex: string }> };

    expect(parsed.colorRoles).toHaveLength(3);
    expect(parsed.colorRoles.map((entry) => entry.role).sort()).toEqual(
      [...CLASSIFIED_THEME_ROLE_LABELS].sort(),
    );
    expect(parsed.colorRoles.map((entry) => entry.hex)).toEqual(selectedSwatches.map((entry) => entry.hex));
  });

  test("case 2: preview theme stays locally scoped", async ({ page }) => {
    await preparePreviewStep(page);

    const siteHeader = page.locator("body > header");
    const previewSurface = page.getByTestId("saas-preview-surface");

    await expect(siteHeader).toBeVisible();
    await expect(siteHeader.locator("img").first()).toBeVisible();
    await expect(previewSurface).toBeVisible();
    await expect(page.getByTestId("saas-primary-action")).toBeVisible();
    await expect(page.getByTestId("saas-secondary-chip")).toBeVisible();
    await expect(page.getByTestId("saas-accent-badge")).toBeVisible();
    await expect(page.getByTestId("render-preview-token-summary")).toBeVisible();

    const previewStyle = await previewSurface.getAttribute("style");
    expect(previewStyle).toContain("--primary");
    expect(previewStyle).toContain("--secondary");
    expect(previewStyle).toContain("--accent");

    const siteHeaderStyle = await siteHeader.getAttribute("style");
    expect(siteHeaderStyle ?? "").not.toContain("--primary");
  });

  test("case 3: return to edit preserves selected state", async ({ page }) => {
    const selectedSwatches = await preparePreviewStep(page);

    await page.getByTestId("render-back-to-edit").click();

    await expect(page).toHaveURL(/\/image-to-ui$/);
    await expect(page.getByLabel("Tool steps")).toContainText("Choose image and colors");
    await expect(page.locator(`[data-sample-id="${SAMPLE_IMAGE_ID}"]`)).toHaveAttribute("aria-pressed", "true");

    for (let index = 0; index < selectedSwatches.length; index += 1) {
      const swatch = selectedSwatches[index];
      await expect(page.getByTestId(swatch.swatchTestId)).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByTestId(`palette-swatch-order-${swatch.swatchTestId.replace("palette-swatch-", "")}`),
      ).toHaveText(`${index + 1}`);
    }

    await expect(page.getByTestId("palette-render-button")).toBeEnabled();
  });
});
