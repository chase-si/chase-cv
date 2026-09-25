import { describe, expect, it } from "vitest";
import * as migrationsModule from "./migrations";
import { loadFloorPlanRecord } from "./migrations";
import { FakeFloorPlanRepository } from "./repository";
import {
  CORRUPT_PLANS,
  UNSUPPORTED_VERSION_FLOOR_PLAN,
  VALID_STANDARD_FLOOR_PLAN,
} from "./fixtures";

describe("AC-18 & Issue #225: FloorPlan v2 Strict Contract & Safe Failure Repository", () => {
  describe("Schema Validation & Legacy Version Rejection", () => {
    it("loads current schema version (v2) directly into valid FloorPlan form", () => {
      const result = loadFloorPlanRecord(VALID_STANDARD_FLOOR_PLAN);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe(2);
        expect(result.value.unit).toBe("mm");
        expect(result.value.meta.name).toBe(VALID_STANDARD_FLOOR_PLAN.meta.name);
      }
    });

    it("removes legacy migrateV0ToV1 compatibility adapter from module exports", () => {
      expect("migrateV0ToV1" in migrationsModule).toBe(false);
      expect("PREVIOUS_FLOOR_PLAN_VERSION" in migrationsModule).toBe(false);
      expect(migrationsModule.CURRENT_FLOOR_PLAN_VERSION).toBe(2);
      expect(migrationsModule.SUPPORTED_SCHEMA_VERSIONS).toEqual([2]);
    });

    it("strictly rejects legacy v0 and v1 schema versions without migration fallback", () => {
      const v0Result = loadFloorPlanRecord(CORRUPT_PLANS.legacyVersionV0);
      expect(v0Result.ok).toBe(false);
      if (!v0Result.ok) {
        expect(v0Result.error).toMatch(/Unsupported schema version: 0/i);
      }

      const v1Result = loadFloorPlanRecord({
        ...VALID_STANDARD_FLOOR_PLAN,
        version: 1,
      });
      expect(v1Result.ok).toBe(false);
      if (!v1Result.ok) {
        expect(v1Result.error).toMatch(/Unsupported schema version: 1/i);
      }
    });

    it("fails safely on future unsupported schema versions", () => {
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

      await repo.save(planId, VALID_STANDARD_FLOOR_PLAN);
      const originalRecord = await repo.load(planId);
      expect(originalRecord).toEqual(VALID_STANDARD_FLOOR_PLAN);

      const corruptUpdateResult = await repo.updateSafely(planId, CORRUPT_PLANS.brokenJson);
      expect(corruptUpdateResult.success).toBe(false);

      const afterCorruptUpdate = await repo.load(planId);
      expect(afterCorruptUpdate).toEqual(VALID_STANDARD_FLOOR_PLAN);
    });

    it("preserves original stored record when safe update receives legacy v0/v1 or unsupported schema version", async () => {
      const repo = new FakeFloorPlanRepository();
      const planId = "sample-plan-2";

      await repo.save(planId, VALID_STANDARD_FLOOR_PLAN);

      const v1UpdateResult = await repo.updateSafely(planId, {
        ...VALID_STANDARD_FLOOR_PLAN,
        version: 1,
      });
      expect(v1UpdateResult.success).toBe(false);

      const unsupportedUpdateResult = await repo.updateSafely(
        planId,
        UNSUPPORTED_VERSION_FLOOR_PLAN,
      );
      expect(unsupportedUpdateResult.success).toBe(false);

      const afterUpdate = await repo.load(planId);
      expect(afterUpdate).toEqual(VALID_STANDARD_FLOOR_PLAN);
    });
  });
});
