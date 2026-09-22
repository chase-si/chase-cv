import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { FloorPlanShell } from "./floor-plan-shell";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import {
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
} from "@/lib/floor-plan/fixtures/standard-plans";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";

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

describe("Issue #228: Prune advanced topology editing, arbitrary resize, and draft workflow", () => {
  describe("AC-4: Arbitrary furniture width and depth inputs are unreachable", () => {
    it("ensures no arbitrary width or depth inputs exist anywhere in the UI when inspecting furniture", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

      // Select existing furniture f1 on the canvas
      const sofa = screen.getByTestId("floor-plan-furniture-f1");
      fireEvent.click(sofa);

      // Verify arbitrary size inputs do NOT exist
      expect(screen.queryByTestId("furniture-width-input")).not.toBeInTheDocument();
      expect(screen.queryByTestId("furniture-depth-input")).not.toBeInTheDocument();
      expect(screen.queryByTestId("furniture-width-inc-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("furniture-width-dec-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("furniture-depth-inc-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("furniture-depth-dec-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("apply-furniture-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("preview-furniture-btn")).not.toBeInTheDocument();

      // Ensure no number inputs exist in the document for arbitrary dimensions
      const numberInputs = screen.queryAllByRole("spinbutton");
      expect(numberInputs.length).toBe(0);
    });
  });

  describe("AC-27: Advanced topology editors, draft recovery, and old workflow are unreachable", () => {
    it("ensures room, wall, and opening editors are not reachable via UI or toolbar", () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

      // 1. Room editor unreachable
      expect(screen.queryByTestId("room-span-editor")).not.toBeInTheDocument();
      expect(screen.queryByTestId("apply-span-btn")).not.toBeInTheDocument();

      // Click on a room to inspect
      const room = screen.getByTestId("floor-plan-room-r1");
      fireEvent.click(room);

      expect(screen.queryByTestId("room-span-editor")).not.toBeInTheDocument();
      expect(screen.queryByTestId("apply-span-btn")).not.toBeInTheDocument();
      expect(screen.queryByText(/房间开间与进深微调/i)).not.toBeInTheDocument();

      // 2. Opening editor unreachable
      expect(screen.queryByTestId("opening-editor")).not.toBeInTheDocument();
      expect(screen.queryByTestId("opening-width-input")).not.toBeInTheDocument();

      const door = screen.getByTestId("floor-plan-opening-door1");
      fireEvent.click(door);

      expect(screen.queryByTestId("opening-editor")).not.toBeInTheDocument();
      expect(screen.queryByTestId("opening-width-input")).not.toBeInTheDocument();

      // 3. Advanced tools dialog and buttons unreachable
      expect(screen.queryByTestId("advanced-tools-dialog")).not.toBeInTheDocument();
      expect(screen.queryByTestId("advanced-tools-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("open-advanced-tools-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("customize-plan-btn")).not.toBeInTheDocument();
    });

    it("ensures history/undo/redo and draft persistence/recovery are unreachable", () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

      // No undo or redo buttons
      expect(screen.queryByTestId("undo-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("redo-btn")).not.toBeInTheDocument();

      // No draft save status or draft restore prompt
      expect(screen.queryByTestId("save-status-badge")).not.toBeInTheDocument();
      expect(screen.queryByTestId("draft-restore-prompt")).not.toBeInTheDocument();

      // Trigger Ctrl+Z - should not crash or trigger undo
      fireEvent.keyDown(window, { key: "z", ctrlKey: true });
      expect(screen.queryByTestId("undo-btn")).not.toBeInTheDocument();
    });

    it("ensures the old four-stage workflow stepper is removed in favor of a streamlined usable baseline", () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

      // Stepper and individual stage buttons are gone
      expect(screen.queryByTestId("floor-plan-stage-stepper")).not.toBeInTheDocument();
      expect(screen.queryByTestId("stage-step-plan")).not.toBeInTheDocument();
      expect(screen.queryByTestId("stage-step-room")).not.toBeInTheDocument();
      expect(screen.queryByTestId("stage-step-furniture")).not.toBeInTheDocument();
      expect(screen.queryByTestId("stage-step-decision")).not.toBeInTheDocument();
    });
  });

  describe("Preserved Core Capabilities: predefined plans, viewing, furniture operations, collision feedback", () => {
    it("allows choosing predefined plans, viewing, adding, moving, rotating, deleting furniture, and getting collision feedback", async () => {
      render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

      // 1. Choose predefined plan via plan selector dialog
      const changePlanBtn = screen.getByTestId("open-plan-selector-btn");
      fireEvent.click(changePlanBtn);

      const catalogDialog = screen.getByTestId("floor-plan-catalog");
      expect(catalogDialog).toBeInTheDocument();

      const studioPlanCard = screen.getByTestId(`catalog-plan-card-${STUDIO_STANDARD_FLOOR_PLAN.meta.id}`);
      expect(studioPlanCard).toBeInTheDocument();

      // Close dialog
      fireEvent.click(screen.getByTestId("plan-selector-close-btn"));
      expect(screen.queryByTestId("floor-plan-catalog")).not.toBeInTheDocument();

      // 2. View floor plan: canvas renders rooms, walls, openings
      expect(screen.getByTestId("floor-plan-svg-canvas")).toBeInTheDocument();
      expect(screen.getByTestId("floor-plan-room-r1")).toBeInTheDocument();
      expect(screen.getByTestId("floor-plan-wall-w1")).toBeInTheDocument();

      // 3. Add furniture from context recommendations or palette
      const addBtns = screen.getAllByTestId(/^add-context-furniture-/);
      expect(addBtns.length).toBeGreaterThan(0);
      fireEvent.click(addBtns[0]);

      // Newly added furniture appears on canvas
      await waitFor(() => {
        const furnitureElements = screen.getAllByTestId(/^floor-plan-furniture-/);
        expect(furnitureElements.length).toBeGreaterThanOrEqual(2);
      });

      // 4. Rotate furniture (90 degrees)
      const rotateBtn = screen.getByTestId("rotate-furniture-btn");
      expect(rotateBtn).toBeInTheDocument();
      fireEvent.click(rotateBtn);

      // 5. Delete furniture
      const deleteBtn = screen.getByTestId("delete-furniture-btn");
      expect(deleteBtn).toBeInTheDocument();
      fireEvent.click(deleteBtn);

      // 6. Collision / rule feedback remains active
      expect(screen.getByTestId("shell-violations-badge")).toBeInTheDocument();
    });
  });
});
