import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryDraftStorage } from "@/lib/floor-plan/draft-storage";
import { getStandardPlans } from "@/lib/floor-plan/catalog";
import { createOrResumeUserPlan } from "@/lib/floor-plan/user-plan";
import { validateFloorPlan } from "@/lib/floor-plan/validators";
import { FloorPlanShell } from "./floor-plan-shell";

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
  it("renders ToolPageChrome header, catalog, canvas, and inspector", () => {
    render(<FloorPlanShell />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Floor Plan Space Validator" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tool-page-chrome")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-catalog")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-viewer-surface")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-inspector")).toBeInTheDocument();
    expect(screen.getByTestId("customize-plan-btn")).toBeInTheDocument();
  });

  it("switches plan when clicking on a different standard plan in the catalog", () => {
    render(<FloorPlanShell />);

    // Default plan is 2BR-Nordic-Standard
    expect(
      screen.getByTestId("plan-name-plan-std-2br-01"),
    ).toHaveTextContent("2BR-Nordic-Standard");

    // Select Studio plan
    const studioOpenBtn = screen.getByTestId("open-plan-btn-plan-std-studio-01");
    fireEvent.click(studioOpenBtn);

    // Header badge updates
    expect(screen.getAllByText("Modern Compact Studio").length).toBeGreaterThanOrEqual(1);

    // Canvas renders studio rooms
    expect(screen.getByTestId("floor-plan-room-sr1")).toBeInTheDocument();
  });

  it("updates inspector panel when selecting an entity in the canvas", () => {
    render(<FloorPlanShell />);

    // Initially shows plan summary
    expect(screen.getByTestId("inspector-plan-summary")).toBeInTheDocument();

    // Click on wall w1
    const wall1 = screen.getByTestId("floor-plan-wall-w1");
    fireEvent.click(wall1);

    // Inspector shows wall details
    expect(screen.getByTestId("inspector-wall-details")).toBeInTheDocument();
    expect(screen.getByText("3000 mm")).toBeInTheDocument();

    // Deselect entity
    const deselectBtn = screen.getByTestId("inspector-deselect-btn");
    fireEvent.click(deselectBtn);

    expect(screen.getByTestId("inspector-plan-summary")).toBeInTheDocument();
  });

  describe("AC-2: Starting an edit creates User plan while source Standard plan remains unchanged", () => {
    it("converts to User plan and keeps the source Standard plan byte-for-byte unchanged", async () => {
      const standardPlans = getStandardPlans();
      const standardPlan = standardPlans[0].plan;
      const initialStandardJson = JSON.stringify(standardPlan);

      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} initialPlans={standardPlans} />);

      // Click "Customize Plan"
      const customizeBtn = screen.getByTestId("customize-plan-btn");
      fireEvent.click(customizeBtn);

      // Now in draft mode: save status badge is shown
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Edit plan name in inspector
      const nameInput = screen.getByTestId("edit-plan-name-input");
      fireEvent.change(nameInput, { target: { value: "My Modified Custom Suite" } });

      // Check that header displays new name
      await waitFor(() => {
        expect(screen.getAllByText("My Modified Custom Suite").length).toBeGreaterThanOrEqual(1);
      });

      // Ensure the source Standard plan in memory remained byte-for-byte unchanged (AC-2)
      expect(JSON.stringify(standardPlan)).toBe(initialStandardJson);
    });
  });

  describe("AC-15: Autosave, Status Badge, Restore Prompt & Restart", () => {
    it("automatically persists edits into storage with saved status badge", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

      // Start customize
      fireEvent.click(screen.getByTestId("customize-plan-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toHaveTextContent(/saved/i);
      });

      // Verify draft exists in storage
      const draft = await storage.getDraft("plan-std-2br-01");
      expect(draft).not.toBeNull();
      expect(draft?.meta.source).toBe("user");

      // Edit name
      const nameInput = screen.getByTestId("edit-plan-name-input");
      fireEvent.change(nameInput, { target: { value: "Autosaved User Plan" } });

      await waitFor(async () => {
        const updatedDraft = await storage.getDraft("plan-std-2br-01");
        expect(updatedDraft?.meta.name).toBe("Autosaved User Plan");
      });
    });

    it("displays restore prompt banner when standard plan has an existing draft", async () => {
      const storage = new MemoryDraftStorage();
      const standardPlans = getStandardPlans();
      const template = standardPlans[0].plan;
      const existingDraft = createOrResumeUserPlan(template);
      existingDraft.meta.name = "Pre-existing Stored Draft";
      await storage.saveDraft("plan-std-2br-01", existingDraft);

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
      const standardPlans = getStandardPlans();
      const template = standardPlans[0].plan;
      const existingDraft = createOrResumeUserPlan(template);
      existingDraft.meta.name = "Draft To Be Discarded";
      await storage.saveDraft("plan-std-2br-01", existingDraft);

      render(<FloorPlanShell storage={storage} initialPlans={standardPlans} />);

      // Click "Restart from template" in banner
      await waitFor(() => {
        expect(screen.getByTestId("discard-draft-btn")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId("discard-draft-btn"));

      // Banner gone, draft removed from storage, back to clean template
      await waitFor(async () => {
        expect(screen.queryByTestId("draft-restore-banner")).not.toBeInTheDocument();
        expect(await storage.hasDraft("plan-std-2br-01")).toBe(false);
        expect(screen.getAllByText("2BR-Nordic-Standard").length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("AC-16: Download / Export current User plan as valid JSON", () => {
    it("exports current User plan as JSON that passes canonical validateFloorPlan", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

      // Start customize
      fireEvent.click(screen.getByTestId("customize-plan-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("export-json-btn")).toBeInTheDocument();
      });

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
      render(<FloorPlanShell storage={storage} />);

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
        const savedDraft = await storage.getDraft("plan-std-2br-01");
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
      render(<FloorPlanShell storage={storage} />);

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
      const savedDraft = await storage.getDraft("plan-std-2br-01");
      const v2 = savedDraft?.vertices.find((v) => v.id === "v2");
      expect(v2?.x).toBe(3000); // Original intact
    });
  });

  describe("AC-9: Move and resize wall-bound openings in draft mode", () => {
    it("edits opening width and position, autosaving the updated User plan", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

      // 1. Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // 2. Select opening door1
      fireEvent.click(screen.getByTestId("floor-plan-opening-door1"));

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
        const savedDraft = await storage.getDraft("plan-std-2br-01");
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
      render(<FloorPlanShell storage={storage} />);

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
        const savedDraft = await storage.getDraft("plan-std-2br-01");
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
      render(<FloorPlanShell storage={storage} />);

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
        const savedDraft = await storage.getDraft("plan-std-2br-01");
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
        const savedDraft = await storage.getDraft("plan-std-2br-01");
        const sofa = savedDraft?.furniture.find((f) => f.id === "f1");
        expect(sofa?.width).toBe(2200);
        expect(sofa?.depth).toBe(950);
      });

      // 5. Delete furniture
      fireEvent.click(screen.getByTestId("delete-furniture-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("plan-std-2br-01");
        expect(savedDraft?.furniture.some((f) => f.id === "f1")).toBe(false);
      });
    });
  });

  describe("AC-8: Undo and Redo all committed plan edits in FloorPlanShell", () => {
    it("renders undo and redo buttons with disabled states initially, enabling undo upon mutation", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

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
      render(<FloorPlanShell storage={storage} />);

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
        const savedDraft = await storage.getDraft("plan-std-2br-01");
        expect(savedDraft?.vertices.find((v) => v.id === "v2")?.x).toBe(3600);
      });

      // Click Undo
      fireEvent.click(screen.getByTestId("undo-btn"));

      // Vertex x should be reverted to 3000 in storage and room display
      await waitFor(async () => {
        const savedDraft = await storage.getDraft("plan-std-2br-01");
        expect(savedDraft?.vertices.find((v) => v.id === "v2")?.x).toBe(3000);
        expect(screen.getByTestId("floor-plan-room-r1")).toHaveTextContent("15.0 m²");
      });

      // Click Redo
      fireEvent.click(screen.getByTestId("redo-btn"));

      // Vertex x should be restored to 3600
      await waitFor(async () => {
        const savedDraft = await storage.getDraft("plan-std-2br-01");
        expect(savedDraft?.vertices.find((v) => v.id === "v2")?.x).toBe(3600);
        expect(screen.getByTestId("floor-plan-room-r1")).toHaveTextContent("18.0 m²");
      });
    });

    it("undoes and redoes opening move and resize operations", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

      // Enter draft mode
      fireEvent.click(screen.getByTestId("customize-plan-btn"));
      await waitFor(() => {
        expect(screen.getByTestId("save-status-badge")).toBeInTheDocument();
      });

      // Select opening door1
      fireEvent.click(screen.getByTestId("floor-plan-opening-door1"));
      await waitFor(() => {
        expect(screen.getByTestId("opening-editor")).toBeInTheDocument();
      });

      // Change width to 1100 and apply
      const widthInput = screen.getByTestId("opening-width-input");
      fireEvent.change(widthInput, { target: { value: "1100" } });
      fireEvent.click(screen.getByTestId("apply-opening-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("plan-std-2br-01");
        expect(savedDraft?.openings.find((o) => o.id === "door1")?.width).toBe(1100);
      });

      // Undo
      fireEvent.click(screen.getByTestId("undo-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("plan-std-2br-01");
        expect(savedDraft?.openings.find((o) => o.id === "door1")?.width).toBe(900);
      });

      // Redo
      fireEvent.click(screen.getByTestId("redo-btn"));

      await waitFor(async () => {
        const savedDraft = await storage.getDraft("plan-std-2br-01");
        expect(savedDraft?.openings.find((o) => o.id === "door1")?.width).toBe(1100);
      });
    });

    it("undoes and redoes furniture manipulation operations (rotate, delete)", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

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
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Delete sofa f1
      fireEvent.click(screen.getByTestId("delete-furniture-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.some((f) => f.id === "f1")).toBe(false);
      });

      // Undo 1: Un-delete sofa f1
      fireEvent.click(screen.getByTestId("undo-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        const sofa = saved?.furniture.find((f) => f.id === "f1");
        expect(sofa).toBeDefined();
        expect(sofa?.rotation).toBe(90);
      });

      // Undo 2: Un-rotate sofa f1 back to 0
      fireEvent.click(screen.getByTestId("undo-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        const sofa = saved?.furniture.find((f) => f.id === "f1");
        expect(sofa?.rotation).toBe(0);
      });

      // Redo 1: Re-rotate sofa f1 to 90
      fireEvent.click(screen.getByTestId("redo-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Redo 2: Re-delete sofa f1
      fireEvent.click(screen.getByTestId("redo-btn"));

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.some((f) => f.id === "f1")).toBe(false);
      });
    });

    it("triggers undo and redo via keyboard shortcuts (Cmd+Z / Ctrl+Z and Cmd+Shift+Z / Ctrl+Shift+Z / Ctrl+Y)", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

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
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Press Cmd+Z to undo
      fireEvent.keyDown(window, { key: "z", metaKey: true });

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(0);
      });

      // Press Cmd+Shift+Z to redo
      fireEvent.keyDown(window, { key: "z", metaKey: true, shiftKey: true });

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Press Ctrl+Z to undo
      fireEvent.keyDown(window, { key: "z", ctrlKey: true });

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(0);
      });

      // Press Ctrl+Y to redo
      fireEvent.keyDown(window, { key: "y", ctrlKey: true });

      await waitFor(async () => {
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });
    });

    it("does not trigger plan undo via shortcut when focused inside an input element", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

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
        const saved = await storage.getDraft("plan-std-2br-01");
        expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
      });

      // Focus an input element (e.g. width input)
      const input = screen.getByTestId("furniture-width-input");
      input.focus();

      // Trigger Cmd+Z while input is active element
      fireEvent.keyDown(input, { key: "z", metaKey: true });

      // Plan should NOT have undone
      const saved = await storage.getDraft("plan-std-2br-01");
      expect(saved?.furniture.find((f) => f.id === "f1")?.rotation).toBe(90);
    });

    it("creates exactly one history entry for a continuous pointer drag gesture", async () => {
      const storage = new MemoryDraftStorage();
      render(<FloorPlanShell storage={storage} />);

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
});

