import { expect, test } from "@playwright/test";

const DUDU_SCANNER_PATH = "/en/dudu-scanner";
const TOUCH_MEDIA_QUERY = "(hover: none) and (pointer: coarse)";

test.describe("dudu scanner narrow viewport", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript((query) => {
      const original = window.matchMedia.bind(window);
      window.matchMedia = (mediaQuery: string) => {
        if (mediaQuery === query) {
          return {
            matches: true,
            media: mediaQuery,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true,
          } as MediaQueryList;
        }
        return original(mediaQuery);
      };
    }, TOUCH_MEDIA_QUERY);
  });

  test("expands the operator bar to reveal and lock", async ({ page }) => {
    await page.goto(DUDU_SCANNER_PATH);
    await page.getByRole("button", { name: "Start scan" }).click();
    await expect(page.getByTestId("dudu-scanner-scan-view")).toBeVisible();

    const scanView = page.getByTestId("dudu-scanner-scan-view");
    await expect(scanView).toBeVisible();
    const overflow = await scanView.evaluate((node) => {
      const element = node as HTMLElement;
      return element.scrollWidth > element.clientWidth + 1;
    });
    expect(overflow).toBe(false);

    await expect(page.getByTestId("dudu-scanner-operator-reveal")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-operator-reset")).toHaveCount(0);
    await expect(page.getByText("Force target discovery")).toHaveCount(0);
    await page.getByTestId("dudu-scanner-operator-reveal").click();
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Signal detected", {
      timeout: 3000,
    });
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText(
      "Unknown signal stabilized — lock to identify",
      { timeout: 3000 },
    );
    await page.getByTestId("dudu-scanner-operator-lock").click();
    await expect(page.getByTestId("dudu-scanner-lock-frame")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-result-view")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("dudu-scanner-health-guidance")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-scan-again")).toBeVisible();
  });

  test("shows all ten operator targets without horizontal overflow", async ({ page }) => {
    await page.goto(DUDU_SCANNER_PATH);
    await page.getByRole("button", { name: "Grown-up mode" }).click();

    await expect(page.getByRole("button", { name: "Eye Guard" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Motion Energy Ball" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Toothbrush Knight" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Breakfast Wake-up Bird" })).toBeVisible();

    const appRoot = page.getByTestId("dudu-scanner-app-root");
    const hasHorizontalOverflow = await appRoot.evaluate((node) => {
      const element = node as HTMLElement;
      return element.scrollWidth > element.clientWidth + 1;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });
});
