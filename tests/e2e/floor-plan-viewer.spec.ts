import { expect, test } from "@playwright/test";

const PLAN_2BR = "plan-cn-sh-ruidong-2br-67";
const PLAN_STUDIO = "plan-cn-sh-weifanger-1br0-36";

test.describe("Floor Plan SVG Viewer & Catalog (Issue #175 & #206)", () => {
  test("AC-1: catalog displays approved standard plans with thumbnail, name, area, room counts, and tags, and opens selected plan", async ({
    page,
  }) => {
    await page.goto("/floor-plan");

    // Page title and layout chrome
    await expect(
      page.getByRole("heading", { level: 1, name: "Floor Plan Space Validator" }),
    ).toBeVisible();

    // Catalog is opened on-demand via selector dialog (AC-1, AC-2)
    await page.getByTestId("open-plan-selector-btn").click();
    const catalog = page.getByTestId("floor-plan-catalog");
    await expect(catalog).toBeVisible();

    // Approved plans in catalog
    const plan2BrCard = page.getByTestId(`catalog-plan-card-${PLAN_2BR}`);
    await expect(plan2BrCard).toBeVisible();
    await expect(page.getByTestId(`plan-name-${PLAN_2BR}`)).toContainText("上海瑞冬小区两居室");
    await expect(page.getByTestId(`plan-id-${PLAN_2BR}`)).toContainText(PLAN_2BR);
    await expect(page.getByTestId(`plan-area-${PLAN_2BR}`)).toBeVisible();
    await expect(page.getByTestId(`plan-rooms-${PLAN_2BR}`)).toBeVisible();
    await expect(page.getByTestId(`plan-tags-${PLAN_2BR}`)).toContainText("2B1L");
    await expect(page.getByTestId(`floor-plan-thumbnail-${PLAN_2BR}`)).toBeVisible();

    // Open a studio-like 1室0厅 plan.
    const studioOpenBtn = page.getByTestId(`open-plan-btn-${PLAN_STUDIO}`);
    await studioOpenBtn.click();

    // Canvas renders rooms from the selected plan.
    await expect(page.getByTestId("floor-plan-room-r1")).toBeVisible();

    // Reopen selector to verify active plan card attribute
    await page.getByTestId("open-plan-selector-btn").click();
    await expect(page.getByTestId(`catalog-plan-card-${PLAN_STUDIO}`)).toHaveAttribute(
      "data-active-plan",
      "true",
    );
  });

  test("AC-3: valid FloorPlan renders walls, ordered room boundaries, openings, and principal dimensions consistently", async ({
    page,
  }) => {
    await page.goto("/floor-plan");

    const canvas = page.getByTestId("floor-plan-svg-canvas");
    await expect(canvas).toBeVisible();

    // 1. Ordered room boundaries (default: 上海瑞冬)
    await expect(page.getByTestId("floor-plan-rooms-layer")).toBeVisible();
    await expect(page.getByTestId("floor-plan-room-r1")).toBeVisible();
    await expect(page.getByTestId("floor-plan-room-r2")).toBeVisible();

    // 2. Structural walls
    await expect(page.getByTestId("floor-plan-walls-layer")).toBeVisible();
    await expect(page.getByTestId("floor-plan-wall-w1")).toBeVisible();
    await expect(page.getByTestId("floor-plan-wall-w6")).toBeVisible();

    // 3. Openings (doors and windows)
    await expect(page.getByTestId("floor-plan-openings-layer")).toBeVisible();
    await expect(page.getByTestId("floor-plan-opening-win1")).toBeVisible();
    await expect(page.getByTestId("floor-plan-opening-d1")).toBeVisible();

    // 4. Furniture layer is present (source plans ship without pre-placed furniture)
    await expect(page.getByTestId("floor-plan-furniture-layer")).toBeVisible();

    // 5. Principal dimensions
    await expect(page.getByTestId("floor-plan-dimensions-layer")).toBeVisible();
    await expect(page.getByTestId("floor-plan-dimension-dim-total-width")).toBeVisible();
    await expect(page.getByTestId("floor-plan-dimension-dim-total-height")).toBeVisible();
  });

  test("AC-4: desktop users can pan, zoom in/out, fit the plan, and select supported entities without page-level overflow", async ({
    page,
  }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/floor-plan");

    // Check no page-level overflow on desktop
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Zoom controls
    const zoomInBtn = page.getByRole("button", { name: "Zoom in" });
    const zoomOutBtn = page.getByRole("button", { name: "Zoom out" });
    const fitBtn = page.getByRole("button", { name: "Fit to view" });
    const zoomBadge = page.getByTestId("zoom-level-badge");

    const initialZoom = await zoomBadge.textContent();

    // Zoom in
    await zoomInBtn.click();
    const zoomedIn = await zoomBadge.textContent();
    expect(zoomedIn).not.toBe(initialZoom);

    // Zoom out
    await zoomOutBtn.click();

    // Fit view
    await fitBtn.click();
    const fittedZoom = await zoomBadge.textContent();
    expect(fittedZoom).toBe(initialZoom);

    // Select entity: wall
    const wall1 = page.getByTestId("floor-plan-wall-w1");
    await wall1.click();
    await expect(wall1).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("selected-structure-banner")).toBeVisible();
    await page.getByTestId("open-structure-tools-btn").click();
    await expect(page.getByTestId("inspector-wall-details")).toBeVisible();
    await page.keyboard.press("Escape");

    // Select entity: opening
    const window1 = page.getByTestId("floor-plan-opening-win1");
    await window1.click();
    await expect(window1).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("selected-structure-banner")).toBeVisible();
    await page.getByTestId("open-structure-tools-btn").click();
    await expect(page.getByTestId("inspector-opening-details")).toBeVisible();
    await page.keyboard.press("Escape");

    // Advance to room stage & select room
    await page.getByTestId("use-plan-btn").click();
    const room1 = page.getByTestId("floor-plan-room-r1");
    await room1.click();
    await expect(room1).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("target-room-details")).toBeVisible();
  });

  test("AC-3: mobile viewport renders plan elements and supports modal plan selector", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/floor-plan");

    // Canvas is visible on mobile
    await expect(page.getByTestId("floor-plan-svg-canvas")).toBeVisible();
    await expect(page.getByTestId("floor-plan-rooms-layer")).toBeVisible();
    await expect(page.getByTestId("floor-plan-walls-layer")).toBeVisible();
    await expect(page.getByTestId("floor-plan-openings-layer")).toBeVisible();
    await expect(page.getByTestId("floor-plan-furniture-layer")).toBeVisible();

    // Save mobile screenshot for visual review
    await page.screenshot({ path: "test-results/floor-plan-mobile.png" });

    // Open catalog in modal selector dialog on mobile
    await page.getByTestId("toolbar-select-plan-btn").click();
    const mobileCatalog = page.getByTestId("floor-plan-catalog");
    await expect(mobileCatalog).toBeVisible();

    // Close catalog selector dialog
    await page.keyboard.press("Escape");
    await expect(mobileCatalog).not.toBeVisible();

    // Workflow stepper & mobile bottom panel are visible
    await expect(page.getByTestId("floor-plan-stage-stepper")).toBeVisible();
    await expect(page.getByTestId("mobile-step-panel")).toBeVisible();
  });

  test("internal route contract: robots meta has noindex, nofollow", async ({
    page,
  }) => {
    await page.goto("/floor-plan");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex,\s*nofollow/i);

    // Save desktop screenshot for visual review
    await page.screenshot({ path: "test-results/floor-plan-desktop.png" });
  });
});
