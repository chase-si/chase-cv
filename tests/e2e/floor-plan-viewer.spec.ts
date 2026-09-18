import { expect, test } from "@playwright/test";

test.describe("Floor Plan SVG Viewer & Catalog (Issue #175)", () => {
  test("AC-1: catalog displays approved standard plans with thumbnail, name, area, room counts, and tags, and opens selected plan", async ({
    page,
  }) => {
    await page.goto("/floor-plan");

    // Page title and layout chrome
    await expect(
      page.getByRole("heading", { level: 1, name: "Floor Plan Space Validator" }),
    ).toBeVisible();

    // Catalog is present
    const catalog = page.getByTestId("floor-plan-catalog");
    await expect(catalog).toBeVisible();

    // Approved plans in catalog
    const plan2BrCard = page.getByTestId("catalog-plan-card-plan-std-2br-01");
    await expect(plan2BrCard).toBeVisible();
    await expect(page.getByTestId("plan-name-plan-std-2br-01")).toContainText(
      "2BR-Nordic-Standard",
    );
    await expect(page.getByTestId("plan-area-plan-std-2br-01")).toContainText("30.0 m²");
    await expect(page.getByTestId("plan-rooms-plan-std-2br-01")).toBeVisible();
    await expect(page.getByTestId("plan-tags-plan-std-2br-01")).toContainText("2B1L");
    await expect(
      page.getByTestId("floor-plan-thumbnail-plan-std-2br-01"),
    ).toBeVisible();

    // Open another standard plan: Modern Compact Studio
    const studioOpenBtn = page.getByTestId("open-plan-btn-plan-std-studio-01");
    await studioOpenBtn.click();

    // Active plan card changes
    await expect(
      page.getByTestId("catalog-plan-card-plan-std-studio-01"),
    ).toHaveAttribute("data-active-plan", "true");

    // Canvas renders Studio rooms
    await expect(page.getByTestId("floor-plan-room-sr1")).toBeVisible();
  });

  test("AC-3: valid FloorPlan renders walls, ordered room boundaries, openings, furniture, and principal dimensions consistently", async ({
    page,
  }) => {
    await page.goto("/floor-plan");

    const canvas = page.getByTestId("floor-plan-svg-canvas");
    await expect(canvas).toBeVisible();

    // 1. Ordered room boundaries
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
    await expect(page.getByTestId("floor-plan-opening-door1")).toBeVisible();

    // 4. Furniture instances
    await expect(page.getByTestId("floor-plan-furniture-layer")).toBeVisible();
    await expect(page.getByTestId("floor-plan-furniture-f1")).toBeVisible();
    await expect(page.getByTestId("floor-plan-furniture-f2")).toBeVisible();

    // 5. Principal dimensions
    await expect(page.getByTestId("floor-plan-dimensions-layer")).toBeVisible();
    await expect(
      page.getByTestId("floor-plan-dimension-dim-total-width"),
    ).toBeVisible();
    await expect(
      page.getByTestId("floor-plan-dimension-dim-total-height"),
    ).toBeVisible();
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

    // Select entity: wall (w5 has no opening on top)
    const wall5 = page.getByTestId("floor-plan-wall-w5");
    await wall5.click();
    await expect(wall5).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("inspector-wall-details")).toBeVisible();
    await expect(page.getByTestId("inspector-wall-details")).toContainText("3000 mm");

    // Select entity: room
    const room1 = page.getByTestId("floor-plan-room-r1");
    await room1.click();
    await expect(room1).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("inspector-room-details")).toBeVisible();
    await expect(page.getByTestId("inspector-room-details")).toContainText("Living Room");

    // Select entity: opening
    const window1 = page.getByTestId("floor-plan-opening-win1");
    await window1.click();
    await expect(window1).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("inspector-opening-details")).toBeVisible();
    await expect(page.getByTestId("inspector-opening-details")).toContainText("1500 mm");

    // Select entity: furniture
    const sofa = page.getByTestId("floor-plan-furniture-f1");
    await sofa.click();
    await expect(sofa).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("inspector-furniture-details")).toBeVisible();
    await expect(page.getByTestId("inspector-furniture-details")).toContainText(
      "sofa-3seat",
    );

    // Deselect entity
    const deselectBtn = page.getByTestId("inspector-deselect-btn");
    await deselectBtn.click();
    await expect(page.getByTestId("inspector-plan-summary")).toBeVisible();
  });

  test("AC-3: mobile viewport renders plan elements and supports tab switching", async ({
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

    // Open catalog in bottom sheet on mobile
    await page.getByTestId("mobile-catalog-btn").click();
    const mobileCatalog = page.getByTestId("mobile-bottom-sheet").getByTestId("floor-plan-catalog");
    await expect(mobileCatalog).toBeVisible();

    // Close catalog bottom sheet
    await page.getByTestId("mobile-bottom-sheet-close").click();

    // Select entity to open details inspector in bottom sheet on mobile
    await page.getByTestId("floor-plan-room-r1").click();
    const mobileInspector = page.getByTestId("mobile-bottom-sheet").getByTestId("floor-plan-inspector");
    await expect(mobileInspector).toBeVisible();
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
