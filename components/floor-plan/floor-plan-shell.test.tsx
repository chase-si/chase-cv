import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryDraftStorage } from "@/lib/floor-plan/draft-storage";
import { createOrResumeUserPlan } from "@/lib/floor-plan/user-plan";
import { validateFloorPlan } from "@/lib/floor-plan/validators";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import {
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
} from "@/lib/floor-plan/fixtures/standard-plans";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";
import type { FloorPlan } from "@/lib/floor-plan/types";
import { FloorPlanShell } from "./floor-plan-shell";

/** Editor fixtures with furniture — used by shell integration tests (catalog UI uses the 50 CN plans). */
const FIXTURE_PLANS = [
  VALID_STANDARD_FLOOR_PLAN,
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
].map((plan) => buildStandardPlanSummary(plan));

// Mock ResizeObserver for jsdom
class MockResizeObserver {
  observe(el: Element) {
    this.callback([
      {
        contentRect: { width: 800, height: 600 },
        target: el,
      },
    ]);
  }
  unobserve() {}
  disconnect() {}
  constructor(private callback: (entries: any[]) => void) {}
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

afterEach(() => {
  cleanup();
});

describe("FloorPlanShell Integration", () => {
  it("renders ToolPageChrome header, 4-stage stepper, 2-pane workspace, and inspector", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "What size bed or sofa fits my home?" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tool-page-chrome")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-stage-stepper")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-viewer-surface")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-inspector")).toBeInTheDocument();
    expect(screen.getByTestId("open-plan-selector-btn")).toBeInTheDocument();
  });

  it("AC-2: browses and selects standard plan from on-demand selector dialog, updating canvas and summary", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    // Catalog is not permanently taking up space in the desktop layout
    expect(screen.queryByTestId("floor-plan-selector-dialog")).not.toBeInTheDocument();

    // Click on-demand selector button
    fireEvent.click(screen.getByTestId("open-plan-selector-btn"));

    // On-demand dialog opens with catalog
    expect(screen.getByTestId("floor-plan-selector-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-catalog")).toBeInTheDocument();
    expect(
      screen.getByTestId("plan-name-floor-plan-std-studio-01"),
    ).toHaveTextContent("Modern Compact Studio");

    // Select Studio plan
    const studioOpenBtn = screen.getByTestId("open-plan-btn-floor-plan-std-studio-01");
    fireEvent.click(studioOpenBtn);

    // Dialog closes
    expect(screen.queryByTestId("floor-plan-selector-dialog")).not.toBeInTheDocument();

    // Header badge and summary update
    expect(screen.getAllByText("Modern Compact Studio").length).toBeGreaterThanOrEqual(1);

    // Canvas renders studio rooms
    expect(screen.getByTestId("floor-plan-room-sr1")).toBeInTheDocument();
  });

  it("AC-26: selects wall on canvas without expanding details in main workflow, and opens details in Advanced Tools", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

    // Initially shows plan summary
    expect(screen.getByTestId("inspector-plan-summary")).toBeInTheDocument();

    // Click on wall w1
    const wall1 = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall1);

    // Default main context panel does NOT expand wall details (AC-26)
    expect(screen.queryByTestId("inspector-wall-details")).not.toBeInTheDocument();
    expect(screen.getByTestId("selected-structure-banner")).toBeInTheDocument();

    // Opens Advanced Tools via shortcut button
    const openStructureBtn = screen.getByTestId("open-structure-tools-btn");
    fireEvent.click(openStructureBtn);

    // Inspector shows wall details inside Advanced Tools dialog
    expect(screen.getByTestId("advanced-tools-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("inspector-wall-details")).toBeInTheDocument();
    expect(screen.getByText("3000 mm")).toBeInTheDocument();

    // Deselect entity closes details inside advanced tools
    const deselectBtn = screen.getByTestId("inspector-deselect-btn");
    fireEvent.click(deselectBtn);

    // Close Advanced Tools
    fireEvent.click(screen.getByTestId("advanced-tools-close-btn"));
    expect(screen.queryByTestId("advanced-tools-dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("inspector-plan-summary")).toBeInTheDocument();
  });

  describe("AC-3: Starting calibration or adding furniture automatically creates User plan while Standard plan remains unchanged", () => {
    it("automatically creates User plan when starting calibration without requiring customize-plan button", async () => {
      const standardPlans = FIXTURE_PLANS;
      const standardPlan = standardPlans[0].plan;
      const initialStandardJson = JSON.stringify(standardPlan);

      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={standardPlans} />);

      // Click "Calibrate Dimensions" directly without clicking customize-plan-btn
      const calibrateBtn = screen.getByTestId("start-calibration-btn");
      fireEvent.click(calibrateBtn);

      // Now automatically in draft mode with user plan: save status badge is shown
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Storage has user draft
      const draft = await storage.getDraft(standardPlans[0].id);
      expect(draft?.meta.source).toBe("user");

      // Edit plan name in inspector
      const nameInput = screen.getByTestId("edit-plan-name-input");
      fireEvent.change(nameInput, { target: { value: "My Modified Custom Suite" } });

      // Check that header displays new name
      await waitFor(() => {
        expect(screen.getAllByText("My Modified Custom Suite").length).toBeGreaterThanOrEqual(1);
      });

      // Ensure the source Standard plan in memory remained byte-for-byte unchanged (AC-3)
      expect(JSON.stringify(standardPlan)).toBe(initialStandardJson);
    });

    it("automatically creates User plan when adding furniture directly without requiring customize-plan button", async () => {
      const standardPlans = FIXTURE_PLANS;
      const standardPlan = standardPlans[0].plan;
      const initialStandardJson = JSON.stringify(standardPlan);

      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={standardPlans} />);

      // Click "Add Furniture" directly without clicking customize-plan-btn
      const addFurnitureBtn = screen.getByTestId("add-furniture-btn");
      fireEvent.click(addFurnitureBtn);

      // Automatically creates user plan and enters draft mode
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Storage has user draft
      const draft = await storage.getDraft(standardPlans[0].id);
      expect(draft?.meta.source).toBe("user");

      // Source standard plan remains byte-for-byte unchanged
      expect(JSON.stringify(standardPlan)).toBe(initialStandardJson);
    });
  });

  describe("AC-15: Autosave, Status Badge, Restore Prompt & Restart", () => {
    it("automatically persists edits into storage with saved status badge", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Start customize
      fireEvent.click(screen.getByTestId("customize-plan-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toHaveTextContent(/saved/i);
      });

      // Verify draft exists in storage
      const draft = await storage.getDraft("floor-plan-std-2b1l-01");
      expect(draft).not.toBeNull();
      expect(draft?.meta.source).toBe("user");

      // Edit name
      const nameInput = screen.getByTestId("edit-plan-name-input");
      fireEvent.change(nameInput, { target: { value: "Autosaved User Plan" } });

      await waitFor(async () => {
        const updatedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(updatedDraft?.meta.name).toBe("Autosaved User Plan");
      });
    });

    it("displays restore prompt banner when standard plan has an existing draft", async () => {
      const storage = new MemoryDraftStorage();
      const standardPlans = FIXTURE_PLANS;
      const template = standardPlans[0].plan;
      const existingDraft = createOrResumeUserPlan(template);
      existingDraft.meta.name = "Pre-existing Stored Draft";
      await storage.saveDraft("floor-plan-std-2b1l-01", existingDraft);

      render(<FloorPlanShell storage={storage} initialPlans={standardPlans} />);

      // Restore prompt banner is visible
      await waitFor(() => {
        expect(screen.getByTestId("draft-restore-banner")).toBeInTheDocument();
        expect(screen.getByTestId("continue-draft-btn")).toBeInTheDocument();
        expect(screen.getByTestId("discard-draft-btn")).toBeInTheDocument();
      });

      // Click "Continue draft"
      fireEvent.click(screen.getByTestId("continue-draft-btn"));

      // Banner closes and draft is loaded
      await waitFor(() => {
        expect(screen.queryByTestId("draft-restore-banner")).not.toBeInTheDocument();
        expect(screen.getAllByText("Pre-existing Stored Draft").length).toBeGreaterThanOrEqual(1);
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });
    });

    it("restarts from template when clicking restart button, removing draft from storage", async () => {
      const storage = new MemoryDraftStorage();
      const standardPlans = FIXTURE_PLANS;
      const template = standardPlans[0].plan;
      const existingDraft = createOrResumeUserPlan(template);
      existingDraft.meta.name = "Draft To Be Discarded";
      await storage.saveDraft("floor-plan-std-2b1l-01", existingDraft);

      render(<FloorPlanShell storage={storage} initialPlans={standardPlans} />);

      // Click "Restart from template" in banner
      await waitFor(() => {
        expect(screen.getByTestId("discard-draft-btn")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId("discard-draft-btn"));

      // Banner gone, draft removed from storage, back to clean template
      await waitFor(async () => {
        expect(screen.queryByTestId("draft-restore-banner")).not.toBeInTheDocument();
        expect(await storage.hasDraft("floor-plan-std-2b1l-01")).toBe(false);
        expect(screen.getAllByText("2BR-Nordic-Standard").length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("AC-7: Skip calibration and proceed to room stage", () => {
    it("allows user to proceed from plan stage to room stage without modifying any dimensions", () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

      // Initially in plan stage
      expect(screen.getByTestId("stage-step-plan")).toHaveAttribute("aria-current", "step");
      expect(screen.getByTestId("stage-plan-panel")).toBeInTheDocument();

      // Skip calibration button is present
      const skipBtn = screen.getByTestId("skip-calibration-btn");
      expect(skipBtn).toBeInTheDocument();

      // Click skip calibration
      fireEvent.click(skipBtn);

      // Successfully advances to room stage
      expect(screen.getByTestId("stage-step-room")).toHaveAttribute("aria-current", "step");
      expect(screen.getByTestId("stage-room-panel")).toBeInTheDocument();

      // Plan stage is now marked completed
      expect(screen.getByTestId("stage-step-plan")).not.toHaveAttribute("aria-current");
    });
  });

  describe("AC-16: Download / Export current User plan as valid JSON", () => {
    it("exports current User plan as JSON that passes canonical validateFloorPlan", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Start customize
      fireEvent.click(screen.getByTestId("customize-plan-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("advanced-tools-btn")).toBeInTheDocument();
      });

      // Open Advanced Tools
      fireEvent.click(screen.getByTestId("advanced-tools-btn"));
      fireEvent.click(screen.getByTestId("advanced-tab-manage"));
      expect(screen.getByTestId("export-json-btn")).toBeInTheDocument();

      // Mock URL.createObjectURL and document.createElement
      const createObjectURLSpy = vi.fn().mockReturnValue("blob:mock-url");
      const revokeObjectURLSpy = vi.fn();
      vi.stubGlobal("URL", {
        createObjectURL: createObjectURLSpy,
        revokeObjectURL: revokeObjectURLSpy,
      });

      // Click Export JSON
      const exportBtn = screen.getByTestId("export-json-btn");
      fireEvent.click(exportBtn);

      expect(createObjectURLSpy).toHaveBeenCalled();
    });
  });

  describe("AC-6 & AC-7: Room Span Editing in FloorPlanShell", () => {
    it("adjusts room span in draft mode, updates canvas room area and dimensions, and autosaves to storage", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // 1. Enter draft mode
      const customizeBtn = screen.getByTestId("customize-plan-btn");
      fireEvent.click(customizeBtn);

      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // 2. Select Living Room (r1) on the canvas
      const roomEl = screen.getByTestId("floor-plan-room-r1");
      fireEvent.click(roomEl);

      // 3. Verify RoomSpanEditor is rendered with current width (3000 mm)
      await waitFor(() => {
        expect(screen.getByTestId("room-span-editor")).toBeInTheDocument();
      });
      const input = screen.getByTestId("target-span-input");
      expect(input).toHaveValue(3000);

      // 4. Change width from 3000 to 3600 mm and apply
      fireEvent.change(input, { target: { value: "3600" } });
      const applyBtn = screen.getByTestId("apply-span-btn");
      fireEvent.click(applyBtn);

      // 5. Verify plan updated and autosaved to storage
      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft).not.toBeNull();
        const v2 = savedDraft?.vertices.find((v) => v.id === "v2");
        expect(v2?.x).toBe(3600);
      });

      // 6. Verify room area badge on canvas updated (3600 * 5000 = 18.0 m²)
      await waitFor(() => {
        expect(screen.getByTestId("floor-plan-room-r1")).toHaveTextContent("18.0 m²");
      });
    });

    it("prevents committing invalid dimension and shows error message without mutating plan in storage", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Select room r1
      fireEvent.click(screen.getByTestId("floor-plan-room-r1"));

      await waitFor(() => {
        expect(screen.getByTestId("room-span-editor")).toBeInTheDocument();
      });

      // Enter invalid dimension below minimum (400 mm)
      const input = screen.getByTestId("target-span-input");
      fireEvent.change(input, { target: { value: "400" } });
      fireEvent.click(screen.getByTestId("apply-span-btn"));

      // Error message is shown
      expect(screen.getByTestId("span-error-alert")).toBeInTheDocument();
      expect(screen.getByTestId("span-error-message")).toHaveTextContent(/at least 600 mm/i);

      // Storage has not been mutated to invalid state
      const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
      const v2 = savedDraft?.vertices.find((v) => v.id === "v2");
      expect(v2?.x).toBe(3000); // Original intact
    });
  });

  describe("AC-9: Move and resize wall-bound openings in draft mode", () => {
    it("edits opening width and position, autosaving the updated User plan", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // 1. Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // 2. Select opening door1 and open structure editor in Advanced Tools (AC-26)
      fireEvent.click(screen.getByTestId("floor-plan-opening-door1"));
      fireEvent.click(screen.getByTestId("open-structure-tools-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("opening-editor")).toBeInTheDocument();
      });

      // 3. Edit width to 1100 mm and position to 0.4
      const widthInput = screen.getByTestId("opening-width-input");
      fireEvent.change(widthInput, { target: { value: "1100" } });

      const positionSlider = screen.getByTestId("opening-position-slider");
      fireEvent.change(positionSlider, { target: { value: "0.4" } });

      // 4. Apply changes
      fireEvent.click(screen.getByTestId("apply-opening-btn"));

      // 5. Verify autosaved in storage
      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft).not.toBeNull();
        const door = savedDraft?.openings.find((o) => o.id === "door1");
        expect(door?.width).toBe(1100);
        expect(door?.position).toBeCloseTo(0.4, 2);
        expect(door?.wallId).toBe("w6");
      });
    });
  });

  describe("AC-10: Browse configured furniture categories and add an item with default dimensions", () => {
    it("opens furniture catalog palette, filters by category, and adds furniture instance", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // 1. Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // 2. Click "Add Furniture" button in inspector
      fireEvent.click(screen.getByTestId("add-furniture-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("furniture-catalog-palette")).toBeInTheDocument();
      });

      // 3. Filter by category "table"
      fireEvent.click(screen.getByTestId("category-filter-table"));

      await waitFor(() => {
        expect(screen.getByTestId("furniture-catalog-card-dining-table-4")).toBeInTheDocument();
      });

      // 4. Click Add
      fireEvent.click(screen.getByTestId("add-furniture-item-dining-table-4"));

      // 5. Verify furniture item added with default dimensions (1400 x 800) and autosaved
      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft).not.toBeNull();
        const added = savedDraft?.furniture.find((f) => f.definitionId === "dining-table-4");
        expect(added).toBeDefined();
        expect(added?.width).toBe(1400);
        expect(added?.depth).toBe(800);
        expect(added?.rotation).toBe(0);
      });
    });
  });

  describe("AC-11: Manipulate furniture: rotate 90°, resize with limits/preview, and delete", () => {
    it("rotates, resizes with immediate preview, and deletes furniture", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // 1. Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // 2. Select existing sofa f1
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f1"));

      await waitFor(() => {
        expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();
      });

      // 3. Rotate 90°
      fireEvent.click(screen.getByTestId("rotate-furniture-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        const sofa = savedDraft?.furniture.find((f) => f.id === "f1");
        expect(sofa?.rotation).toBe(90);
      });

      // 4. Resize width from 2100 to 2200 and depth to 950
      const widthInput = screen.getByTestId("furniture-width-input");
      fireEvent.change(widthInput, { target: { value: "2200" } });

      const depthInput = screen.getByTestId("furniture-depth-input");
      fireEvent.change(depthInput, { target: { value: "950" } });

      // Immediate preview
      fireEvent.click(screen.getByTestId("preview-furniture-btn"));
      expect(screen.getByTestId("furniture-preview-details")).toBeInTheDocument();
      expect(screen.getByTestId("preview-furniture-dimensions")).toHaveTextContent("2200 × 950 mm");

      // Apply resize
      fireEvent.click(screen.getByTestId("apply-furniture-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        const sofa = savedDraft?.furniture.find((f) => f.id === "f1");
        expect(sofa?.width).toBe(2200);
        expect(sofa?.depth).toBe(950);
      });

      // 5. Delete furniture
      fireEvent.click(screen.getByTestId("delete-furniture-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft?.furniture.some((f) => f.id === "f1")).toBe(false);
      });
    });
  });

  describe("AC-8: Undo and Redo all committed plan edits in FloorPlanShell", () => {
    it("renders undo and redo buttons with disabled states initially, enabling undo upon mutation", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("undo-btn")).toBeInTheDocument();
        expect(screen.getByTestId("redo-btn")).toBeInTheDocument();
      });

      // Initially both undo and redo are disabled
      expect(screen.getByTestId("undo-btn")).toBeDisabled();
      expect(screen.getByTestId("redo-btn")).toBeDisabled();

      // Perform a mutation (edit plan name)
      const nameInput = screen.getByTestId("edit-plan-name-input");
      fireEvent.change(nameInput, { target: { value: "New Custom Suite" } });

      // Undo should become enabled, redo remains disabled
      await waitFor(() => {
        expect(screen.getByTestId("undo-btn")).not.toBeDisabled();
        expect(screen.getByTestId("redo-btn")).toBeDisabled();
      });

      // Click Undo
      fireEvent.click(screen.getByTestId("undo-btn"));

      // Plan reverted, undo becomes disabled, redo becomes enabled
      await waitFor(() => {
        expect(screen.getByTestId("undo-btn")).toBeDisabled();
        expect(screen.getByTestId("redo-btn")).not.toBeDisabled();
      });

      // Click Redo
      fireEvent.click(screen.getByTestId("redo-btn"));

      // Plan restored, undo becomes enabled, redo becomes disabled
      await waitFor(() => {
        expect(screen.getByTestId("undo-btn")).not.toBeDisabled();
        expect(screen.getByTestId("redo-btn")).toBeDisabled();
      });
    });

    it("undoes and redoes room span adjustments and keeps storage persistence in sync", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Select Living Room (r1)
      fireEvent.click(screen.getByTestId("floor-plan-room-r1"));
      await waitFor(() => {
        expect(screen.getByTestId("room-span-editor")).toBeInTheDocument();
      });

      // Adjust span to 3600 mm and apply
      const input = screen.getByTestId("target-span-input");
      fireEvent.change(input, { target: { value: "3600" } });
      fireEvent.click(screen.getByTestId("apply-span-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft?.vertices.find((v) => v.id === "v2")?.x).toBe(3600);
      });

      // Click Undo
      fireEvent.click(screen.getByTestId("undo-btn"));

      // Vertex x should be reverted to 3000 in storage and room display
      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft?.vertices.find((v) => v.id === "v2")?.x).toBe(3000);
        expect(screen.getByTestId("floor-plan-room-r1")).toHaveTextContent("15.0 m²");
      });

      // Click Redo
      fireEvent.click(screen.getByTestId("redo-btn"));

      // Vertex x should be restored to 3600
      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft?.vertices.find((v) => v.id === "v2")?.x).toBe(3600);
        expect(screen.getByTestId("floor-plan-room-r1")).toHaveTextContent("18.0 m²");
      });
    });

    it("undoes and redoes opening move and resize operations", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Select opening door1 and open structure editor in Advanced Tools (AC-26)
      fireEvent.click(screen.getByTestId("floor-plan-opening-door1"));
      fireEvent.click(screen.getByTestId("open-structure-tools-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("opening-editor")).toBeInTheDocument();
      });

      // Change width to 1100 and apply
      const widthInput = screen.getByTestId("opening-width-input");
      fireEvent.change(widthInput, { target: { value: "1100" } });
      fireEvent.click(screen.getByTestId("apply-opening-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft?.openings.find((o) => o.id === "door1")?.width).toBe(1100);
      });

      // Undo
      fireEvent.click(screen.getByTestId("undo-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft?.openings.find((o) => o.id === "door1")?.width).toBe(900);
      });

      // Redo
      fireEvent.click(screen.getByTestId("redo-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(savedDraft?.openings.find((o) => o.id === "door1")?.width).toBe(1100);
      });
    });

    it("undoes and redoes furniture manipulation operations (rotate, delete)", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Select sofa f1
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f1"));
      await waitFor(() => {
        expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();
      });

      // Rotate 90
      fireEvent.click(screen.getByTestId("rotate-furniture-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Delete sofa f1
      fireEvent.click(screen.getByTestId("delete-furniture-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.some((f) => f.id === "f1")).toBe(false);
      });

      // Undo 1: Un-delete sofa f1
      fireEvent.click(screen.getByTestId("undo-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        const sofa = saved?.furniture.find((f) => f.id === "f1");
        expect(sofa).toBeDefined();
        expect(sofa?.rotation).toBe(90);
      });

      // Undo 2: Un-rotate sofa f1 back to 0
      fireEvent.click(screen.getByTestId("undo-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        const sofa = saved?.furniture.find((f) => f.id === "f1");
        expect(sofa?.rotation).toBe(0);
      });

      // Redo 1: Re-rotate sofa f1 to 90
      fireEvent.click(screen.getByTestId("redo-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Redo 2: Re-delete sofa f1
      fireEvent.click(screen.getByTestId("redo-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.some((f) => f.id === "f1")).toBe(false);
      });
    });

    it("triggers undo and redo via keyboard shortcuts (Cmd+Z / Ctrl+Z and Cmd+Shift+Z / Ctrl+Shift+Z / Ctrl+Y)", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Select sofa f1 and rotate
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f1"));
      await waitFor(() => {
        expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId("rotate-furniture-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Press Cmd+Z to undo
      fireEvent.keyDown(window, { key: "z", metaKey: true });

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(0);
      });

      // Press Cmd+Shift+Z to redo
      fireEvent.keyDown(window, { key: "z", metaKey: true, shiftKey: true });

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Press Ctrl+Z to undo
      fireEvent.keyDown(window, { key: "z", ctrlKey: true });

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(0);
      });

      // Press Ctrl+Y to redo
      fireEvent.keyDown(window, { key: "y", ctrlKey: true });

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });
    });

    it("does not trigger plan undo via shortcut when focused inside an input element", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Select sofa f1 and rotate
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f1"));
      await waitFor(() => {
        expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId("rotate-furniture-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Focus an input element (e.g. width input)
      const input = screen.getByTestId("furniture-width-input");
      input.focus();

      // Trigger Cmd+Z while input is active element
      fireEvent.keyDown(input, { key: "z", metaKey: true });

      // Plan should NOT have undone
      const saved = await storage.getDraft("floor-plan-std-2b1l-01");
      expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
    });

    it("creates exactly one history entry for a continuous pointer drag gesture", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      const sofaEl = screen.getByTestId("floor-plan-furniture-f1");
      const svgSurface = screen.getByTestId("floor-plan-svg-canvas");

      // Pointer down on sofa
      fireEvent.pointerDown(sofaEl, { clientX: 100, clientY: 100 });

      // Multiple continuous pointermove events during drag
      for (let i = 1; i <= 10; i++) {
        fireEvent.pointerMove(svgSurface, { clientX: 100 + i * 10, clientY: 100 + i * 5 });
      }

      // Pointer up completes gesture
      fireEvent.pointerUp(svgSurface, { clientX: 200, clientY: 150 });

      // Exactly ONE undo operation is needed to revert the move
      await waitFor(() => {
        expect(screen.getByTestId("undo-btn")).not.toBeDisabled();
      });

      fireEvent.click(screen.getByTestId("undo-btn"));

      // Undo button should now be disabled (only 1 entry was created)
      await waitFor(() => {
        expect(screen.getByTestId("undo-btn")).toBeDisabled();
      });
    });
  });

  describe("AC-12 & AC-14: Report furniture boundary and overlap violations in FloorPlanShell", () => {
    it("reports violations via header badge, inspector panel, and canvas indicators", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Switch to studio plan (which has 0 violations initially)
      fireEvent.click(screen.getByTestId("open-plan-selector-btn"));
      fireEvent.click(screen.getByTestId("catalog-plan-card-floor-plan-std-studio-01"));

      // Customize plan into editable draft
      fireEvent.click(screen.getByTestId("customize-plan-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Studio plan initially clean: inspect rules in Advanced Tools (AC-26)
      expect(screen.queryByTestId("shell-violations-badge")).not.toBeInTheDocument();
      fireEvent.click(screen.getByTestId("advanced-tools-btn"));
      expect(screen.getByTestId("rule-clean-state")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("advanced-tools-close-btn"));

      // Add furniture item from catalog that overlaps existing furniture
      fireEvent.click(screen.getByTestId("add-furniture-btn"));
      const addTableBtn = screen.getByTestId("add-furniture-item-dining-table-4");
      fireEvent.click(addTableBtn);

      // Violations should now be detected deterministically
      await waitFor(() => {
        expect(screen.getByTestId("shell-violations-badge")).toBeInTheDocument();
      });

      // Clicking toolbar violations badge opens Advanced Tools on rules tab (AC-26)
      fireEvent.click(screen.getByTestId("shell-violations-badge"));
      expect(screen.getByTestId("rule-violations-count-badge")).toBeInTheDocument();

      // Clicking affected entity button in rule panel selects that entity
      const affectedBtn = screen.getAllByTestId(/^rule-entity-btn-/)[0];
      expect(affectedBtn).toBeDefined();
      fireEvent.click(affectedBtn);

      expect(screen.getByTestId("inspector-deselect-btn")).toBeInTheDocument();
    });
  });

  describe("AC-8: Target Room Selection Synchronized Between Canvas and Room List", () => {
    it("sets the same target room from canvas click or room list item, synchronously reflecting highlight, name, area, and main spans", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

      // Room list is rendered
      expect(screen.getByTestId("room-list")).toBeInTheDocument();
      expect(screen.getByTestId("room-item-r1")).toBeInTheDocument();
      expect(screen.getByTestId("room-item-r2")).toBeInTheDocument();

      // 1. Click room-item-r2 in room list (Master Bedroom)
      fireEvent.click(screen.getByTestId("room-item-r2"));

      // Canvas room r2 is highlighted
      const canvasRoom2 = screen.getByTestId("floor-plan-room-r2");
      expect(canvasRoom2).toHaveAttribute("data-selected", "true");

      // Room item r2 is marked selected
      expect(screen.getByTestId("room-item-r2")).toHaveAttribute("data-selected", "true");

      // Target room details in panel synchronously reflect Master Bedroom
      expect(screen.getByTestId("target-room-name")).toHaveTextContent("Master Bedroom");
      expect(screen.getByTestId("target-room-area")).toHaveTextContent("15.0 m²");
      expect(screen.getByTestId("target-room-spans")).toBeInTheDocument();
      expect(screen.getByTestId("target-room-spans")).toHaveTextContent("3000");
      expect(screen.getByTestId("target-room-spans")).toHaveTextContent("5000");

      // 2. Click canvas room r1 (Living Room)
      const canvasRoom1 = screen.getByTestId("floor-plan-room-r1");
      fireEvent.click(canvasRoom1);

      // Canvas room r1 is now highlighted, r2 is not
      expect(canvasRoom1).toHaveAttribute("data-selected", "true");
      expect(canvasRoom2).toHaveAttribute("data-selected", "false");

      // Room list item r1 is selected, r2 is not
      expect(screen.getByTestId("room-item-r1")).toHaveAttribute("data-selected", "true");
      expect(screen.getByTestId("room-item-r2")).toHaveAttribute("data-selected", "false");

      // Target room details now reflect Living Room
      expect(screen.getByTestId("target-room-name")).toHaveTextContent("Living Room");
      expect(screen.getByTestId("target-room-area")).toHaveTextContent("15.0 m²");
      expect(screen.getByTestId("target-room-spans")).toHaveTextContent("3000");
      expect(screen.getByTestId("target-room-spans")).toHaveTextContent("5000");
    });
  });

  describe("AC-5: Room Span Modification in Plan Stage", () => {
    it("allows viewing and modifying width/depth in plan stage, synchronously updating dimensions, area, canvas, and draft in storage", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // In plan stage
      expect(screen.getByTestId("stage-step-plan")).toHaveAttribute("aria-current", "step");

      // Select Living Room (r1) via room list
      fireEvent.click(screen.getByTestId("room-item-r1"));

      // Shows target room info and RoomSpanEditor
      expect(screen.getByTestId("target-room-name")).toHaveTextContent("Living Room");
      expect(screen.getByTestId("target-room-area")).toHaveTextContent("15.0 m²");
      expect(screen.getByTestId("room-span-editor")).toBeInTheDocument();

      const input = screen.getByTestId("target-span-input");
      expect(input).toHaveValue(3000);

      // Change width to 3600 mm and apply
      fireEvent.change(input, { target: { value: "3600" } });
      fireEvent.click(screen.getByTestId("apply-span-btn"));

      // Plan, area, canvas, and draft update synchronously
      await waitFor(async () => {
        expect(screen.getByTestId("target-room-area")).toHaveTextContent("18.0 m²");
        expect(screen.getByTestId("floor-plan-room-r1")).toHaveTextContent("18.0 m²");
        const draft = await storage.getDraft("floor-plan-std-2b1l-01");
        expect(draft?.meta.source).toBe("user");
        expect(draft?.vertices.find((v) => v.id === "v2")?.x).toBe(3600);
      });
    });
  });

  describe("AC-6: Invalid Room Span Adjustments Rejected", () => {
    it("displays readable error reason and does not modify canvas, history, or saved draft", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Select room r1
      fireEvent.click(screen.getByTestId("room-item-r1"));

      const input = screen.getByTestId("target-span-input");
      // Enter invalid span < 600 mm
      fireEvent.change(input, { target: { value: "400" } });
      fireEvent.click(screen.getByTestId("apply-span-btn"));

      // Error message is displayed
      expect(screen.getByTestId("span-error-alert")).toBeInTheDocument();
      expect(screen.getByTestId("span-error-message")).toHaveTextContent(/at least 600 mm/i);

      // Canvas room remains at 15.0 m²
      expect(screen.getByTestId("floor-plan-room-r1")).toHaveTextContent("15.0 m²");

      // Storage has not been corrupted or saved with invalid coordinates
      expect(await storage.hasDraft("floor-plan-std-2b1l-01")).toBe(false);
      const draft = await storage.getDraft("floor-plan-std-2b1l-01");
      expect(draft).toBeNull();

      // Undo button is not rendered or disabled (no history committed)
      const undoBtn = screen.queryByTestId("undo-btn");
      if (undoBtn) {
        expect(undoBtn).toBeDisabled();
      }
    });
  });

  describe("AC-9: Switching Target Room Clears Previous Target Furniture and Returns to Furniture Stage", () => {
    it("clears old target furniture and transitions back to furniture stage when user switches target room", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

      // Select room r1 (Living Room)
      fireEvent.click(screen.getByTestId("room-item-r1"));

      // Skip calibration or proceed to room stage
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      expect(screen.getByTestId("stage-step-room")).toHaveAttribute("aria-current", "step");

      // In room stage, proceed to furniture stage
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      expect(screen.getByTestId("stage-step-furniture")).toHaveAttribute("aria-current", "step");

      // Select sofa f1 in room r1 as target furniture
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f1"));

      // Proceed to decision stage
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));
      expect(screen.getByTestId("stage-step-decision")).toHaveAttribute("aria-current", "step");

      // Now switch target room to r2 (Master Bedroom) by clicking canvas room r2
      fireEvent.click(screen.getByTestId("floor-plan-room-r2"));

      // AC-9: Flow returns to furniture selection stage for the new room
      expect(screen.getByTestId("stage-step-furniture")).toHaveAttribute("aria-current", "step");
      expect(screen.getByTestId("stage-furniture-panel")).toBeInTheDocument();

      // Target room is now r2
      expect(screen.getByTestId("room-item-r2")).toHaveAttribute("data-selected", "true");
      expect(screen.getByTestId("floor-plan-room-r2")).toHaveAttribute("data-selected", "true");
    });
  });

  describe("Issue #201: Add Room Context Furniture & Establish Target (AC-10, AC-11, AC-12, AC-13, AC-22)", () => {
    it("AC-10: displays bed options and default dimensions when target room is master_bedroom or bedroom", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

      // Select Master Bedroom (r2)
      fireEvent.click(screen.getByTestId("room-item-r2"));

      // Skip calibration to room stage
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));

      // Next to furniture stage
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      expect(screen.getByTestId("stage-step-furniture")).toHaveAttribute("aria-current", "step");

      // Context furniture panel displays recommended bed options
      expect(screen.getByTestId("context-furniture-panel")).toBeInTheDocument();
      expect(screen.getByTestId("recommended-furniture-bed-double")).toBeInTheDocument();
      expect(screen.getByTestId("recommended-furniture-bed-single")).toBeInTheDocument();

      // Displays default dimensions
      expect(screen.getByTestId("furniture-default-size-bed-double")).toHaveTextContent("1800 × 2000 mm");
      expect(screen.getByTestId("furniture-default-size-bed-single")).toHaveTextContent("1200 × 2000 mm");
    });

    it("AC-11: displays sofa options and default dimensions when target room is living_room", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

      // Select Living Room (r1)
      fireEvent.click(screen.getByTestId("room-item-r1"));

      // Skip calibration to room stage
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));

      // Next to furniture stage
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      expect(screen.getByTestId("stage-step-furniture")).toHaveAttribute("aria-current", "step");

      // Context furniture panel displays recommended sofa options
      expect(screen.getByTestId("context-furniture-panel")).toBeInTheDocument();
      expect(screen.getByTestId("recommended-furniture-sofa-3seat")).toBeInTheDocument();
      expect(screen.getByTestId("recommended-furniture-sofa-2seat")).toBeInTheDocument();

      // Displays default dimensions
      expect(screen.getByTestId("furniture-default-size-sofa-3seat")).toHaveTextContent("2100 × 900 mm");
      expect(screen.getByTestId("furniture-default-size-sofa-2seat")).toHaveTextContent("1500 × 850 mm");
    });

    it("AC-12: enters full furniture catalog from context recommendation and adds any definition", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Select Living Room (r1)
      fireEvent.click(screen.getByTestId("room-item-r1"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

      // Click "Browse Full Catalog" button in ContextFurniturePanel
      const browseCatalogBtn = screen.getByTestId("browse-full-catalog-btn");
      expect(browseCatalogBtn).toBeInTheDocument();
      fireEvent.click(browseCatalogBtn);

      // Furniture catalog dialog opens
      await waitFor(() => {
        expect(screen.getByTestId("furniture-catalog-dialog")).toBeInTheDocument();
      });

      // Filter by category "table"
      fireEvent.click(screen.getByTestId("category-filter-table"));
      expect(screen.getByTestId("furniture-catalog-card-dining-table-4")).toBeInTheDocument();

      // Add dining table (4-seat) from catalog
      fireEvent.click(screen.getByTestId("add-furniture-item-dining-table-4"));

      // Dialog closes and transitions to decision stage
      await waitFor(() => {
        expect(screen.queryByTestId("furniture-catalog-dialog")).not.toBeInTheDocument();
        expect(screen.getByTestId("stage-step-decision")).toHaveAttribute("aria-current", "step");
        expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();
        expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("1400 × 800 mm");
      });

      // Persisted to storage as User plan
      const draft = await storage.getDraft("floor-plan-std-2b1l-01");
      expect(draft?.meta.source).toBe("user");
      const addedTable = draft?.furniture.find((f) => f.definitionId === "dining-table-4");
      expect(addedTable).toBeDefined();
    });

    it("AC-13: adds furniture with deterministic initial drop position, creates valid instance, saves to User plan, and sets as active target", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={FIXTURE_PLANS} />);

      // Select Master Bedroom (r2)
      fireEvent.click(screen.getByTestId("room-item-r2"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

      // Add double bed from context recommendations
      const addBedBtn = screen.getByTestId("add-context-furniture-bed-double");
      fireEvent.click(addBedBtn);

      // Automatically transitions to decision stage (AC-13)
      await waitFor(() => {
        expect(screen.getByTestId("stage-step-decision")).toHaveAttribute("aria-current", "step");
      });

      // Validates User plan in storage
      const draft = await storage.getDraft("floor-plan-std-2b1l-01");
      expect(draft).not.toBeNull();
      expect(draft?.meta.source).toBe("user");

      const validation = validateFloorPlan(draft);
      expect(validation.ok).toBe(true);

      // Deterministic initial placement: room r2 centroid is (4500, 2500)
      const addedBed = draft?.furniture.find((f) => f.id !== "f2" && f.definitionId === "bed-double");
      expect(addedBed).toBeDefined();
      expect(addedBed?.x).toBe(4500);
      expect(addedBed?.y).toBe(2500);
      expect(addedBed?.width).toBe(1800);
      expect(addedBed?.depth).toBe(2000);
      expect(addedBed?.rotation).toBe(0);

      // Decision panel displays the new bed as sole target
      expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();
      expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("1800 × 2000 mm");
    });

    it("AC-22: changing floor plan clears old room and target furniture and returns to room selection stage", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

      // 1. Select room r1 (Living Room)
      fireEvent.click(screen.getByTestId("room-item-r1"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

      // 2. Select sofa f1 as target furniture and advance to decision
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f1"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));
      expect(screen.getByTestId("stage-step-decision")).toHaveAttribute("aria-current", "step");
      expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();

      // 3. Switch floor plan to Studio via toolbar
      fireEvent.click(screen.getByTestId("toolbar-select-plan-btn"));
      fireEvent.click(screen.getByTestId("open-plan-btn-floor-plan-std-studio-01"));

      // AC-22: Switching floor plan clears old room & target furniture and returns to room stage
      expect(screen.getByTestId("stage-step-room")).toHaveAttribute("aria-current", "step");
      expect(screen.getByTestId("stage-room-panel")).toBeInTheDocument();

      // No target room or furniture is selected for the new plan yet
      expect(screen.queryByTestId("target-room-details")).not.toBeInTheDocument();
      expect(screen.queryByTestId("decision-target-furniture")).not.toBeInTheDocument();
    });

    it("AC-22: changing target furniture makes new furniture the sole target driving main decision", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} />);

      // Select Living Room (r1)
      fireEvent.click(screen.getByTestId("room-item-r1"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

      // Select sofa f1 as initial target furniture
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f1"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));

      expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();
      expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("2100 × 900 mm");

      // Now click double bed f2 on canvas to change target furniture
      const bedF2 = screen.getByTestId("floor-plan-furniture-f2");
      fireEvent.click(bedF2);

      // New furniture becomes the sole target driving main decision
      await waitFor(() => {
        expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("1800 × 2000 mm");
      });
    });

    it("renders context furniture in Chinese (zh) without dictionary missing keys", async () => {
      render(<FloorPlanShell locale="zh" initialPlans={FIXTURE_PLANS} />);

      fireEvent.click(screen.getByTestId("room-item-r2"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

      expect(screen.getByTestId("context-furniture-panel")).toBeInTheDocument();
      expect(screen.getByText("推荐床类选项")).toBeInTheDocument();
      expect(screen.getByTestId("browse-full-catalog-btn")).toHaveTextContent("浏览完整家具目录");
    });
  });

  describe("Issue #202: Transform Spatial Rules into Furniture Decision (AC-14, AC-15, AC-16, AC-17)", () => {
    it("AC-14 & AC-15: displays 'suitable' decision with room name, furniture name, dimensions, and qualified copy", async () => {
      const cleanPlan: FloorPlan = {
        version: 1,
        unit: "mm",
        meta: {
          id: "clean-suitable-plan",
          name: "Clean Bedroom Plan",
          source: "template",
          isStandard: true,
          createdAt: "2026-09-18T00:00:00.000Z",
          updatedAt: "2026-09-18T00:00:00.000Z",
        },
        vertices: [
          { id: "v1", x: 0, y: 0 },
          { id: "v2", x: 5000, y: 0 },
          { id: "v3", x: 5000, y: 5000 },
          { id: "v4", x: 0, y: 5000 },
        ],
        walls: [
          { id: "w1", from: "v1", to: "v2", thickness: 200, lockAxis: "horizontal" },
          { id: "w2", from: "v2", to: "v3", thickness: 200, lockAxis: "vertical" },
          { id: "w3", from: "v3", to: "v4", thickness: 200, lockAxis: "horizontal" },
          { id: "w4", from: "v4", to: "v1", thickness: 200, lockAxis: "vertical" },
        ],
        openings: [
          {
            id: "win1",
            type: "window",
            wallId: "w1",
            position: 0.5,
            width: 1500,
            height: 1400,
          },
          {
            id: "door1",
            type: "door",
            wallId: "w4",
            position: 0.2,
            width: 900,
            height: 2100,
          },
        ],
        rooms: [
          {
            id: "r1",
            type: "bedroom",
            name: "Master Bedroom",
            boundaryWallIds: ["w1", "w2", "w3", "w4"],
          },
        ],
        furniture: [
          {
            id: "f1",
            definitionId: "bed-double",
            x: 3000,
            y: 3000,
            width: 1800,
            depth: 2000,
            rotation: 0,
          },
        ],
      };

      render(<FloorPlanShell initialActivePlan={cleanPlan} locale="zh" />);

      // Select Master Bedroom (r1)
      fireEvent.click(screen.getByTestId("room-item-r1"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

      // Select double bed f1 and advance to decision stage
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f1"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));

      expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();

      // AC-14: Four mutually exclusive states (suitable in clean state)
      expect(screen.getByTestId("decision-status-badge")).toHaveTextContent("适合");
      expect(screen.getByTestId("decision-status-suitable")).toBeInTheDocument();

      // AC-15: Room name, furniture name, width & depth mm
      const title = screen.getByTestId("decision-title");
      expect(title).toHaveTextContent("1800 × 2000 mm");

      const summary = screen.getByTestId("decision-summary");
      expect(summary).toHaveTextContent("当前规则未发现问题");
      expect(summary).toHaveTextContent("1800 × 2000 mm");

      // AC-15: Disclaimer prevents construction / safety guarantee misinterpretation
      const disclaimer = screen.getByTestId("decision-disclaimer");
      expect(disclaimer).toHaveTextContent("不构成施工");
      expect(disclaimer).toHaveTextContent("安全保证");
    });

    it("AC-14: uncalibrated floor plan displays 'unavailable' without implying clearance passes", async () => {
      const uncalibratedPlan: FloorPlan = {
        ...VALID_STANDARD_FLOOR_PLAN,
        meta: {
          ...VALID_STANDARD_FLOOR_PLAN.meta,
          id: "uncalibrated-plan-test",
          unscaled: true,
        },
      };

      render(<FloorPlanShell initialActivePlan={uncalibratedPlan} locale="zh" />);

      // Advance to decision stage with bed f2
      fireEvent.click(screen.getByTestId("room-item-r2"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f2"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));

      expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();
      expect(screen.getByTestId("decision-status-badge")).toHaveTextContent("暂无法判断");
      expect(screen.getByTestId("decision-status-unavailable")).toBeInTheDocument();

      const summary = screen.getByTestId("decision-summary");
      expect(summary).toHaveTextContent("尚未标定");
      expect(summary).not.toHaveTextContent("净距已通过");
    });

    it("AC-16 & AC-17: displays prioritized relevant issues with measured/recommended values and allows clicking affected entity to open adjustment interface", async () => {
      render(<FloorPlanShell initialActivePlan={VALID_STANDARD_FLOOR_PLAN} locale="zh" />);

      // Navigate to furniture stage with Master Bedroom (r2)
      fireEvent.click(screen.getByTestId("room-item-r2"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

      // Select double bed f2 and advance to decision
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f2"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));

      expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();

      // In decision stage, click target furniture f2 on canvas to inspect/adjust it
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f2"));

      // AC-17: Opens applicable adjustment interface (FurnitureEditor inside decision-entity-inspector)
      await waitFor(() => {
        expect(screen.getByTestId("decision-entity-inspector")).toBeInTheDocument();
        expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();
      });

      // Increase bed width significantly (from 1800 to 4500) so it collides with walls
      const widthInput = screen.getByTestId("furniture-width-input");
      fireEvent.change(widthInput, { target: { value: "4500" } });
      fireEvent.click(screen.getByTestId("apply-furniture-btn"));

      // AC-14: Decision updates in real time to "not-recommended" ("不建议")
      await waitFor(() => {
        expect(screen.getByTestId("decision-status-badge")).toHaveTextContent("不建议");
        expect(screen.getByTestId("decision-status-not-recommended")).toBeInTheDocument();
      });

      // AC-16: Prioritized relevant issues list with readable message, measured & recommended values
      expect(screen.getByTestId("decision-issues-list")).toBeInTheDocument();
      const collisionIssues = screen.getAllByTestId("decision-issue-furniture-wall-collision");
      expect(collisionIssues.length).toBeGreaterThan(0);
      expect(screen.getAllByTestId("decision-measured-furniture-wall-collision")[0]).toBeInTheDocument();
      expect(screen.getAllByTestId("decision-recommended-furniture-wall-collision")[0]).toHaveTextContent("0 mm²");

      // AC-17: Clicking an affected entity button in decision panel (e.g. wall w7) focuses wall in inspector
      const wallBtn = screen.getByTestId("decision-entity-btn-w7");
      expect(wallBtn).toBeInTheDocument();
      fireEvent.click(wallBtn);

      await waitFor(() => {
        expect(screen.getByTestId("inspector-wall-details")).toBeInTheDocument();
      });

      // Deselecting entity closes inspector
      const closeBtn = screen.getByText("收起调整");
      fireEvent.click(closeBtn);
      expect(screen.queryByTestId("decision-entity-inspector")).not.toBeInTheDocument();
      expect(screen.getByTestId("furniture-decision-panel")).toBeInTheDocument();
    });
  });

  describe("Issue #203: Realtime Re-Evaluation and History Persistence (AC-18, AC-19, AC-20, AC-21)", () => {
    it("AC-18: updates canvas, draft, and decision verdict in the same interaction after submitting legal width/depth without requiring explicit re-test button", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialActivePlan={VALID_STANDARD_FLOOR_PLAN} locale="zh" />);

      // Navigate to decision stage with Master Bedroom (r2) and double bed f2 (1800 × 2000 mm)
      fireEvent.click(screen.getByTestId("room-item-r2"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f2"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));

      expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("1800 × 2000 mm");

      // Verify no "重新检测" / "re-test" button exists
      expect(screen.queryByRole("button", { name: /重新检测|re-test|re-evaluate/i })).not.toBeInTheDocument();

      // Open furniture editor via tune-target-furniture-btn on decision card
      fireEvent.click(screen.getByTestId("tune-target-furniture-btn"));
      expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();

      // Change bed width to legal value 2000 mm (bed-double range: [1500, 2000])
      const widthInput = screen.getByTestId("furniture-width-input");
      fireEvent.change(widthInput, { target: { value: "2000" } });
      fireEvent.click(screen.getByTestId("apply-furniture-btn"));

      // Canvas, Draft, and Verdict update immediately in the same interaction
      await waitFor(async () => {
        // 1. Decision panel verdict and dimensions updated
        expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("2000 × 2000 mm");
        expect(screen.getByTestId("decision-title")).toHaveTextContent("2000 × 2000 mm");
        expect(screen.getByTestId("decision-summary")).toHaveTextContent("2000 × 2000 mm");

        // 2. Draft in storage updated
        const draft = await storage.getDraft("floor-plan-std-2b1l-01");
        const bed = draft?.furniture.find((f) => f.id === "f2");
        expect(bed?.width).toBe(2000);
      });

      // Still no re-check button needed or clicked
      expect(screen.queryByRole("button", { name: /重新检测|re-test|re-evaluate/i })).not.toBeInTheDocument();
    });

    it("AC-19: displays readable error for out-of-bounds dimensions without mutating furniture instance, verdict, or draft", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialActivePlan={VALID_STANDARD_FLOOR_PLAN} locale="zh" />);

      // Navigate to decision stage with Master Bedroom (r2) and double bed f2 (1800 × 2000 mm)
      fireEvent.click(screen.getByTestId("room-item-r2"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f2"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));

      const initialDecisionSummary = screen.getByTestId("decision-summary").textContent;
      const initialDimensions = screen.getByTestId("decision-target-furniture-dimensions").textContent;

      // Open target furniture editor
      fireEvent.click(screen.getByTestId("tune-target-furniture-btn"));
      expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();

      // Enter out-of-bounds width (e.g. 1200 mm, below minimum 1500 mm for bed-double)
      const widthInput = screen.getByTestId("furniture-width-input");
      fireEvent.change(widthInput, { target: { value: "1200" } });
      fireEvent.click(screen.getByTestId("apply-furniture-btn"));

      // AC-19: Displays readable error message
      expect(screen.getByTestId("furniture-error-alert")).toBeInTheDocument();
      expect(screen.getByTestId("furniture-error-message")).toHaveTextContent(
        /宽度 1200 mm 低于.*允许的最小尺寸 1500 mm|below minimum allowed 1500 mm/i,
      );

      // AC-19: Does NOT mutate furniture instance, verdict, or draft
      expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent(initialDimensions!);
      expect(screen.getByTestId("decision-summary")).toHaveTextContent(initialDecisionSummary!);

      const draft = await storage.getDraft("floor-plan-std-2b1l-01");
      const bed = draft?.furniture.find((f) => f.id === "f2");
      expect(bed?.width).not.toBe(1200);
      expect(bed?.width ?? 1800).toBe(1800);
    });

    it("AC-20: re-evaluates spatial rules and updates verdict & measured info when moving or rotating furniture", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialActivePlan={VALID_STANDARD_FLOOR_PLAN} locale="zh" />);

      // Navigate to decision stage with Master Bedroom (r2) and double bed f2
      fireEvent.click(screen.getByTestId("room-item-r2"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f2"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));

      // Open furniture editor
      fireEvent.click(screen.getByTestId("tune-target-furniture-btn"));

      // 1. Move furniture into wall collision (move X to 3100, overlapping wall w2 at x=3000)
      const xInput = screen.getByTestId("furniture-x-input");
      fireEvent.change(xInput, { target: { value: "3100" } });
      fireEvent.click(screen.getByTestId("apply-furniture-btn"));

      // Rules re-evaluated: decision reflects collision error with measured value
      await waitFor(() => {
        expect(screen.getByTestId("decision-status-badge")).toHaveTextContent("不建议");
        expect(screen.getByTestId("decision-issues-list")).toBeInTheDocument();
      });

      // Measured info is present
      const measuredItems = screen.getAllByTestId(/decision-measured-/);
      expect(measuredItems.length).toBeGreaterThan(0);

      // 2. Rotate furniture by 90 degrees
      fireEvent.click(screen.getByTestId("rotate-furniture-btn"));

      // Verdict and draft automatically update with rotation
      await waitFor(async () => {
        const draft = await storage.getDraft("floor-plan-std-2b1l-01");
        const bed = draft?.furniture.find((f) => f.id === "f2");
        expect(bed?.rotation).toBe(90);
      });
    });

    it("AC-21: pushes valid room calibrations and furniture size/position/rotation edits to history and autosaves; undo/redo restores canvas, verdict, and draft", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialActivePlan={VALID_STANDARD_FLOOR_PLAN} locale="zh" />);

      // Select room r2 and skip calibration to room stage
      fireEvent.click(screen.getByTestId("room-item-r2"));
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      fireEvent.click(screen.getByTestId("floor-plan-furniture-f2"));
      fireEvent.click(screen.getByTestId("next-to-decision-btn"));

      expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("1800 × 2000 mm");
      const initialVerdictText = screen.getByTestId("decision-title").textContent;

      // 1. Valid furniture resize: increase width to 2000 mm
      fireEvent.click(screen.getByTestId("tune-target-furniture-btn"));
      const widthInput = screen.getByTestId("furniture-width-input");
      fireEvent.change(widthInput, { target: { value: "2000" } });
      fireEvent.click(screen.getByTestId("apply-furniture-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("2000 × 2000 mm");
      });

      // 2. Valid furniture rotation: rotate 90°
      fireEvent.click(screen.getByTestId("rotate-furniture-btn"));

      await waitFor(async () => {
        const draft = await storage.getDraft("floor-plan-std-2b1l-01");
        const bed = draft?.furniture.find((f) => f.id === "f2");
        expect(bed?.rotation).toBe(90);
        expect(bed?.width).toBe(2000);
      });

      // 3. Trigger Undo (undo rotation)
      const undoBtn = screen.getByTestId("undo-btn");
      expect(undoBtn).toBeEnabled();
      fireEvent.click(undoBtn);

      // Rotation restored to 0, width remains 2000
      await waitFor(async () => {
        const draft = await storage.getDraft("floor-plan-std-2b1l-01");
        const bed = draft?.furniture.find((f) => f.id === "f2");
        expect(bed?.rotation).toBe(0);
        expect(bed?.width).toBe(2000);
      });

      // 4. Trigger Undo (undo resize)
      fireEvent.click(undoBtn);

      // Width restored to 1800
      await waitFor(async () => {
        expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("1800 × 2000 mm");
        expect(screen.getByTestId("decision-title").textContent).toBe(initialVerdictText);
        const draft = await storage.getDraft("floor-plan-std-2b1l-01");
        const bed = draft?.furniture.find((f) => f.id === "f2");
        expect(bed?.width).toBe(1800);
      });

      // 5. Trigger Redo (redo resize)
      const redoBtn = screen.getByTestId("redo-btn");
      expect(redoBtn).toBeEnabled();
      fireEvent.click(redoBtn);

      await waitFor(async () => {
        expect(screen.getByTestId("decision-target-furniture-dimensions")).toHaveTextContent("2000 × 2000 mm");
        const draft = await storage.getDraft("floor-plan-std-2b1l-01");
        const bed = draft?.furniture.find((f) => f.id === "f2");
        expect(bed?.width).toBe(2000);
      });

      // 6. Trigger Redo (redo rotation)
      fireEvent.click(redoBtn);

      await waitFor(async () => {
        const draft = await storage.getDraft("floor-plan-std-2b1l-01");
        const bed = draft?.furniture.find((f) => f.id === "f2");
        expect(bed?.rotation).toBe(90);
      });
    });
  });

  describe("Issue #204: Shelve Expert Editing Tools into Advanced Menu (AC-26)", () => {
    it("default main workflow panel does not expand rules, wall/opening properties, full furniture catalog, export, or reset", () => {
      render(<FloorPlanShell isMobile={false} initialPlans={FIXTURE_PLANS} />);

      // 1. Rules panel is not expanded in the main context panel
      expect(screen.queryByTestId("rule-feedback-panel")).not.toBeInTheDocument();

      // 2. Neither export nor reset buttons are rendered in toolbar/context pane by default
      expect(screen.queryByTestId("export-json-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("restart-template-btn")).not.toBeInTheDocument();

      // 3. Wall/opening selection in canvas does not expand full inspector into context pane
      const wall = screen.getByTestId("floor-plan-wall-w1");
      fireEvent.click(wall);

      // Context pane displays compact selected-structure-banner rather than full inspector-wall-details
      expect(screen.getByTestId("selected-structure-banner")).toBeInTheDocument();
      expect(screen.queryByTestId("inspector-wall-details")).not.toBeInTheDocument();

      // 4. Full furniture catalog is not rendered by default
      expect(screen.queryByTestId("furniture-catalog-palette")).not.toBeInTheDocument();
    });

    it("accesses and operates all 5 capabilities through Advanced Tools dialog", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} isMobile={false} initialPlans={FIXTURE_PLANS} />);

      // Open Advanced Tools via the context pane button
      fireEvent.click(screen.getByTestId("open-advanced-tools-btn"));
      expect(screen.getByTestId("advanced-tools-dialog")).toBeInTheDocument();

      // 1. Rules Tab: renders RuleFeedbackPanel
      expect(screen.getByTestId("advanced-tab-rules")).toBeInTheDocument();
      expect(screen.getByTestId("advanced-rules-panel")).toBeInTheDocument();
      expect(screen.getByTestId("rule-feedback-panel")).toBeInTheDocument();

      // 2. Structure Tab: wall & opening inspector
      fireEvent.click(screen.getByTestId("advanced-tab-structure"));
      expect(screen.getByTestId("advanced-structure-panel")).toBeInTheDocument();
      expect(screen.getByTestId("filter-walls-btn")).toBeInTheDocument();
      expect(screen.getByTestId("filter-openings-btn")).toBeInTheDocument();

      // Select opening via filter
      fireEvent.click(screen.getByTestId("filter-openings-btn"));
      fireEvent.click(screen.getByTestId("select-structure-opening-door1"));
      expect(screen.getByTestId("opening-editor")).toBeInTheDocument();

      // 3. Furniture Tab: full furniture catalog
      fireEvent.click(screen.getByTestId("advanced-tab-furniture"));
      expect(screen.getByTestId("advanced-furniture-panel")).toBeInTheDocument();
      expect(screen.getByTestId("furniture-catalog-palette")).toBeInTheDocument();

      // 4. Manage Tab: Export JSON & Reset Plan
      fireEvent.click(screen.getByTestId("advanced-tab-manage"));
      expect(screen.getByTestId("advanced-manage-panel")).toBeInTheDocument();
      expect(screen.getByTestId("export-json-btn")).toBeInTheDocument();
      expect(screen.getByTestId("restart-template-btn")).toBeInTheDocument();

      // Close dialog via close button
      fireEvent.click(screen.getByTestId("advanced-tools-close-btn"));
      expect(screen.queryByTestId("advanced-tools-dialog")).not.toBeInTheDocument();
    });

    it("opens structure tools directly when clicking open-structure-tools-btn from structure banner", () => {
      render(<FloorPlanShell isMobile={false} initialPlans={FIXTURE_PLANS} />);

      // Click wall on canvas
      const wall = screen.getByTestId("floor-plan-wall-w1");
      fireEvent.click(wall);

      // Click "Open Tools" in banner
      fireEvent.click(screen.getByTestId("open-structure-tools-btn"));

      // Advanced tools opens directly to structure tab with wall details
      expect(screen.getByTestId("advanced-tools-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("advanced-structure-panel")).toBeInTheDocument();
      expect(screen.getByTestId("inspector-wall-details")).toBeInTheDocument();
    });
  });

  describe("AC-24: Accessible names, programmatic selection, visible focus, and keyboard position adjustment", () => {
    it("provides accessible names, visible focus classes, and programmatic selection state across main workflow", async () => {
      render(<FloorPlanShell isMobile={false} initialPlans={FIXTURE_PLANS} />);

      // Stepper accessibility
      const stepper = screen.getByTestId("floor-plan-stage-stepper");
      expect(stepper).toHaveAttribute("aria-label");
      const step1 = screen.getByTestId("stage-step-plan");
      expect(step1).toHaveAttribute("aria-current", "step");
      expect(step1).toHaveAttribute("aria-label");
      expect(step1.className).toMatch(/focus-visible:ring/);

      // Room list accessibility in Stage 1
      const roomList = screen.getByTestId("room-list");
      expect(roomList).toBeInTheDocument();
      const roomItem = screen.getByTestId("room-item-r1");
      expect(roomItem).toHaveAttribute("aria-label");
      expect(roomItem.className).toMatch(/focus-visible:ring/);

      // Advance to Room stage
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      const step2 = screen.getByTestId("stage-step-room");
      expect(step2).toHaveAttribute("aria-current", "step");

      // Select room r1
      const stageRoomItem = screen.getByTestId("room-item-r1");
      fireEvent.click(stageRoomItem);
      expect(stageRoomItem).toHaveAttribute("aria-selected", "true");

      // Advance to Furniture stage
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
      const step3 = screen.getByTestId("stage-step-furniture");
      expect(step3).toHaveAttribute("aria-current", "step");

      // Context furniture items have accessible name and visible focus
      const addBtns = screen.getAllByTestId(/^add-context-furniture-/);
      expect(addBtns.length).toBeGreaterThan(0);
      expect(addBtns[0]).toHaveAttribute("aria-label");
      expect(addBtns[0].className).toMatch(/focus-visible:ring/);

      // Add furniture
      fireEvent.click(addBtns[0]);

      // Transitions to Decision stage
      await waitFor(() => {
        const step4 = screen.getByTestId("stage-step-decision");
        expect(step4).toHaveAttribute("aria-current", "step");
      });

      // Decision verdict status has accessible role or label
      const statusBadge = screen.getByTestId("decision-status-badge");
      expect(statusBadge).toBeInTheDocument();
    });

    it("nudges selected furniture position via Arrow keys (not drag only)", async () => {
      render(<FloorPlanShell isMobile={false} initialPlans={FIXTURE_PLANS} />);

      // Advance to furniture stage and add a furniture
      fireEvent.click(screen.getByTestId("skip-calibration-btn"));
      fireEvent.click(screen.getByTestId("room-item-r1"));
      fireEvent.click(screen.getByTestId("next-to-furniture-btn"));

      const addBtns = screen.getAllByTestId(/^add-context-furniture-/);
      fireEvent.click(addBtns[0]);

      // Target furniture is added and decision stage is active
      await waitFor(() => {
        expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();
      });

      // Find furniture element on SVG
      const furnitureElements = screen.getAllByTestId(/^floor-plan-furniture-/);
      const targetEl = furnitureElements[furnitureElements.length - 1];
      const initialTransform = targetEl.getAttribute("transform");

      // Select the furniture explicitly
      fireEvent.click(targetEl);

      // ArrowRight nudges X by +50mm
      fireEvent.keyDown(window, { key: "ArrowRight" });
      const transformAfterRight = targetEl.getAttribute("transform");
      expect(transformAfterRight).not.toEqual(initialTransform);

      // ArrowDown nudges Y by +50mm
      fireEvent.keyDown(window, { key: "ArrowDown" });
      const transformAfterDown = targetEl.getAttribute("transform");
      expect(transformAfterDown).not.toEqual(transformAfterRight);

      // Shift+ArrowLeft nudges X by -500mm
      fireEvent.keyDown(window, { key: "ArrowLeft", shiftKey: true });
      const transformAfterShiftLeft = targetEl.getAttribute("transform");
      expect(transformAfterShiftLeft).not.toEqual(transformAfterDown);
    });

    it("provides coordinate step / nudge buttons in FurnitureEditor with 44px touch targets", () => {
      render(<FloorPlanShell isMobile={false} initialPlans={FIXTURE_PLANS} />);

      // Select existing sofa f1
      const sofa = screen.getByTestId("floor-plan-furniture-f1");
      fireEvent.click(sofa);

      // Furniture editor appears
      expect(screen.getByTestId("furniture-editor")).toBeInTheDocument();

      // Directional nudge buttons exist with touch-sized targets
      const nudgeUp = screen.getByTestId("nudge-furniture-up");
      const nudgeDown = screen.getByTestId("nudge-furniture-down");
      const nudgeLeft = screen.getByTestId("nudge-furniture-left");
      const nudgeRight = screen.getByTestId("nudge-furniture-right");

      expect(nudgeUp.className).toMatch(/min-h-\[44px\]|min-w-\[44px\]/);
      expect(nudgeDown.className).toMatch(/min-h-\[44px\]|min-w-\[44px\]/);
      expect(nudgeLeft.className).toMatch(/min-h-\[44px\]|min-w-\[44px\]/);
      expect(nudgeRight.className).toMatch(/min-h-\[44px\]|min-w-\[44px\]/);

      expect(nudgeUp).toHaveAttribute("aria-label");

      // Click nudge right
      const initialX = screen.getByTestId("furniture-x-input") as HTMLInputElement;
      const initialXVal = Number(initialX.value);
      fireEvent.click(nudgeRight);

      const updatedX = screen.getByTestId("furniture-x-input") as HTMLInputElement;
      expect(Number(updatedX.value)).toBeGreaterThan(initialXVal);
    });
  });
});
