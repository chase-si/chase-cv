import { expect, test } from "@playwright/test";

test.describe("Floor Plan Two-Pane Furniture Decision Journey (Issue #206)", () => {
  test("AC-1 & AC-27: complete desktop furniture decision journey with real-time re-evaluation", async ({
    page,
  }) => {
    // 1. Set standard desktop viewport and navigate to Chinese floor-plan page
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/zh/floor-plan");

    // Page title and layout chrome
    await expect(
      page.getByRole("heading", { level: 1, name: "标准户型空间验证器" }),
    ).toBeVisible();

    // AC-1: Stepper displays 4 stages: plan, room, furniture, decision
    const stepper = page.getByTestId("floor-plan-stage-stepper");
    await expect(stepper).toBeVisible();

    const planStep = page.getByTestId("stage-step-plan");
    const roomStep = page.getByTestId("stage-step-room");
    const furnitureStep = page.getByTestId("stage-step-furniture");
    const decisionStep = page.getByTestId("stage-step-decision");

    await expect(planStep).toBeVisible();
    await expect(roomStep).toBeVisible();
    await expect(furnitureStep).toBeVisible();
    await expect(decisionStep).toBeVisible();

    // Plan step is current active step
    await expect(planStep).toHaveAttribute("aria-current", "step");

    // AC-1 & AC-28: Two-pane layout on desktop (canvas left, context task panel right)
    const canvas = page.getByTestId("floor-plan-svg-canvas");
    const desktopPane = page.getByTestId("desktop-context-pane");
    await expect(canvas).toBeVisible();
    await expect(desktopPane).toBeVisible();

    // AC-1: Default state does NOT display full catalog sidebar or global entity inspector simultaneously
    await expect(page.getByTestId("floor-plan-catalog")).not.toBeVisible();
    await expect(page.getByTestId("inspector-wall-details")).not.toBeVisible();
    await expect(page.getByTestId("inspector-furniture-details")).not.toBeVisible();

    // 2. Open floor plan selector dialog and pick a Chinese 2BR plan
    await page.getByTestId("open-plan-selector-btn").click();
    const catalogDialog = page.getByTestId("floor-plan-catalog");
    await expect(catalogDialog).toBeVisible();

    const planId = "plan-cn-sh-ruidong-2br-67";
    const planCard = page.getByTestId(`catalog-plan-card-${planId}`);
    await expect(planCard).toBeVisible();
    await page.getByTestId(`open-plan-btn-${planId}`).click();

    // Modal dialog closes and selected standard plan is loaded
    await expect(catalogDialog).not.toBeVisible();
    await expect(page.getByTestId("floor-plan-room-r1")).toBeVisible();
    await expect(page.getByTestId("floor-plan-room-r2")).toBeVisible();

    // 3. In Plan stage, advance to Room stage with use-plan-btn
    await expect(page.getByTestId("stage-plan-panel")).toBeVisible();
    await expect(page.getByTestId("use-plan-btn")).toBeVisible();
    await page.getByTestId("use-plan-btn").click();

    // 4. Stepper marks Plan completed and Room current
    await expect(roomStep).toHaveAttribute("aria-current", "step");
    await expect(page.getByTestId("stage-room-panel")).toBeVisible();

    // Select target room: pick bedroom (r2 次卧)
    const roomR2 = page.getByTestId("room-item-r2");
    await expect(roomR2).toBeVisible();
    await roomR2.click();
    await expect(roomR2).toHaveAttribute("data-selected", "true");

    // Target room details reflect selection
    await expect(page.getByTestId("target-room-details")).toBeVisible();
    await expect(page.getByTestId("target-room-name")).toContainText("次卧");

    // Advance to Furniture stage
    await page.getByTestId("next-to-furniture-btn").click();

    // 5. Furniture stage: stepper marks Room completed and Furniture current
    await expect(furnitureStep).toHaveAttribute("aria-current", "step");
    await expect(page.getByTestId("stage-furniture-panel")).toBeVisible();

    // Verify bed recommendations appear in target room context (bedroom)
    await expect(page.getByTestId("context-furniture-panel")).toBeVisible();
    const recommendedBed = page.getByTestId("recommended-furniture-bed-double");
    await expect(recommendedBed).toBeVisible();
    await expect(recommendedBed).toContainText("双人床");

    // Pick and add a bed
    await page.getByTestId("add-context-furniture-bed-double").click();

    // 6. Transition to Decision stage: stepper marks Furniture completed and Decision current
    await expect(decisionStep).toHaveAttribute("aria-current", "step");
    await expect(page.getByTestId("stage-decision-panel")).toBeVisible();

    // Verify verdict badge and summary render
    const decisionPanel = page.getByTestId("furniture-decision-panel");
    await expect(decisionPanel).toBeVisible();
    await expect(page.getByTestId("decision-status-badge")).toBeVisible();
    await expect(page.getByTestId("decision-summary")).toBeVisible();

    // Verify target furniture card displays bed details
    await expect(page.getByTestId("decision-target-furniture")).toBeVisible();
    await expect(page.getByTestId("decision-target-furniture-name")).toContainText("双人床");
    await expect(page.getByTestId("decision-target-furniture-dimensions")).toContainText("1800 × 2000 mm");

    // 7. Adjust furniture dimensions or position, verify real-time re-evaluation
    await expect(page.getByTestId("decision-entity-inspector")).toBeVisible();

    // Adjust width using dimension step button or direct input
    const widthInput = page.getByTestId("furniture-width-input");
    await expect(widthInput).toBeVisible();
    await widthInput.fill("1600");
    await page.getByTestId("apply-furniture-btn").click();

    // Verify dimensions re-evaluated and displayed in real time
    await expect(page.getByTestId("decision-target-furniture-dimensions")).toContainText("1600 × 2000 mm");
    await expect(page.getByTestId("decision-dimensions")).toContainText("1600 × 2000 mm");
    await expect(page.getByTestId("decision-status-badge")).toBeVisible();

    // Nudge position using touch/click directional pad
    await page.getByTestId("nudge-furniture-left").click();
    await page.getByTestId("nudge-furniture-up").click();

    // Decision summary and verdict remains responsive and updated
    await expect(page.getByTestId("decision-summary")).toBeVisible();

    // Capture desktop screenshot for visual review
    await page.screenshot({
      path: "test-results/floor-plan-desktop-journey.png",
      fullPage: false,
    });
  });

  test("AC-28: mobile viewport natural growth, responsive canvas, and complete decision flow", async ({
    page,
  }) => {
    // Set standard mobile device viewport (390 x 844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/zh/floor-plan");

    // Verify no horizontal overflow on mobile
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Stepper is visible and horizontally scrollable without breaking viewport
    const stepper = page.getByTestId("floor-plan-stage-stepper");
    await expect(stepper).toBeVisible();

    // Responsive Canvas is visible
    const canvas = page.getByTestId("floor-plan-svg-canvas");
    await expect(canvas).toBeVisible();

    // Mobile bottom step panel is visible, desktop context pane is hidden
    await expect(page.getByTestId("mobile-step-panel")).toBeVisible();
    await expect(page.getByTestId("desktop-context-pane")).not.toBeVisible();

    // Advance through plan stage
    await page.getByTestId("use-plan-btn").click();
    await expect(page.getByTestId("stage-room-panel")).toBeVisible();

    // Pick bedroom on mobile
    const roomR2 = page.getByTestId("room-item-r2");
    await expect(roomR2).toBeVisible();
    await roomR2.click();

    // Advance to furniture stage
    await page.getByTestId("next-to-furniture-btn").click();
    await expect(page.getByTestId("stage-furniture-panel")).toBeVisible();

    // Add bed on mobile
    const addBedBtn = page.getByTestId("add-context-furniture-bed-double");
    await expect(addBedBtn).toBeVisible();
    await addBedBtn.click();

    // Reached decision stage on mobile
    await expect(page.getByTestId("stage-decision-panel")).toBeVisible();
    await expect(page.getByTestId("furniture-decision-panel")).toBeVisible();
    await expect(page.getByTestId("decision-status-badge")).toBeVisible();

    // Verify touch target requirements (minimum 44x44px for primary mobile touch targets)
    const nudgeBtn = page.getByTestId("nudge-furniture-left");
    if (await nudgeBtn.isVisible()) {
      const box = await nudgeBtn.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }

    // Check again no horizontal scroll in decision stage
    const hasHorizontalOverflowEnd = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflowEnd).toBe(false);

    // Capture mobile screenshot for visual review
    await page.screenshot({
      path: "test-results/floor-plan-mobile-journey.png",
      fullPage: false,
    });
  });
});
