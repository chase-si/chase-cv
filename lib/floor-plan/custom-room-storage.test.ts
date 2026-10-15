import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CUSTOM_ROOM_STORAGE_KEY,
  CUSTOM_ROOM_STORAGE_VERSION,
  deleteCustomRoomRecord,
  duplicateCustomRoomRecord,
  loadCustomRoomStorage,
  renameCustomRoomRecord,
  saveCustomRoomRecord,
  setLastActivePlan,
} from "./custom-room-storage";
import { createRectangularRoomPlan } from "./rectangular-room";

class MockStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe("Resilient Custom Room Local Storage (AC-4, AC-5)", () => {
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
  });

  it("AC-4: loads empty valid initial document when storage is empty", () => {
    const res = loadCustomRoomStorage(mockStorage);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.doc.version).toBe(CUSTOM_ROOM_STORAGE_VERSION);
      expect(res.doc.rooms).toEqual([]);
      expect(res.doc.lastActive).toBeUndefined();
    }
  });

  it("AC-4: saves and loads multiple custom room records with net dimensions and full floor plans", () => {
    const room1 = createRectangularRoomPlan({ name: "客厅", widthMm: 3500, depthMm: 5000 });
    const room2 = createRectangularRoomPlan({ name: "书房", widthMm: 2800, depthMm: 3200 });

    const save1 = saveCustomRoomRecord(room1.record, mockStorage);
    expect(save1.ok).toBe(true);

    const save2 = saveCustomRoomRecord(room2.record, mockStorage);
    expect(save2.ok).toBe(true);

    const loaded = loadCustomRoomStorage(mockStorage);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.doc.rooms).toHaveLength(2);
      expect(loaded.doc.rooms[0].name).toBe("客厅");
      expect(loaded.doc.rooms[0].widthMm).toBe(3500);
      expect(loaded.doc.rooms[0].depthMm).toBe(5000);
      expect(loaded.doc.rooms[0].plan.vertices).toHaveLength(4);

      expect(loaded.doc.rooms[1].name).toBe("书房");
      expect(loaded.doc.rooms[1].widthMm).toBe(2800);
      expect(loaded.doc.rooms[1].depthMm).toBe(3200);

      expect(loaded.doc.lastActive).toEqual({
        type: "custom",
        id: room2.record.id,
      });
    }
  });

  it("AC-4: updates existing room record in place without duplicating or corrupting other records", () => {
    const room1 = createRectangularRoomPlan({ name: "房间 A", widthMm: 3000, depthMm: 4000 });
    const room2 = createRectangularRoomPlan({ name: "房间 B", widthMm: 3000, depthMm: 4000 });

    saveCustomRoomRecord(room1.record, mockStorage);
    saveCustomRoomRecord(room2.record, mockStorage);

    // Update room1 with new plan and name
    const updatedRoom1 = {
      ...room1.record,
      name: "房间 A (已重命名)",
      plan: {
        ...room1.record.plan,
        meta: {
          ...room1.record.plan.meta,
          name: "房间 A (已重命名)",
        },
      },
    };

    const updateRes = saveCustomRoomRecord(updatedRoom1, mockStorage);
    expect(updateRes.ok).toBe(true);

    const loaded = loadCustomRoomStorage(mockStorage);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.doc.rooms).toHaveLength(2);
      expect(loaded.doc.rooms[0].name).toBe("房间 A (已重命名)");
      expect(loaded.doc.rooms[1].name).toBe("房间 B");
    }
  });

  it("AC-4: safe failure on corrupt JSON without overwriting existing storage", () => {
    const corruptPayload = "{ invalid json !!! ";
    mockStorage.setItem(CUSTOM_ROOM_STORAGE_KEY, corruptPayload);

    const loadRes = loadCustomRoomStorage(mockStorage);
    expect(loadRes.ok).toBe(false);
    if (!loadRes.ok) {
      expect(loadRes.error).toContain("JSON parse error");
    }

    // Crucial requirement: corrupt data is NOT silently overwritten
    expect(mockStorage.getItem(CUSTOM_ROOM_STORAGE_KEY)).toBe(corruptPayload);
  });

  it("AC-4: safe failure on unsupported version without overwriting storage", () => {
    const futureDoc = JSON.stringify({
      version: 99,
      rooms: [],
    });
    mockStorage.setItem(CUSTOM_ROOM_STORAGE_KEY, futureDoc);

    const loadRes = loadCustomRoomStorage(mockStorage);
    expect(loadRes.ok).toBe(false);
    if (!loadRes.ok) {
      expect(loadRes.error).toContain("Unsupported storage version");
    }

    // Corrupt/future version is NOT overwritten
    expect(mockStorage.getItem(CUSTOM_ROOM_STORAGE_KEY)).toBe(futureDoc);
  });

  it("AC-4: gracefully handles storage quota errors and returns failure without crashing", () => {
    const room = createRectangularRoomPlan({});
    mockStorage.setItem = vi.fn(() => {
      throw new Error("QuotaExceededError: LocalStorage limit reached");
    });

    const saveRes = saveCustomRoomRecord(room.record, mockStorage);
    expect(saveRes.ok).toBe(false);
    if (!saveRes.ok) {
      expect(saveRes.error).toContain("QuotaExceededError");
    }
  });

  it("AC-5: sets and restores last active plan (both standard and custom)", () => {
    const room = createRectangularRoomPlan({});
    saveCustomRoomRecord(room.record, mockStorage);

    // Track standard plan selection
    setLastActivePlan("standard", "plan-cn-sh-ruidong-2br-67", mockStorage);
    let loaded = loadCustomRoomStorage(mockStorage);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.doc.lastActive).toEqual({
        type: "standard",
        id: "plan-cn-sh-ruidong-2br-67",
      });
    }

    // Track custom room selection
    setLastActivePlan("custom", room.record.id, mockStorage);
    loaded = loadCustomRoomStorage(mockStorage);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.doc.lastActive).toEqual({
        type: "custom",
        id: room.record.id,
      });
    }
  });

  it("AC-12: duplicateCustomRoomRecord deep copies dimensions, openings, furniture, generates new id, and sets as last active", () => {
    const original = createRectangularRoomPlan({
      name: "主卧",
      widthMm: 3600,
      depthMm: 4800,
    });
    // Add opening and furniture to original plan
    original.record.plan.openings = [
      { id: "op-1", type: "door", wallId: "w-top", position: 0.5, width: 900 },
    ];
    original.record.plan.furniture = [
      { id: "f-1", definitionId: "bed-double", x: 1200, y: 1500, width: 1500, depth: 2000, rotation: 0 },
    ];
    saveCustomRoomRecord(original.record, mockStorage);

    // Duplicate in zh
    const dupRes = duplicateCustomRoomRecord(original.record.id, "zh", mockStorage);
    expect(dupRes.ok).toBe(true);
    expect(dupRes.duplicatedRecord).toBeDefined();
    expect(dupRes.duplicatedRecord?.id).not.toBe(original.record.id);
    expect(dupRes.duplicatedRecord?.name).toBe("主卧 副本");
    expect(dupRes.duplicatedRecord?.widthMm).toBe(3600);
    expect(dupRes.duplicatedRecord?.depthMm).toBe(4800);
    expect(dupRes.duplicatedRecord?.plan.openings).toHaveLength(1);
    expect(dupRes.duplicatedRecord?.plan.furniture).toHaveLength(1);

    // Verify localStorage has both rooms and lastActive is the duplicate
    const loaded = loadCustomRoomStorage(mockStorage);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) {
      expect(loaded.doc.rooms).toHaveLength(2);
      expect(loaded.doc.lastActive).toEqual({
        type: "custom",
        id: dupRes.duplicatedRecord!.id,
      });

      // Mutate duplicated room furniture - verify original is unaffected
      const dupRecord = dupRes.duplicatedRecord!;
      dupRecord.plan.furniture[0].x = 9999;
      saveCustomRoomRecord(dupRecord, mockStorage);

      const reloaded = loadCustomRoomStorage(mockStorage);
      if (reloaded.ok) {
        const origInStorage = reloaded.doc.rooms.find((r) => r.id === original.record.id);
        expect(origInStorage?.plan.furniture[0].x).toBe(1200);
      }
    }
  });

  it("AC-12: duplicateCustomRoomRecord in en uses 'Copy' suffix and auto-names if name is empty", () => {
    const unnamed = createRectangularRoomPlan({
      name: "",
      widthMm: 3000,
      depthMm: 4000,
      locale: "en",
    });
    saveCustomRoomRecord(unnamed.record, mockStorage);

    const dupRes = duplicateCustomRoomRecord(unnamed.record.id, "en", mockStorage);
    expect(dupRes.ok).toBe(true);
    expect(dupRes.duplicatedRecord?.name).toContain("Copy");
  });

  it("AC-12: renameCustomRoomRecord updates name without clearing openings or furniture, and auto-names when blank", () => {
    const room = createRectangularRoomPlan({
      name: "旧名字",
      widthMm: 3000,
      depthMm: 4000,
    });
    room.record.plan.furniture = [
      { id: "f-1", definitionId: "bed-single", x: 1000, y: 1000, width: 1200, depth: 2000, rotation: 0 },
    ];
    saveCustomRoomRecord(room.record, mockStorage);

    // Rename to new valid name
    const renameRes = renameCustomRoomRecord(room.record.id, "新主卧", "zh", mockStorage);
    expect(renameRes.ok).toBe(true);

    let loaded = loadCustomRoomStorage(mockStorage);
    if (loaded.ok) {
      const found = loaded.doc.rooms.find((r) => r.id === room.record.id);
      expect(found?.name).toBe("新主卧");
      expect(found?.plan.meta.name).toBe("新主卧");
      // Preserves furniture layout (AC-12: 改名不清空布局)
      expect(found?.plan.furniture).toHaveLength(1);
    }

    // Rename with blank string -> auto-names
    const blankRenameRes = renameCustomRoomRecord(room.record.id, "   ", "zh", mockStorage);
    expect(blankRenameRes.ok).toBe(true);

    loaded = loadCustomRoomStorage(mockStorage);
    if (loaded.ok) {
      const found = loaded.doc.rooms.find((r) => r.id === room.record.id);
      expect(found?.name.trim().length).toBeGreaterThan(0);
      expect(found?.name).not.toBe("   ");
    }
  });

  it("AC-12: deleteCustomRoomRecord removes room, switches to other custom room or falls back to default standard plan", () => {
    const room1 = createRectangularRoomPlan({ name: "房间 1" });
    const room2 = createRectangularRoomPlan({ name: "房间 2" });
    saveCustomRoomRecord(room1.record, mockStorage);
    saveCustomRoomRecord(room2.record, mockStorage);

    // Current active is room2
    setLastActivePlan("custom", room2.record.id, mockStorage);

    // Delete room2 (active room)
    const delRes1 = deleteCustomRoomRecord(room2.record.id, mockStorage);
    expect(delRes1.ok).toBe(true);
    expect(delRes1.nextActive?.type).toBe("custom");
    expect(delRes1.nextActive?.id).toBe(room1.record.id);

    let loaded = loadCustomRoomStorage(mockStorage);
    if (loaded.ok) {
      expect(loaded.doc.rooms).toHaveLength(1);
      expect(loaded.doc.lastActive).toEqual({
        type: "custom",
        id: room1.record.id,
      });
    }

    // Delete room1 (last remaining custom room)
    const delRes2 = deleteCustomRoomRecord(room1.record.id, mockStorage);
    expect(delRes2.ok).toBe(true);
    expect(delRes2.nextActive?.type).toBe("standard");

    loaded = loadCustomRoomStorage(mockStorage);
    if (loaded.ok) {
      expect(loaded.doc.rooms).toHaveLength(0);
      expect(loaded.doc.lastActive?.type).toBe("standard");
    }
  });
});

