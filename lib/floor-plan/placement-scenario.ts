import { CANONICAL_UNIT } from "./types";
import type {
  FloorPlan,
  FurnitureCatalog,
  FurnitureInstance,
  FurniturePlacement,
  FurnitureRotation,
  PlacementScenario,
  SpaceRuleConfig,
  StandardFloorPlan,
  SpaceAssessment,
} from "./types";
import { STANDARD_FURNITURE_CATALOG } from "./furniture-catalog";
import { cloneFloorPlan } from "./user-plan";
import { evaluatePlanRules, type RuleResult } from "./rules";
import { assessPlacementScenario } from "./space-assessment";
import {
  summarizeFurnitureDecision,
  type FurnitureDecisionSummary,
} from "./furniture-decision";

/**
 * Normalizes an angle into one of the 4 standard cardinal rotations (0, 90, 180, 270).
 */
export function normalizeRotation(angle: number): FurnitureRotation {
  const norm = ((Math.round(angle) % 360) + 360) % 360;
  if (norm === 90 || norm === 180 || norm === 270) {
    return norm;
  }
  return 0;
}

/**
 * Creates a new independent PlacementScenario for a given standard plan ID.
 */
export function createPlacementScenario(
  planId: string,
  initialPlacements?: FurniturePlacement[],
  targetPlacementId?: string,
): PlacementScenario {
  const placements = initialPlacements ? initialPlacements.map((p) => ({ ...p })) : [];
  const validTargetId =
    targetPlacementId && placements.some((p) => p.id === targetPlacementId)
      ? targetPlacementId
      : undefined;

  return {
    version: 1,
    unit: CANONICAL_UNIT,
    planId,
    placements,
    targetPlacementId: validTargetId,
  };
}

/**
 * Adds a furniture placement to the scenario without mutating the StandardFloorPlan topology (AC-2).
 */
export function addPlacement(
  scenario: PlacementScenario,
  _plan: StandardFloorPlan,
  placement: FurniturePlacement,
): PlacementScenario {
  const existingIdx = scenario.placements.findIndex((p) => p.id === placement.id);
  const normalizedPlacement: FurniturePlacement = {
    ...placement,
    rotation: normalizeRotation(placement.rotation),
    x: Math.round(placement.x),
    y: Math.round(placement.y),
  };

  const nextPlacements =
    existingIdx >= 0
      ? scenario.placements.map((p, idx) => (idx === existingIdx ? normalizedPlacement : p))
      : [...scenario.placements, normalizedPlacement];

  return {
    ...scenario,
    placements: nextPlacements,
  };
}

/**
 * Updates an existing placement patch without mutating the StandardFloorPlan topology (AC-2).
 */
export function updatePlacement(
  scenario: PlacementScenario,
  _plan: StandardFloorPlan,
  placementId: string,
  patch: Partial<Pick<FurniturePlacement, "x" | "y" | "rotation" | "specificationId">>,
): PlacementScenario {
  const nextPlacements = scenario.placements.map((p) => {
    if (p.id !== placementId) return p;
    return {
      ...p,
      ...(patch.x !== undefined ? { x: Math.round(patch.x) } : {}),
      ...(patch.y !== undefined ? { y: Math.round(patch.y) } : {}),
      ...(patch.rotation !== undefined ? { rotation: normalizeRotation(patch.rotation) } : {}),
      ...(patch.specificationId !== undefined ? { specificationId: patch.specificationId } : {}),
    };
  });

  return {
    ...scenario,
    placements: nextPlacements,
  };
}

/**
 * Moves an existing placement to new (x, y) coordinates without mutating the StandardFloorPlan (AC-2).
 */
export function movePlacement(
  scenario: PlacementScenario,
  plan: StandardFloorPlan,
  placementId: string,
  x: number,
  y: number,
): PlacementScenario {
  return updatePlacement(scenario, plan, placementId, { x, y });
}

/**
 * Rotates an existing placement without mutating the StandardFloorPlan (AC-2).
 */
export function rotatePlacement(
  scenario: PlacementScenario,
  plan: StandardFloorPlan,
  placementId: string,
  rotation: FurnitureRotation,
): PlacementScenario {
  return updatePlacement(scenario, plan, placementId, { rotation });
}

/**
 * Switches the specification of an existing placement without mutating the StandardFloorPlan (AC-2).
 */
export function changePlacementSpecification(
  scenario: PlacementScenario,
  plan: StandardFloorPlan,
  placementId: string,
  specificationId: string,
): PlacementScenario {
  return updatePlacement(scenario, plan, placementId, { specificationId });
}

/**
 * Removes a placement from the scenario without mutating the StandardFloorPlan (AC-2).
 * If the removed placement was the active target, targetPlacementId is cleared to undefined.
 */
export function removePlacement(
  scenario: PlacementScenario,
  _plan: StandardFloorPlan,
  placementId: string,
): PlacementScenario {
  const nextPlacements = scenario.placements.filter((p) => p.id !== placementId);
  const nextTargetId =
    scenario.targetPlacementId === placementId ? undefined : scenario.targetPlacementId;

  return {
    ...scenario,
    placements: nextPlacements,
    targetPlacementId: nextTargetId,
  };
}

/**
 * Sets or unsets the single target placement that drives primary evaluation statements (AC-3).
 */
export function setTargetPlacement(
  scenario: PlacementScenario,
  placementId?: string,
): PlacementScenario {
  if (!placementId) {
    return {
      ...scenario,
      targetPlacementId: undefined,
    };
  }

  const exists = scenario.placements.some((p) => p.id === placementId);
  return {
    ...scenario,
    targetPlacementId: exists ? placementId : undefined,
  };
}

