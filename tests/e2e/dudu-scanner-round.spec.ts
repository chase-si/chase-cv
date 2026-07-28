import { expect, test } from "@playwright/test";

import {
  computeFanGeometry,
  placeTargetInSafeRegion,
} from "../../lib/dudu-scanner/scanner-visual/geometry";

const DUDU_SCANNER_PATH = "/en/dudu-scanner";

function hashTargetSeed(targetId: string): number {
  let hash = 0;
  for (let index = 0; index < targetId.length; index += 1) {
    hash = (hash << 5) - hash + targetId.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) + 1;
}

async function startScanRound(page: import("@playwright/test").Page) {
  await page.goto(DUDU_SCANNER_PATH);
  await page.getByRole("button", { name: "Start scan" }).click();
  await expect(page.getByTestId("dudu-scanner-scan-view")).toBeVisible();
}

test.describe("dudu scanner round", () => {
  test("full playable round from config through result and back", async ({ page }) => {
    await startScanRound(page);

    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Initializing scanner…");
    await expect(page.getByTestId("dudu-scanner-fan-stage")).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.getByTestId("dudu-scanner-transient")).toContainText("No signal to lock");

    await page.keyboard.press("Space");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Signal detected");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText(
      "Target revealed — ready to lock",
      { timeout: 3000 },
    );

    await page.keyboard.press("Enter");
    await expect(page.getByTestId("dudu-scanner-lock-frame")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-result-view")).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId("dudu-scanner-result-target")).toBeVisible();

    await page.getByTestId("dudu-scanner-scan-again").click();
    await expect(page.getByTestId("dudu-scanner-scan-view")).toBeVisible();
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Initializing scanner…");

    await page.keyboard.press("Space");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText(
      "Target revealed — ready to lock",
      { timeout: 3000 },
    );
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

  test("space forces discovery during initialization", async ({ page }) => {
    await startScanRound(page);
    await page.keyboard.press("Space");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Signal detected", {
      timeout: 3000,
    });
  });

  test("pointer proximity discovers the hidden target after the timing and dwell gates", async ({
    page,
  }) => {
    await startScanRound(page);
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText(
      "Move the probe to find a signal",
      { timeout: 5000 },
    );
    const stage = page.getByTestId("dudu-scanner-fan-stage");
    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2, { steps: 20 });
    await expect(page.getByTestId("dudu-scanner-hud-signal")).not.toHaveText("0%");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Signal detected", {
      timeout: 9000,
    });
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText(
      "Target revealed — ready to lock",
      { timeout: 3000 },
    );
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("dudu-scanner-result-view")).toBeVisible({ timeout: 3000 });
  });

  test("X hides target and allows the director to discover it again", async ({ page }) => {
    await startScanRound(page);
    await page.keyboard.press("Space");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Signal detected");
    await page.keyboard.press("x");
    await expect(page.getByTestId("dudu-scanner-transient")).toContainText("No signal to lock");
    await page.keyboard.press("Space");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Signal detected");
  });

  test("R restarts scan and regenerates the hidden target", async ({ page }) => {
    await startScanRound(page);
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText(
      "Move the probe to find a signal",
      { timeout: 5000 },
    );
    const stage = page.getByTestId("dudu-scanner-fan-stage");
    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    const fan = computeFanGeometry(box!.width, box!.height);
    const initialSeed = hashTargetSeed("fry-sprite");
    const initialTarget = placeTargetInSafeRegion(initialSeed, fan, 28);
    const restartedTarget = placeTargetInSafeRegion(initialSeed + 97, fan, 28);
    expect(restartedTarget).not.toEqual(initialTarget);

    await page.mouse.move(box!.x + initialTarget.x, box!.y + initialTarget.y);
    await expect(page.getByTestId("dudu-scanner-hud-signal")).toHaveText("100%");

    await page.keyboard.press("r");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText("Initializing scanner…");
    await expect(page.getByTestId("dudu-scanner-status")).toHaveText(
      "Move the probe to find a signal",
      { timeout: 5000 },
    );
    await page.mouse.move(box!.x + restartedTarget.x, box!.y + restartedTarget.y);
    await expect(page.getByTestId("dudu-scanner-hud-signal")).toHaveText("100%");
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
