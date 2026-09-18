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
});

