import { loadFloorPlanRecord } from "./migrations";
import type { FloorPlan } from "./types";

export interface SafeUpdateResult {
  success: boolean;
  plan?: FloorPlan;
  error?: string;
  originalRecord?: FloorPlan | null;
}

export interface FloorPlanRepository {
  load(id: string): Promise<FloorPlan | null>;
  save(id: string, plan: FloorPlan): Promise<void>;
  updateSafely(id: string, rawInput: unknown): Promise<SafeUpdateResult>;
  delete(id: string): Promise<boolean>;
}

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

/**
 * In-memory repository fake proving safe failure semantics.
 * Proves that corrupt data or unsupported schema versions fail safely
 * without overwriting or mutating the stored record.
 */
export class FakeFloorPlanRepository implements FloorPlanRepository {
  private records = new Map<string, FloorPlan>();

  async load(id: string): Promise<FloorPlan | null> {
    const found = this.records.get(id);
    return found ? deepClone(found) : null;
  }

  async save(id: string, plan: FloorPlan): Promise<void> {
    this.records.set(id, deepClone(plan));
  }

  async updateSafely(id: string, rawInput: unknown): Promise<SafeUpdateResult> {
    const existing = this.records.get(id);
    const originalRecord = existing ? deepClone(existing) : null;

    const migrationResult = loadFloorPlanRecord(rawInput);
    if (!migrationResult.ok) {
      // Safe failure: the stored record in this.records is completely untouched!
      return {
        success: false,
        error: migrationResult.error,
        originalRecord,
      };
    }

    // Success: store updated plan
    const updatedPlan = migrationResult.value;
    this.records.set(id, deepClone(updatedPlan));

    return {
      success: true,
      plan: deepClone(updatedPlan),
      originalRecord,
    };
  }

  async delete(id: string): Promise<boolean> {
    return this.records.delete(id);
  }

  clear(): void {
    this.records.clear();
  }
}
