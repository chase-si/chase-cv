import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CUSTOM_ROOM_STORAGE_KEY,
  CUSTOM_ROOM_STORAGE_VERSION,
  loadCustomRoomStorage,
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
});
