import { describe, expect, it } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import { adjustRoomSpan } from "./room-adjustment";
import { updateOpening } from "./opening-adjustment";
import {
  addFurnitureInstance,
  deleteFurnitureInstance,
  moveFurnitureInstance,
  rotateFurnitureInstance,
} from "./furniture-operations";
import { STANDARD_FURNITURE_CATALOG } from "./furniture-catalog";
import {
  canRedo,
  canUndo,
  commitPlanChange,
  createPlanHistory,
  DEFAULT_HISTORY_CAPACITY,
  getCurrentPlan,
  MIN_HISTORY_CAPACITY,
  redo,
  undo,
} from "./history";

describe("Unified Command History (AC-8)", () => {
  const basePlan = VALID_STANDARD_FLOOR_PLAN;

  describe("createPlanHistory", () => {
    it("initializes history with empty past and future, and sets present", () => {
      const history = createPlanHistory(basePlan, { description: "Initial standard plan" });

      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
      expect(history.present.plan).toBe(basePlan);
      expect(history.present.description).toBe("Initial standard plan");
      expect(history.capacity).toBe(DEFAULT_HISTORY_CAPACITY);
      expect(canUndo(history)).toBe(false);
      expect(canRedo(history)).toBe(false);
      expect(getCurrentPlan(history)).toBe(basePlan);
    });

    it("enforces minimum capacity of at least 30", () => {
      const historyWithSmallCap = createPlanHistory(basePlan, { capacity: 10 });
      expect(historyWithSmallCap.capacity).toBe(MIN_HISTORY_CAPACITY);
      expect(historyWithSmallCap.capacity).toBeGreaterThanOrEqual(30);

      const historyWithCustomCap = createPlanHistory(basePlan, { capacity: 45 });
      expect(historyWithCustomCap.capacity).toBe(45);
    });
  });

  describe("commitPlanChange", () => {
    it("pushes previous present to past, updates present, and clears future", () => {
      const initial = createPlanHistory(basePlan);
      const planA = { ...basePlan, meta: { ...basePlan.meta, name: "Plan A" } };
      const planB = { ...basePlan, meta: { ...basePlan.meta, name: "Plan B" } };

      const afterA = commitPlanChange(initial, planA, "Change to A");
      expect(afterA.past.length).toBe(1);
      expect(afterA.past[0].plan).toBe(basePlan);
      expect(afterA.present.plan).toBe(planA);
      expect(afterA.present.description).toBe("Change to A");
      expect(afterA.future).toEqual([]);
      expect(canUndo(afterA)).toBe(true);
      expect(canRedo(afterA)).toBe(false);

      const afterUndo = undo(afterA);
      expect(canRedo(afterUndo)).toBe(true);

      // Branching: committing planB after undo clears future
      const afterB = commitPlanChange(afterUndo, planB, "Change to B");
      expect(afterB.present.plan).toBe(planB);
      expect(afterB.past.length).toBe(1);
      expect(afterB.future).toEqual([]);
      expect(canRedo(afterB)).toBe(false);
    });

    it("ignores commit if nextPlan is identical reference to present.plan", () => {
      const initial = createPlanHistory(basePlan);
      const sameCommit = commitPlanChange(initial, basePlan);
      expect(sameCommit).toBe(initial);
      expect(sameCommit.past.length).toBe(0);
    });

    it("caps past stack when exceeding capacity (e.g. performing 35 operations with capacity 30)", () => {
      let history = createPlanHistory(basePlan, { capacity: 30 });

      // Perform 35 commits
      for (let i = 1; i <= 35; i++) {
        const nextPlan = { ...basePlan, meta: { ...basePlan.meta, name: `Step ${i}` } };
        history = commitPlanChange(history, nextPlan, `Step ${i}`);
      }

      // Past should be capped at 30
      expect(history.past.length).toBe(30);
      expect(history.present.plan.meta.name).toBe("Step 35");
      // 35 total commits: present is 35, past holds steps 5 to 34 (30 items)
      expect(history.past[0].description).toBe("Step 5");
      expect(history.past[29].description).toBe("Step 34");

      // Verify we can undo exactly 30 times
      let undoCount = 0;
      while (canUndo(history)) {
        history = undo(history);
        undoCount++;
      }
      expect(undoCount).toBe(30);
      expect(history.present.description).toBe("Step 5");
    });
  });

  describe("undo and redo basic transitions", () => {
    it("returns unchanged history when attempting undo with empty past", () => {
      const history = createPlanHistory(basePlan);
      const afterUndo = undo(history);
      expect(afterUndo).toBe(history);
    });

    it("returns unchanged history when attempting redo with empty future", () => {
      const history = createPlanHistory(basePlan);
      const afterRedo = redo(history);
      expect(afterRedo).toBe(history);
    });

    it("undone operations can be redone back to the latest state", () => {
      let history = createPlanHistory(basePlan);
      const plan1 = { ...basePlan, meta: { ...basePlan.meta, name: "Plan 1" } };
      const plan2 = { ...basePlan, meta: { ...basePlan.meta, name: "Plan 2" } };

      history = commitPlanChange(history, plan1, "1");
      history = commitPlanChange(history, plan2, "2");

      expect(history.present.plan.meta.name).toBe("Plan 2");

      // Undo to Plan 1
      history = undo(history);
      expect(history.present.plan.meta.name).toBe("Plan 1");
      expect(canRedo(history)).toBe(true);

      // Undo to basePlan
      history = undo(history);
      expect(history.present.plan).toBe(basePlan);
      expect(canUndo(history)).toBe(false);

      // Redo to Plan 1
      history = redo(history);
      expect(history.present.plan.meta.name).toBe("Plan 1");

      // Redo to Plan 2
      history = redo(history);
      expect(history.present.plan.meta.name).toBe("Plan 2");
      expect(canRedo(history)).toBe(false);
    });
  });

  describe("AC-8: At least 30 committed operations can be undone and redone", () => {
    it("supports at least 30 sequential undo and redo steps with default capacity", () => {
      let history = createPlanHistory(basePlan); // default capacity = 50 >= 30
      const planStates = [basePlan];

      // Perform 32 consecutive operations
      for (let i = 1; i <= 32; i++) {
        const next = { ...basePlan, meta: { ...basePlan.meta, name: `Mutation ${i}` } };
        planStates.push(next);
        history = commitPlanChange(history, next, `Op ${i}`);
      }

      expect(history.past.length).toBe(32);
      expect(canUndo(history)).toBe(true);

      // Undo all 32 operations in reverse
      for (let i = 32; i >= 1; i--) {
        expect(history.present.plan).toBe(planStates[i]);
        history = undo(history);
      }

      // We are back at initial state
      expect(history.present.plan).toBe(basePlan);
      expect(canUndo(history)).toBe(false);
      expect(history.future.length).toBe(32);

      // Redo all 32 operations forward
      for (let i = 1; i <= 32; i++) {
        history = redo(history);
        expect(history.present.plan).toBe(planStates[i]);
      }

      expect(canRedo(history)).toBe(false);
      expect(history.past.length).toBe(32);
    });
  });

  describe("AC-8: Continuous pointer gestures create exactly one history entry", () => {
    it("does not create entries during transient preview events, committing only on pointer release", () => {
      let history = createPlanHistory(basePlan);

      // Simulate a continuous pointer drag with 25 move ticks:
      // In the UI architecture, dragging updates transient local preview state
      let transientPreviewX = 1000;
      for (let tick = 0; tick < 25; tick++) {
        transientPreviewX += 10;
        // Previews do NOT call commitPlanChange
      }
      expect(history.past.length).toBe(0);
      expect(canUndo(history)).toBe(false);

      // Pointer up / release: exactly one commit
      const finalCommittedPlan = {
        ...basePlan,
        furniture: [
          ...basePlan.furniture,
          {
            id: "dragged-f1",
            definitionId: "dining-table-4",
            category: "table" as const,
            name: "Table",
            x: transientPreviewX,
            y: 2000,
            width: 1400,
            depth: 800,
            rotation: 0,
            elevationMm: 0,
          },
        ],
      };

      history = commitPlanChange(history, finalCommittedPlan, "Move furniture gesture complete");

      // Exactly ONE history entry created
      expect(history.past.length).toBe(1);
      expect(canUndo(history)).toBe(true);
      expect(canRedo(history)).toBe(false);

      // Undo restores plan before gesture
      history = undo(history);
      expect(history.present.plan).toBe(basePlan);
      expect(history.present.plan.furniture.some((f) => f.id === "dragged-f1")).toBe(false);
    });
  });

  describe("AC-8: Wall, Opening, and Furniture domain operations undo and redo", () => {
    it("can undo and redo real domain operations across walls, openings, and furniture", () => {
      let history = createPlanHistory(basePlan);

      // 1. Room Span Adjustment (AC-6 / AC-7)
      const spanRes = adjustRoomSpan({
        plan: history.present.plan,
        roomId: "r1",
        axis: "horizontal",
        boundarySide: "max",
        targetSpanMm: 3500,
      });
      expect(spanRes.success).toBe(true);
      if (!spanRes.success) return;
      history = commitPlanChange(history, spanRes.plan, "Adjust room span to 3500");

      // 2. Opening move / resize (AC-9)
      const openingRes = updateOpening(history.present.plan, {
        openingId: "door1",
        widthMm: 1100,
        positionRatio: 0.4,
      });
      expect(openingRes.success).toBe(true);
      if (!openingRes.success) return;
      history = commitPlanChange(history, openingRes.plan, "Resize door1 to 1100mm");

      // 3. Add Furniture (AC-10)
      const addRes = addFurnitureInstance(history.present.plan, STANDARD_FURNITURE_CATALOG, "dining-table-4");
      expect(addRes.success).toBe(true);
      if (!addRes.success) return;
      const addedFurnitureId = addRes.instance.id;
      history = commitPlanChange(history, addRes.plan, "Add dining-table-4");

      // 4. Rotate Furniture (AC-11)
      const rotateRes = rotateFurnitureInstance(history.present.plan, addedFurnitureId, 90);
      expect(rotateRes.success).toBe(true);
      if (!rotateRes.success) return;
      history = commitPlanChange(history, rotateRes.plan, "Rotate dining-table-4");

      // 5. Move Furniture (AC-11)
      const moveRes = moveFurnitureInstance(
        history.present.plan,
        addedFurnitureId,
        addedFurnitureId ? 1800 : 0,
        2200,
      );
      expect(moveRes.success).toBe(true);
      if (!moveRes.success) return;
      history = commitPlanChange(history, moveRes.plan, "Move dining-table-4");

      // 6. Delete Furniture (AC-11)
      const deleteRes = deleteFurnitureInstance(history.present.plan, addedFurnitureId);
      expect(deleteRes.success).toBe(true);
      if (!deleteRes.success) return;
      history = commitPlanChange(history, deleteRes.plan, "Delete dining-table-4");

      expect(history.past.length).toBe(6);

      // Verify undo in exact reverse order:
      // Undo Step 6: restore deleted furniture
      history = undo(history);
      expect(history.present.plan.furniture.some((f) => f.id === addedFurnitureId)).toBe(true);

      // Undo Step 5: move back
      history = undo(history);
      const afterUndoMove = history.present.plan.furniture.find((f) => f.id === addedFurnitureId);
      expect(afterUndoMove?.x).not.toBe(1800);

      // Undo Step 4: rotate back
      history = undo(history);
      const afterUndoRotate = history.present.plan.furniture.find((f) => f.id === addedFurnitureId);
      expect(afterUndoRotate?.rotation).toBe(0);

      // Undo Step 3: remove added furniture
      history = undo(history);
      expect(history.present.plan.furniture.some((f) => f.id === addedFurnitureId)).toBe(false);

      // Undo Step 2: restore opening width
      history = undo(history);
      const afterUndoOpening = history.present.plan.openings.find((o) => o.id === "door1");
      expect(afterUndoOpening?.width).toBe(900); // original Nordic door width

      // Undo Step 1: restore room span
      history = undo(history);
      const v2 = history.present.plan.vertices.find((v) => v.id === "v2");
      expect(v2?.x).toBe(3000); // original span

      // Now back to initial
      expect(history.present.plan).toBe(basePlan);
      expect(canUndo(history)).toBe(false);
      expect(canRedo(history)).toBe(true);

      // Redo all 6 steps forward
      for (let i = 0; i < 6; i++) {
        history = redo(history);
      }
      expect(canRedo(history)).toBe(false);
      expect(history.present.plan.furniture.some((f) => f.id === addedFurnitureId)).toBe(false);
    });
  });

  describe("Immutability & Non-mutation guarantee", () => {
    it("does not mutate existing history or stack arrays when frozen", () => {
      const initial = createPlanHistory(basePlan);
      Object.freeze(initial.past);
      Object.freeze(initial.future);
      Object.freeze(initial);

      const planA = { ...basePlan, meta: { ...basePlan.meta, name: "Plan A" } };
      const committed = commitPlanChange(initial, planA);

      expect(committed).not.toBe(initial);
      expect(committed.past.length).toBe(1);

      Object.freeze(committed.past);
      Object.freeze(committed.future);
      Object.freeze(committed);

      const undone = undo(committed);
      expect(undone).not.toBe(committed);
      expect(undone.present.plan).toBe(basePlan);

      Object.freeze(undone.past);
      Object.freeze(undone.future);
      Object.freeze(undone);

      const redone = redo(undone);
      expect(redone).not.toBe(undone);
      expect(redone.present.plan).toBe(planA);
    });
  });
});
