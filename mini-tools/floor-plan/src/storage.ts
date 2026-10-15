import { getStandardPlans } from "@/lib/floor-plan/catalog";
import { STANDARD_FURNITURE_CATALOG } from "@/lib/floor-plan/furniture-catalog";
import { applyPlacementScenarioToFloorPlan, floorPlanToPlacementScenario } from "@/lib/floor-plan/placement-scenario";
import { validatePlacementScenario } from "@/lib/floor-plan/validators";
import type { FloorPlan, PlacementScenario } from "@/lib/floor-plan/types";

export const plans = getStandardPlans("zh");
export const STORAGE_KEY = "floor-plan-mini-tool-v1";
export interface SavedWorkspace { activePlanId: string; drafts: Record<string, PlacementScenario> }

export function readWorkspace(): SavedWorkspace {
  const empty = { activePlanId: plans[0].id, drafts: {} };
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!value || typeof value !== "object") return empty;
    const drafts: SavedWorkspace["drafts"] = {};
    for (const [id, candidate] of Object.entries(value.drafts ?? {})) {
      const result = validatePlacementScenario(candidate);
      if (!result.ok || result.value.planId !== id || !plans.some((p) => p.id === id)) continue;
      const valid = result.value.placements.every((p) => STANDARD_FURNITURE_CATALOG.definitions
        .find((d) => d.id === p.definitionId)?.specifications.some((s) => s.id === p.specificationId));
      if (valid && result.value.placements.length <= 100) drafts[id] = result.value;
    }
    return { activePlanId: plans.some((p) => p.id === value.activePlanId) ? value.activePlanId : empty.activePlanId, drafts };
  } catch { return empty; }
}

export function loadPlan(id: string, drafts: SavedWorkspace["drafts"]): FloorPlan {
  const base = plans.find((p) => p.id === id)!.plan;
  return applyPlacementScenarioToFloorPlan(base, drafts[id] ?? floorPlanToPlacementScenario(base));
}
