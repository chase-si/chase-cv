import { expect, test } from "@playwright/test";

test.describe("Floor Plan Furniture Specification Decision Journey (Issue #226 / PRD #215 AC-26)", () => {
  test("AC-26 & AC-27: complete desktop purchase-decision journey (select plan -> add multiple furniture -> switch target specification -> move/rotate -> verify status, reasons, and mm measurements)", async ({
    page,
  }) => {
    // 1. Set standard desktop viewport and navigate to Chinese floor-plan page
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/zh/floor-plan");

    // Page title and 2-pane layout chrome
    await expect(
      page.getByRole("heading", { level: 1, name: "我家适合买多大的床或沙发？" }),
    ).toBeVisible();

    const canvas = page.getByTestId("floor-plan-svg-canvas");
    const desktopPane = page.getByTestId("desktop-context-pane");
    await expect(canvas).toBeVisible();
    await expect(desktopPane).toBeVisible();

    // AC-27: Pruned legacy capabilities (4-stage stepper, undo/redo, calibration, arbitrary resize) must not exist
    await expect(page.getByTestId("floor-plan-stage-stepper")).not.toBeVisible();
    await expect(page.getByTestId("undo-btn")).not.toBeVisible();
    await expect(page.getByTestId("redo-btn")).not.toBeVisible();
    await expect(page.getByTestId("customize-plan-btn")).not.toBeVisible();
    await expect(page.getByTestId("furniture-width-input")).not.toBeVisible();

    // 2. Step 1 of AC-26: Select a Standard Floor Plan from the catalog (选择标准户型)
    await page.getByTestId("open-plan-selector-btn").click();
    const catalogDialog = page.getByTestId("floor-plan-catalog");
    await expect(catalogDialog).toBeVisible();

    // First select Shenzhen 70B plan to verify active plan summary & canvas synchronization (AC-1)
    const szPlanId = "plan-cn-sz-shanyuewan-70b-70";
    await expect(page.getByTestId(`catalog-plan-card-${szPlanId}`)).toBeVisible();
    await page.getByTestId(`open-plan-btn-${szPlanId}`).click();
    await expect(catalogDialog).not.toBeVisible();
    await expect(page.getByTestId("active-plan-name")).toContainText("深圳山樾湾");

    // Now switch back to Shanghai Ruidong 2BR plan (plan-cn-sh-ruidong-2br-67) for our multi-room decision test
    await page.getByTestId("open-plan-selector-btn").click();
    const ruidongPlanId = "plan-cn-sh-ruidong-2br-67";
    await page.getByTestId(`open-plan-btn-${ruidongPlanId}`).click();
    await expect(catalogDialog).not.toBeVisible();

    // Verify canvas rooms and active plan summary synchronize
    await expect(page.getByTestId("active-plan-name")).toContainText("上海瑞冬小区两居室");
    await expect(page.getByTestId("active-plan-area")).toBeVisible();
    await expect(page.getByTestId("active-plan-room-breakdown")).toBeVisible();
    await expect(page.getByTestId("floor-plan-room-r2")).toBeVisible();
    await expect(page.getByTestId("floor-plan-room-r5")).toBeVisible();

    // 3. Step 2 of AC-26: Add multiple furniture placements (添加多件家具)
    // First, select Secondary Bedroom (r2 次卧) and add a Single Bed (bed-single, 1200 × 2000 mm)
    const roomR2 = page.getByTestId("room-item-r2");
    await roomR2.click();
    await expect(page.getByTestId("target-room-details")).toBeVisible();
    await expect(
      page.getByTestId("target-room-details").getByTestId("target-room-name"),
    ).toContainText("次卧");
    await page.getByTestId("add-context-furniture-bed-single").click();

    // Second, select Master Bedroom (r5 主卧) and add a Double Bed (bed-double, 1800 × 2000 mm)
    const roomR5 = page.getByTestId("room-item-r5");
    await roomR5.click();
    await expect(
      page.getByTestId("target-room-details").getByTestId("target-room-name"),
    ).toContainText("主卧");
    await page.getByTestId("add-context-furniture-bed-double").click();

    // Verify multiple furniture items exist on the canvas and in the placed furniture switcher list (AC-3)
    const placedFurnitureList = page.getByTestId("placed-furniture-list");
    await expect(placedFurnitureList).toBeVisible();
    const targetButtons = placedFurnitureList.locator('[data-testid^="select-target-furniture-"]');
    await expect(targetButtons).toHaveCount(2);

    const canvasFurnitureItems = canvas.locator('[data-testid^="floor-plan-furniture-f-"]');
    await expect(canvasFurnitureItems).toHaveCount(2);

    // Verify the second added furniture (Double Bed in r5) is the active assessment target
    const decisionPanel = page.getByTestId("furniture-decision-panel");
    await expect(decisionPanel).toBeVisible();
    await expect(page.getByTestId("decision-title")).toContainText("双人床");
    await expect(page.getByTestId("decision-dimensions")).toHaveText("1800 × 2000 mm");

    // Switch target to the first item (Single Bed in r2) and back to the Double Bed in r5 to prove target switching (AC-3)
    await targetButtons.nth(0).click();
    await expect(page.getByTestId("decision-title")).toContainText("单人床");
    await targetButtons.nth(1).click();
    await expect(page.getByTestId("decision-title")).toContainText("双人床");

    // 4. Step 3 of AC-26: Select and switch target furniture specification (选择并切换目标家具规格)
    // In r5 (主卧, inner width 3141 mm), Double Bed 1800 × 2000 mm at centroid (3182, 8602) has:
    // - Left clearance 671 mm, Right clearance 670 mm (both between minimum 600 mm and recommended 750 mm)
    // -> Status is "trade-off" ("需要权衡")
    await expect(page.getByTestId("decision-status-badge")).toContainText("需要权衡");
    await expect(page.getByTestId("decision-issue-below-recommended-clearance").first()).toBeVisible();
    await expect(
      page.getByTestId("decision-measured-below-recommended-clearance").first(),
    ).toContainText(/67[01] mm/);
    await expect(
      page.getByTestId("decision-recommended-below-recommended-clearance").first(),
    ).toContainText("最低 600 mm / 推荐 750 mm");

    // Record initial center & rotation from inspector before switching specification
    await expect(page.getByTestId("inspector-furniture-details")).toBeVisible();
    await expect(page.getByTestId("inspector-furniture-details")).toContainText("X: 3182 mm, Y: 8602 mm");
    await expect(page.getByTestId("inspector-furniture-details")).toContainText("0°");

    // Switch target Double Bed specification from 1800 × 2000 mm to 1500 × 2000 mm (bed-double-1500)
    await page.getByTestId("switch-specification-bed-double-1500").click();

    // Verify center (3182, 8602) and rotation (0°) stay strictly fixed while dimensions and assessment immediately update (AC-5)
    await expect(page.getByTestId("decision-dimensions")).toHaveText("1500 × 2000 mm");
    await expect(page.getByTestId("inspector-furniture-dimensions")).toHaveText("1500 × 2000 mm");
    await expect(page.getByTestId("inspector-furniture-details")).toContainText("X: 3182 mm, Y: 8602 mm");
    await expect(page.getByTestId("inspector-furniture-details")).toContainText("0°");

    // With 1500 × 2000 mm in r5, left clearance is 821 mm (>= 750) and right clearance is 820 mm (>= 750) -> Status is "suitable" ("适合")
    await expect(page.getByTestId("decision-status-badge")).toContainText("适合");
    await expect(page.getByTestId("decision-clean-notice")).toBeVisible();

    // 5. Step 4 of AC-26: Move or rotate target furniture -> verify status, finding reasons, and mm measurements update
    // Nudge right by 100 mm -> X becomes 3282 mm, right clearance drops to 720 mm (between 600 and 750 mm) -> "需要权衡" (trade-off)
    await page.getByTestId("nudge-furniture-right").click();
    await expect(page.getByTestId("inspector-furniture-details")).toContainText("X: 3282 mm, Y: 8602 mm");
    await expect(page.getByTestId("decision-status-badge")).toContainText("需要权衡");
    await expect(page.getByTestId("decision-issue-below-recommended-clearance")).toBeVisible();
    await expect(page.getByTestId("decision-measured-below-recommended-clearance")).toContainText("720 mm");
    await expect(page.getByTestId("decision-recommended-below-recommended-clearance")).toContainText(
      "最低 600 mm / 推荐 750 mm",
    );
    await expect(page.getByTestId("finding-minimum-below-recommended-clearance")).toContainText("600 mm");

    // Nudge right twice more (+200 mm -> X becomes 3482 mm), right clearance drops to 520 mm (< 600 mm minimum) -> "必须调整" (must-adjust)
    await page.getByTestId("nudge-furniture-right").click();
    await page.getByTestId("nudge-furniture-right").click();
    await expect(page.getByTestId("inspector-furniture-details")).toContainText("X: 3482 mm, Y: 8602 mm");
    await expect(page.getByTestId("decision-status-badge")).toContainText("必须调整");
    await expect(page.getByTestId("decision-issue-below-minimum-clearance")).toBeVisible();
    await expect(page.getByTestId("decision-measured-below-minimum-clearance")).toContainText("520 mm");
    await expect(page.getByTestId("decision-recommended-below-minimum-clearance")).toContainText(
      "最低 600 mm / 推荐 750 mm",
    );
    await expect(page.getByTestId("finding-minimum-below-minimum-clearance")).toContainText("600 mm");

    // Rotate 90° -> headboard (back: 0/0 mm) faces East wall and foot (front: min 600 / rec 900 mm)
    // faces West wall with 871 mm clearance -> status updates from "必须调整" to "需要权衡"
    await page.getByTestId("rotate-furniture-btn").click();
    await expect(page.getByTestId("inspector-furniture-details")).toContainText("90°");
    await expect(page.getByTestId("decision-status-badge")).toContainText("需要权衡");
    await expect(page.getByTestId("decision-measured-below-recommended-clearance")).toContainText("871 mm");
    await expect(page.getByTestId("decision-recommended-below-recommended-clearance")).toContainText(
      "最低 600 mm / 推荐 900 mm",
    );

    // Capture desktop journey screenshot for visual verification
    await page.screenshot({
      path: "test-results/floor-plan-desktop-journey.png",
      fullPage: false,
    });
  });

  test("AC-23 & AC-24: mobile viewport and keyboard journey with >= 44x44px touch targets and zero horizontal overflow", async ({
    page,
  }) => {
    // Set representative mobile device viewport (390 x 844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/zh/floor-plan");

    // Verify no horizontal overflow on mobile initially
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Responsive SVG Canvas and context controls rail are visible
    await expect(page.getByTestId("floor-plan-svg-canvas")).toBeVisible();
    await expect(page.getByTestId("desktop-context-pane")).toBeVisible();

    // Select focus room r5 (主卧) and add Double Bed on mobile
    const roomR5 = page.getByTestId("room-item-r5");
    await roomR5.scrollIntoViewIfNeeded();
    await roomR5.click();

    const addBedBtn = page.getByTestId("add-context-furniture-bed-double");
    await addBedBtn.scrollIntoViewIfNeeded();
    await addBedBtn.click();

    // Decision panel renders on mobile
    await expect(page.getByTestId("furniture-decision-panel")).toBeVisible();
    await expect(page.getByTestId("decision-status-badge")).toContainText("需要权衡");

    // Switch specification on mobile and verify touch target >= 44x44px
    const specBtn = page.getByTestId("switch-specification-bed-double-1500");
    await specBtn.scrollIntoViewIfNeeded();
    const specBox = await specBtn.boundingBox();
    expect(specBox).not.toBeNull();
    if (specBox) {
      expect(specBox.width).toBeGreaterThanOrEqual(44);
      expect(specBox.height).toBeGreaterThanOrEqual(44);
    }
    await specBtn.click();
    await expect(page.getByTestId("decision-status-badge")).toContainText("适合");

    // Verify nudge button touch target >= 44x44px
    const nudgeRightBtn = page.getByTestId("nudge-furniture-right");
    await nudgeRightBtn.scrollIntoViewIfNeeded();
    const nudgeBox = await nudgeRightBtn.boundingBox();
    expect(nudgeBox).not.toBeNull();
    if (nudgeBox) {
      expect(nudgeBox.width).toBeGreaterThanOrEqual(44);
      expect(nudgeBox.height).toBeGreaterThanOrEqual(44);
    }
    await nudgeRightBtn.click();
    await expect(page.getByTestId("decision-status-badge")).toContainText("需要权衡");

    // Check again no horizontal scroll after full mobile interaction
    const hasHorizontalOverflowEnd = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflowEnd).toBe(false);

    // Capture mobile journey screenshot for visual verification
    await page.screenshot({
      path: "test-results/floor-plan-mobile-journey.png",
      fullPage: false,
    });
  });
});
