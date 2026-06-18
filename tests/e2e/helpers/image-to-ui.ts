import { expect, type Page } from "@playwright/test";

export const SAMPLE_IMAGE_ID = "great-wave";
export const CLASSIFIED_THEME_ROLE_LABELS = ["表面基底", "动作色", "辅助色"] as const;

export type SelectedSwatch = {
  swatchTestId: string;
  hex: string;
};

async function selectSampleAndRender(page: Page, captureSwatchMeta: boolean): Promise<SelectedSwatch[]> {
  await page.goto("/image-to-ui");
  await expect(page).toHaveURL(/\/image-to-ui$/);

  await page.locator(`[data-sample-id="${SAMPLE_IMAGE_ID}"]`).click();

  const swatches = page.locator('button[data-testid^="palette-swatch-"]');
  await expect(swatches.first()).toBeVisible();

  const selected: SelectedSwatch[] = [];
  for (let index = 0; index < 3; index += 1) {
    const button = swatches.nth(index);
    if (captureSwatchMeta) {
      const swatchTestId = await button.getAttribute("data-testid");
      if (!swatchTestId) {
        throw new Error("Missing swatch data-testid.");
      }
      const hexText = await button.locator(".font-mono").innerText();
      const hex = hexText.trim().toUpperCase();
      selected.push({ swatchTestId, hex });
    }
    await button.click();
  }

  const renderButton = page.getByTestId("palette-render-button");
  await expect(renderButton).toBeEnabled();
  await renderButton.click();

  await expect(page.getByTestId("render-input-summary")).toBeVisible();
  return selected;
}

export async function preparePreviewStep(page: Page): Promise<SelectedSwatch[]> {
  return selectSampleAndRender(page, true);
}

export async function openRenderStep(page: Page): Promise<void> {
  await selectSampleAndRender(page, false);
}
