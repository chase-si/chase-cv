import { expect, test } from "@playwright/test";

const DUDU_SCANNER_PATH = "/en/dudu-scanner";

async function startScanRound(page: import("@playwright/test").Page) {
  await page.goto(DUDU_SCANNER_PATH);
  await page.getByRole("button", { name: "Start scan" }).click();
  await expect(page.getByTestId("dudu-scanner-scan-view")).toBeVisible();
}

test.describe("dudu scanner round", () => {
  test("full playable round from config through result and back", async ({ page }) => {
    await startScanRound(page);

    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Scanning…");
    await expect(page.getByTestId("dudu-scanner-fan-stage")).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.getByTestId("dudu-scanner-transient")).toContainText("No signal to lock");

    await page.keyboard.press("1");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Signal detected");
    await expect(page.getByTestId("dudu-scanner-target-preview")).toBeVisible({ timeout: 2000 });

    await page.keyboard.press("Enter");
    await expect(page.getByTestId("dudu-scanner-lock-frame")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-result-view")).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId("dudu-scanner-result-target")).toBeVisible();

    await page.getByTestId("dudu-scanner-scan-again").click();
    await expect(page.getByTestId("dudu-scanner-scan-view")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Scanning…");

    await page.keyboard.press("1");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("dudu-scanner-result-view")).toBeVisible({ timeout: 3000 });

    await page.getByTestId("dudu-scanner-change-target").click();
    await expect(page.getByRole("heading", { name: "Dudu Scanner" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Fry Sprite", pressed: true })).toBeVisible();
  });

  test("continues scan when fullscreen is rejected and shows F retry hint", async ({ page }) => {
    await page.addInitScript(() => {
      HTMLElement.prototype.requestFullscreen = function requestFullscreen() {
        return Promise.reject(new Error("fullscreen denied"));
      };
    });

    await startScanRound(page);
    await expect(page.getByTestId("dudu-scanner-scan-view")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-transient")).toContainText("press F", {
      timeout: 5000,
    });
  });

  test("space pauses and 1 reveals after pause", async ({ page }) => {
    await startScanRound(page);
    await page.keyboard.press("Space");
    await page.keyboard.press("1");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Signal detected", {
      timeout: 3000,
    });
  });

  test("X hides target and returns to scanning", async ({ page }) => {
    await startScanRound(page);
    await page.keyboard.press("1");
    await expect(page.getByTestId("dudu-scanner-target-preview")).toBeVisible({ timeout: 2000 });
    await page.keyboard.press("x");
    await expect(page.getByTestId("dudu-scanner-transient")).toContainText("No signal to lock");
    await expect(page.getByTestId("dudu-scanner-target-preview")).toHaveCount(0);
    await page.keyboard.press("1");
    await expect(page.getByTestId("dudu-scanner-target-preview")).toBeVisible({ timeout: 2000 });
  });

  test("R restarts scan without leaving immersive view", async ({ page }) => {
    await startScanRound(page);
    await page.keyboard.press("1");
    await page.keyboard.press("r");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Scanning…");
    await expect(page.getByTestId("dudu-scanner-target-preview")).toHaveCount(0);
  });

  test("browser back from scan returns to config before leaving app", async ({ page }) => {
    await page.goto(DUDU_SCANNER_PATH);
    await page.getByRole("button", { name: "Start scan" }).click();
    await expect(page.getByTestId("dudu-scanner-scan-view")).toBeVisible();

    await page.goBack();
    await expect(page.getByRole("heading", { name: "Dudu Scanner" })).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-scan-view")).toHaveCount(0);

    await page.goBack();
    await expect(page).not.toHaveURL(new RegExp(`${DUDU_SCANNER_PATH}$`));
  });

  test("refresh during scan returns to config with persisted preferences", async ({ page }) => {
    await page.goto(DUDU_SCANNER_PATH);
    await page.getByRole("button", { name: "Tummy Creatures" }).click();
    await page.getByRole("button", { name: "Rumble Monster" }).click();
    await page.getByRole("button", { name: "Start scan" }).click();
    await expect(page.getByTestId("dudu-scanner-scan-view")).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Dudu Scanner" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tummy Creatures", pressed: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Rumble Monster", pressed: true })).toBeVisible();
  });
});
