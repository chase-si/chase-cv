import { describe, expect, it } from "vitest";
import { loadFloorPlanRecord, migrateFloorPlan } from "./migrations";
import { FakeFloorPlanRepository } from "./repository";
import {
  CORRUPT_PLANS,
  LEGACY_V0_FLOOR_PLAN,
  UNSUPPORTED_VERSION_FLOOR_PLAN,
  VALID_STANDARD_FLOOR_PLAN,
} from "./fixtures";

describe("AC-18: FloorPlan Migration & Safe Failure Repository", () => {
  describe("Schema Migration & Parsing", () => {
    it("loads current schema version (v1) directly into valid FloorPlan form", () => {
      const result = loadFloorPlanRecord(VALID_STANDARD_FLOOR_PLAN);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe(1);
        expect(result.value.unit).toBe("mm");
        expect(result.value.meta.name).toBe(VALID_STANDARD_FLOOR_PLAN.meta.name);
      }
    });

    it("migrates immediately previous schema version (v0) to current v1 form with mm units", () => {
      const result = loadFloorPlanRecord(LEGACY_V0_FLOOR_PLAN);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe(1);
        expect(result.value.unit).toBe("mm");
        // Check conversion from v0 wallIds / meters to v1 boundaryWallIds / mm
        expect(result.value.rooms[0].boundaryWallIds).toBeDefined();
        expect(result.value.rooms[0].boundaryWallIds.length).toBeGreaterThan(0);
        // Ensure coordinates were normalized to mm
        expect(result.value.walls[0].thickness).toBeGreaterThanOrEqual(100);
      }
    });

    it("fails safely on unsupported schema versions", () => {
      const result = loadFloorPlanRecord(UNSUPPORTED_VERSION_FLOOR_PLAN);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/unsupported schema version/i);
      }
    });

    it("fails safely on corrupt data without throwing unhandled exceptions", () => {
      for (const [name, corruptPayload] of Object.entries(CORRUPT_PLANS)) {
        const result = loadFloorPlanRecord(corruptPayload);
        expect(result.ok, `corrupt case "${name}" should fail safely`).toBe(false);
        if (!result.ok) {
          expect(result.error).toBeTruthy();
        }
      }
    });
  });

  describe("Repository-shaped Fake Safe Failure", () => {
    it("preserves original stored record when safe update receives corrupt data", async () => {
      const repo = new FakeFloorPlanRepository();
      const planId = "sample-plan-1";

      // 1. Seed repository with a valid v1 FloorPlan
      await repo.save(planId, VALID_STANDARD_FLOOR_PLAN);
      const originalRecord = await repo.load(planId);
      expect(originalRecord).toEqual(VALID_STANDARD_FLOOR_PLAN);

      // 2. Attempt update with corrupt payload
      const corruptUpdateResult = await repo.updateSafely(planId, CORRUPT_PLANS.brokenJson);
      expect(corruptUpdateResult.success).toBe(false);

      // 3. Prove original record remains intact
      const afterCorruptUpdate = await repo.load(planId);
      expect(afterCorruptUpdate).toEqual(VALID_STANDARD_FLOOR_PLAN);
    });

    it("preserves original stored record when safe update receives unsupported schema version", async () => {
      const repo = new FakeFloorPlanRepository();
      const planId = "sample-plan-2";

      // 1. Seed repository with a valid v1 FloorPlan
      await repo.save(planId, VALID_STANDARD_FLOOR_PLAN);

      // 2. Attempt update with unsupported version
      const unsupportedUpdateResult = await repo.updateSafely(planId, UNSUPPORTED_VERSION_FLOOR_PLAN);
      expect(unsupportedUpdateResult.success).toBe(false);

      // 3. Prove original record remains intact
      const afterUpdate = await repo.load(planId);
      expect(afterUpdate).toEqual(VALID_STANDARD_FLOOR_PLAN);
    });

    it("successfully updates stored record when receiving legacy v0 version after migration", async () => {
      const repo = new FakeFloorPlanRepository();
      const planId = "sample-plan-3";

      // 1. Seed repository
      await repo.save(planId, VALID_STANDARD_FLOOR_PLAN);

      // 2. Update with v0 legacy format
      const updateResult = await repo.updateSafely(planId, LEGACY_V0_FLOOR_PLAN);
      expect(updateResult.success).toBe(true);

      // 3. Stored record is now migrated v1
      const updatedRecord = await repo.load(planId);
      expect(updatedRecord).not.toBeNull();
      expect(updatedRecord?.version).toBe(1);
      expect(updatedRecord?.unit).toBe("mm");
    });
  });
});
