import { loadFloorPlanRecord } from "./migrations";
import type { FloorPlan } from "./types";
import { cloneFloorPlan } from "./user-plan";

export interface DraftRecord {
  templateId: string;
  plan: unknown;
  savedAt: string;
}

export interface FloorPlanDraftStorage {
  getDraft(templateId: string): Promise<FloorPlan | null>;
  saveDraft(templateId: string, plan: FloorPlan): Promise<void>;
  deleteDraft(templateId: string): Promise<boolean>;
  hasDraft(templateId: string): Promise<boolean>;
  clear?(): Promise<void>;
}

/**
 * In-memory draft storage implementation (AC-15).
 * Used for deterministic SSR, unit/integration testing, and fallback.
 */
export class MemoryDraftStorage implements FloorPlanDraftStorage {
  private records = new Map<string, unknown>();

  async getDraft(templateId: string): Promise<FloorPlan | null> {
    const raw = this.records.get(templateId);
    if (raw === undefined || raw === null) {
      return null;
    }

    const migrationResult = loadFloorPlanRecord(raw);
    if (!migrationResult.ok) {
      // Safe failure: corrupt data returns null gracefully
      return null;
    }

    return cloneFloorPlan(migrationResult.value);
  }

  async saveDraft(templateId: string, plan: FloorPlan): Promise<void> {
    const cloned = cloneFloorPlan(plan);
    cloned.meta.updatedAt = new Date().toISOString();
    this.records.set(templateId, cloned);
  }

  async deleteDraft(templateId: string): Promise<boolean> {
    return this.records.delete(templateId);
  }

  async hasDraft(templateId: string): Promise<boolean> {
    const draft = await this.getDraft(templateId);
    return draft !== null;
  }

  async clear(): Promise<void> {
    this.records.clear();
  }

  /**
   * Directly seed raw payload for testing migrations & safe failure.
   */
  rawStoreSet(templateId: string, rawPayload: unknown): void {
    this.records.set(templateId, rawPayload);
  }
}

/**
 * Browser IndexedDB storage adapter (AC-15).
 * Persists one draft per standard plan ID into the browser's IndexedDB.
 */
export class IndexedDbDraftStorage implements FloorPlanDraftStorage {
  private dbName = "chase_floor_plan_drafts_v1";
  private storeName = "drafts";
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDb(): Promise<IDBDatabase> {
    if (typeof window === "undefined" || !("indexedDB" in window) || !window.indexedDB) {
      return Promise.reject(new Error("IndexedDB is not available in current environment"));
    }

    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: "templateId" });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
      } catch (err) {
        reject(err);
      }
    });

    return this.dbPromise;
  }

  async getDraft(templateId: string): Promise<FloorPlan | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const req = store.get(templateId);

        req.onsuccess = () => {
          const result = req.result as DraftRecord | undefined;
          if (!result || !result.plan) {
            resolve(null);
            return;
          }

          const migrationResult = loadFloorPlanRecord(result.plan);
          if (!migrationResult.ok) {
            // Safe failure: corrupt data fails gracefully
            resolve(null);
            return;
          }

          resolve(cloneFloorPlan(migrationResult.value));
        };

        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async saveDraft(templateId: string, plan: FloorPlan): Promise<void> {
    const db = await this.getDb();
    const cloned = cloneFloorPlan(plan);
    cloned.meta.updatedAt = new Date().toISOString();

    const record: DraftRecord = {
      templateId,
      plan: cloned,
      savedAt: cloned.meta.updatedAt,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error("Failed to save draft to IndexedDB"));
    });
  }

  async deleteDraft(templateId: string): Promise<boolean> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const req = store.delete(templateId);

        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  async hasDraft(templateId: string): Promise<boolean> {
    const draft = await this.getDraft(templateId);
    return draft !== null;
  }

  async clear(): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        const req = store.clear();

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // ignore
    }
  }
}

/**
 * Storage factory creating the appropriate storage adapter for current environment.
 */
export function createDraftStorage(type: "memory" | "indexeddb" | "auto" = "auto"): FloorPlanDraftStorage {
  if (type === "memory") {
    return new MemoryDraftStorage();
  }

  if (type === "indexeddb") {
    return new IndexedDbDraftStorage();
  }

  if (typeof window !== "undefined" && "indexedDB" in window && window.indexedDB) {
    return new IndexedDbDraftStorage();
  }

  return new MemoryDraftStorage();
}
