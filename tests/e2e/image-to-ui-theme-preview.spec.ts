import { expect, test, type Page } from "@playwright/test";

const SAMPLE_IMAGE_ID = "great-wave";
const CLASSIFIED_THEME_ROLE_LABELS = ["表面基底", "动作色", "辅助色"] as const;

type SelectedSwatch = {
  swatchTestId: string;
  hex: string;
};

async function preparePreviewStep(page: Page): Promise<SelectedSwatch[]> {
  await page.goto("/image-to-ui");
  await expect(page).toHaveURL(/\/image-to-ui$/);

  await page.locator(`[data-sample-id="${SAMPLE_IMAGE_ID}"]`).click();

  const swatches = page.locator('button[data-testid^="palette-swatch-"]');
  await expect(swatches.first()).toBeVisible();

  const selected: SelectedSwatch[] = [];
  for (let index = 0; index < 3; index += 1) {
    const button = swatches.nth(index);
    const swatchTestId = await button.getAttribute("data-testid");
    if (!swatchTestId) {
      throw new Error("Missing swatch data-testid.");
    }
    const hexText = await button.locator(".font-mono").innerText();
    const hex = hexText.trim().toUpperCase();
    selected.push({ swatchTestId, hex });
    await button.click();
  }

  const renderButton = page.getByTestId("palette-render-button");
  await expect(renderButton).toBeEnabled();
  await renderButton.click();

  await expect(page.getByTestId("render-input-summary")).toBeVisible();
  return selected;
}

test.describe("image-to-ui themed preview e2e", () => {
  test("case 1: render opens themed preview from sample image", async ({ page }) => {
    const selectedSwatches = await preparePreviewStep(page);

    await expect(page).toHaveURL(/\/image-to-ui$/);
    await expect(page.getByLabel("工具步骤")).toContainText("渲染界面");
    await expect(page.getByTestId("render-input-summary")).toBeVisible();
    await expect(page.getByTestId("saas-preview-surface")).toBeVisible();
    await expect(
      page.getByText("上传或选择示例图片，提取主色调并挑选 3 个颜色，为后续界面渲染步骤做准备。"),
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
    await expect(page.getByLabel("工具步骤")).toContainText("选择图片与颜色");
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