/**
 * Converts a legacy FloorPlan into an independent PlacementScenario.
 */
export function floorPlanToPlacementScenario(
  plan: FloorPlan,
  targetPlacementId?: string,
): PlacementScenario {
  const planId = plan.meta.id ?? "anonymous-plan";
  const placements: FurniturePlacement[] = (plan.furniture ?? []).map((f) => {
    const specId = (f as any).specificationId ?? `${f.definitionId}-default`;
    return {
      id: f.id,
      definitionId: f.definitionId,
      specificationId: specId,
      x: f.x,
      y: f.y,
      rotation: normalizeRotation(f.rotation),
    };
  });

  const validTargetId =
    targetPlacementId && placements.some((p) => p.id === targetPlacementId)
      ? targetPlacementId
      : placements[0]?.id;

  return {
    version: 1,
    unit: CANONICAL_UNIT,
    planId,
    placements,
    targetPlacementId: validTargetId,
  };
}

export const placementScenarioFromFloorPlan = floorPlanToPlacementScenario;

/**
 * Converts placements in a PlacementScenario into legacy FurnitureInstance items,
 * resolving dimensions from the furniture definition / specification.
 */
export function placementScenarioToFurnitureInstances(
  scenario: PlacementScenario,
  catalog: FurnitureCatalog = STANDARD_FURNITURE_CATALOG,
): FurnitureInstance[] {
  return scenario.placements.map((p) => {
    const def = catalog.definitions.find((d) => d.id === p.definitionId);
    const spec = def?.specifications?.find((s) => s.id === p.specificationId);
    let width = spec?.width ?? def?.defaultSize?.width ?? 1000;
    let depth = spec?.depth ?? def?.defaultSize?.depth ?? 1000;
    const height = spec?.height ?? def?.defaultSize?.height;

    // If specification was not directly found by id, check for dimension pattern in specificationId
    if (!spec) {
      const dimMatch = p.specificationId.match(/(\d+)x(\d+)/i);
      if (dimMatch) {
        const parsedW = parseInt(dimMatch[1], 10);
        const parsedD = parseInt(dimMatch[2], 10);
        if (parsedW > 0 && parsedD > 0) {
          width = parsedW;
          depth = parsedD;
        }
      }
    }

    return {
      id: p.id,
      definitionId: p.definitionId,
      specificationId: p.specificationId,
      x: p.x,
      y: p.y,
      width,
      depth,
      rotation: p.rotation,
      ...(height !== undefined ? { elevation: 0 } : {}),
    };
  });
}

/**
 * Combines a read-only StandardFloorPlan with a PlacementScenario into a new FloorPlan object,
 * strictly guaranteeing that the original StandardFloorPlan is not mutated (AC-2).
 */
export function applyPlacementScenarioToFloorPlan(
  plan: StandardFloorPlan | FloorPlan,
  scenario: PlacementScenario,
  catalog: FurnitureCatalog = STANDARD_FURNITURE_CATALOG,
): FloorPlan {
  const combined = cloneFloorPlan(plan);
  combined.furniture = placementScenarioToFurnitureInstances(scenario, catalog);
  return combined;
}

export interface EvaluatePlacementScenarioOptions {
  catalog?: FurnitureCatalog;
  config?: SpaceRuleConfig;
  targetRoomId?: string | null;
  locale?: string;
}

export interface PlacementScenarioEvaluationResult {
  scenario: PlacementScenario;
  targetPlacement: FurniturePlacement | null;
  ruleResults: RuleResult[];
  summary: FurnitureDecisionSummary;
  assessment: SpaceAssessment;
}

/**
 * Evaluates a PlacementScenario against a StandardFloorPlan (AC-3).
 *
 * Guarantees:
 * - StandardFloorPlan topology is not mutated (AC-2).
 * - All furniture in the scenario are retained and participate in calculation (AC-3).
 * - targetPlacementId independently drives the primary decision summary (AC-3).
 * - When targetPlacementId is undefined, no primary target is highlighted but full calculation is retained (AC-3).
 */
export function evaluatePlacementScenario(
  plan: StandardFloorPlan,
  scenario: PlacementScenario,
  options: EvaluatePlacementScenarioOptions = {},
): PlacementScenarioEvaluationResult {
  const { catalog = STANDARD_FURNITURE_CATALOG, config, targetRoomId, locale } = options;

  // Combine standard plan topology with scenario placements without modifying plan
  const combinedPlan = applyPlacementScenarioToFloorPlan(plan, scenario, catalog);

  // Evaluate all spatial rules for all placements in the scenario
  const ruleResults = evaluatePlanRules(combinedPlan, config);

  // Find target placement if one is selected
  const targetPlacement = scenario.targetPlacementId
    ? scenario.placements.find((p) => p.id === scenario.targetPlacementId) ?? null
    : null;

  // Perform structured space assessment (Contract Section 4, Issue #219)
  const assessment = assessPlacementScenario(plan, scenario, catalog, {
    targetPlacementId: targetPlacement?.id,
    focusRoomId: targetRoomId ?? undefined,
  });

  // Summarize decision focused on target furniture (if selected)
  const summary = summarizeFurnitureDecision({
    plan: combinedPlan,
    targetRoomId,
    targetFurnitureId: targetPlacement?.id,
    ruleResults,
    config,
    locale,
  });

  return {
    scenario,
    targetPlacement,
    ruleResults,
    summary,
    assessment,
  };
}
