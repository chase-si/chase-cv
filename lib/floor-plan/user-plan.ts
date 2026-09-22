import type { FloorPlan, StandardFloorPlan } from "./types";
import { validateFloorPlan } from "./validators";

/**
 * Deep clone a floor plan object to guarantee absolute immutability.
 */
export function cloneFloorPlan<T extends FloorPlan>(plan: T): T {
  return JSON.parse(JSON.stringify(plan));
}

/**
 * Check if a FloorPlan is an editable User plan rather than a read-only Standard plan.
 */
export function isUserPlan(plan: FloorPlan): boolean {
  return plan.meta.source === "user" && !plan.meta.isStandard;
}

/**
 * Creates a new User plan working copy from a Standard plan (AC-2).
 * The original standard plan remains byte-for-byte unchanged.
 */
export function createOrResumeUserPlan(
  standardPlan: StandardFloorPlan | FloorPlan,
): FloorPlan {
  const templateId = standardPlan.meta.id ?? standardPlan.meta.name;
  const now = new Date().toISOString();

  const cloned = cloneFloorPlan(standardPlan);

  return {
    ...cloned,
    meta: {
      ...cloned.meta,
      id: `user-plan-${templateId}`,
      name: cloned.meta.name,
      source: "user",
      isStandard: false,
      templateId,
      createdAt: cloned.meta.createdAt || now,
      updatedAt: now,
    },
  };
}

/**
 * Serializes and exports a FloorPlan as formatted JSON (AC-16).
 * Validates the plan through canonical validateFloorPlan before exporting.
 */
export function exportFloorPlanAsJson(plan: FloorPlan): string {
  const validation = validateFloorPlan(plan);
  if (!validation.ok) {
    const errorDetails = validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Cannot export invalid FloorPlan: ${errorDetails}`);
  }

  return JSON.stringify(plan, null, 2);
}

/**
 * Browser helper to trigger a file download of the exported JSON document (AC-16).
 */
export function downloadFloorPlanJson(plan: FloorPlan, filename?: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const jsonContent = exportFloorPlanAsJson(plan);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const safeFilename =
    filename ??
    `${(plan.meta.name || "floor-plan").toLowerCase().replace(/[^a-z0-9_-]/g, "-")}-export.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
