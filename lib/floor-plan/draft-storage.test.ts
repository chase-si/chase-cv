import { beforeEach, describe, expect, it } from "vitest";
import {
  createDraftStorage,
  IndexedDbDraftStorage,
  MemoryDraftStorage,
  type FloorPlanDraftStorage,
} from "./draft-storage";
import {
  CORRUPT_PLANS,
  LEGACY_V0_FLOOR_PLAN,
  VALID_STANDARD_FLOOR_PLAN,
} from "./fixtures";
import { createOrResumeUserPlan } from "./user-plan";

describe("AC-15: Draft Storage Repository & Dual Adapters", () => {
  const templatePlan = VALID_STANDARD_FLOOR_PLAN;
  const templateId = templatePlan.meta.id ?? "plan-std-2br-01";

  describe("MemoryDraftStorage", () => {
    let storage: FloorPlanDraftStorage;

    beforeEach(() => {
      storage = new MemoryDraftStorage();
    });

    it("persists and retrieves exactly one draft per Standard plan (AC-15)", async () => {
      expect(await storage.hasDraft(templateId)).toBe(false);
      expect(await storage.getDraft(templateId)).toBeNull();

      const userPlan = createOrResumeUserPlan(templatePlan);
      userPlan.meta.name = "Customized Nordic 2BR Draft";

      await storage.saveDraft(templateId, userPlan);

      expect(await storage.hasDraft(templateId)).toBe(true);
      const retrieved = await storage.getDraft(templateId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.meta.name).toBe("Customized Nordic 2BR Draft");
      expect(retrieved?.meta.templateId).toBe(templateId);

      // Overwriting updates the single draft for this template
      const updatedUserPlan = { ...userPlan, meta: { ...userPlan.meta, name: "Second Revision" } };
      await storage.saveDraft(templateId, updatedUserPlan);

      const secondRetrieved = await storage.getDraft(templateId);
      expect(secondRetrieved?.meta.name).toBe("Second Revision");

      // Deleting draft
      const deleted = await storage.deleteDraft(templateId);
      expect(deleted).toBe(true);
      expect(await storage.hasDraft(templateId)).toBe(false);
      expect(await storage.getDraft(templateId)).toBeNull();
    });

    it("isolates drafts across different template IDs", async () => {
      const template1 = "plan-std-2br-01";
      const template2 = "plan-std-studio-01";

      const plan1 = createOrResumeUserPlan(templatePlan);
      plan1.meta.name = "Plan 1 Draft";

      const plan2 = createOrResumeUserPlan({
        ...templatePlan,
        meta: { ...templatePlan.meta, id: template2, name: "Studio Template" },
      });
      plan2.meta.name = "Plan 2 Draft";

      await storage.saveDraft(template1, plan1);
      await storage.saveDraft(template2, plan2);

      expect((await storage.getDraft(template1))?.meta.name).toBe("Plan 1 Draft");
      expect((await storage.getDraft(template2))?.meta.name).toBe("Plan 2 Draft");

      await storage.deleteDraft(template1);
      expect(await storage.hasDraft(template1)).toBe(false);
      expect(await storage.hasDraft(template2)).toBe(true);
    });

    it("migrates legacy v0 drafts automatically on retrieval", async () => {
      // Inject legacy v0 format directly into storage
      const memory = storage as MemoryDraftStorage;
      memory.rawStoreSet(templateId, LEGACY_V0_FLOOR_PLAN);

      const retrieved = await storage.getDraft(templateId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.version).toBe(1);
      expect(retrieved?.unit).toBe("mm");
      expect(retrieved?.rooms[0].boundaryWallIds).toBeDefined();
    });

    it("fails safely and returns null on corrupted draft data without crashing", async () => {
      const memory = storage as MemoryDraftStorage;
      memory.rawStoreSet(templateId, CORRUPT_PLANS.brokenJson);

      const retrieved = await storage.getDraft(templateId);
      expect(retrieved).toBeNull();
    });
  });

  describe("createDraftStorage Factory", () => {
    it("returns MemoryDraftStorage when explicitly requested or in non-browser environment", () => {
      const memoryStorage = createDraftStorage("memory");
      expect(memoryStorage).toBeInstanceOf(MemoryDraftStorage);
    });

    it("instantiates IndexedDbDraftStorage when requested", () => {
      const idbStorage = createDraftStorage("indexeddb");
      expect(idbStorage).toBeInstanceOf(IndexedDbDraftStorage);
    });
  });
});
