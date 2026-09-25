import {
  computeFloorPlanBounds,
  computePolygonCentroid,
  computeRoomPolygon,
  getVertexMap,
  getWallMap,
} from "./geometry";
import type {
  FloorPlan,
  FurnitureCatalog,
  FurnitureDefinition,
  FurnitureInstance,
  FurnitureSpecification,
} from "./types";

import { cloneFloorPlan } from "./user-plan";

export interface PlacementOptions {
  x?: number;
  y?: number;
  rotation?: number;
  id?: string;
  roomId?: string;
  specificationId?: string;
}

export type ChangeSpecificationResult =
  | {
      success: true;
      plan: FloorPlan;
      instance: FurnitureInstance;
      specification: FurnitureSpecification;
    }
  | {
      success: false;
      error: string;
    };

export type AddFurnitureResult =
  | {
      success: true;
      plan: FloorPlan;
      instance: FurnitureInstance;
    }
  | {
      success: false;
      error: string;
    };

export type MoveFurnitureResult =
  | {
      success: true;
      plan: FloorPlan;
      instance: FurnitureInstance;
    }
  | {
      success: false;
      error: string;
    };

export type RotateFurnitureResult =
  | {
      success: true;
      plan: FloorPlan;
      instance: FurnitureInstance;
    }
  | {
      success: false;
      error: string;
    };

export type DeleteFurnitureResult =
  | {
      success: true;
      plan: FloorPlan;
      deletedId: string;
    }
  | {
      success: false;
      error: string;
    };

export interface FurnitureInstanceDetails {
  instance: FurnitureInstance;
  definition?: FurnitureDefinition;
  specification?: FurnitureSpecification;
}

/**
 * Computes deterministic initial drop position in selected room (AC-13).
 * Uses room polygon centroid or boundary wall midpoint without optimal layout search.
 */
export function computeRoomInitialDropPosition(
  plan: FloorPlan,
  roomId: string,
): { x: number; y: number } | null {
  const room = plan.rooms.find((r) => r.id === roomId);
  if (!room) return null;

  const vertexMap = getVertexMap(plan);
  const wallMap = getWallMap(plan);
  const poly = computeRoomPolygon(room, wallMap, vertexMap);

  if (poly.length >= 3) {
    const centroid = computePolygonCentroid(poly);
    if (Number.isFinite(centroid.x) && Number.isFinite(centroid.y)) {
      return {
        x: Math.round(centroid.x),
        y: Math.round(centroid.y),
      };
    }
  }

  // Fallback to bounding box of boundary walls
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const wid of room.boundaryWallIds) {
    const w = wallMap.get(wid);
    if (!w) continue;
    const fromV = vertexMap.get(w.from);
    const toV = vertexMap.get(w.to);
    if (fromV) {
      minX = Math.min(minX, fromV.x);
      maxX = Math.max(maxX, fromV.x);
      minY = Math.min(minY, fromV.y);
      maxY = Math.max(maxY, fromV.y);
    }
    if (toV) {
      minX = Math.min(minX, toV.x);
      maxX = Math.max(maxX, toV.x);
      minY = Math.min(minY, toV.y);
      maxY = Math.max(maxY, toV.y);
    }
  }

  if (
    Number.isFinite(minX) &&
    Number.isFinite(maxX) &&
    Number.isFinite(minY) &&
    Number.isFinite(maxY)
  ) {
    return {
      x: Math.round((minX + maxX) / 2),
      y: Math.round((minY + maxY) / 2),
    };
  }

  return null;
}

/**
 * Adds an item strictly deriving its dimensions from a predefined specification in definition (AC-4, AC-10, AC-13).
 * Guarantees FurnitureDefinition remains immutable.
 */
export function addFurnitureInstance(
  plan: FloorPlan,
  catalog: FurnitureCatalog,
  definitionId: string,
  placement?: PlacementOptions,
): AddFurnitureResult {
  const def = catalog.definitions.find((d) => d.id === definitionId);
  if (!def) {
    return {
      success: false,
      error: `Furniture definition "${definitionId}" not found in catalog.`,
    };
  }

  const selectedSpec = placement?.specificationId
    ? def.specifications.find((s) => s.id === placement.specificationId)
    : def.specifications[0];

  if (!selectedSpec) {
    return {
      success: false,
      error: placement?.specificationId
        ? `Furniture specification "${placement.specificationId}" not found for definition "${def.id}".`
        : `Furniture definition "${def.id}" has no predefined specifications.`,
    };
  }

  let posX = placement?.x;
  let posY = placement?.y;

  if ((posX === undefined || posY === undefined) && placement?.roomId) {
    const roomDrop = computeRoomInitialDropPosition(plan, placement.roomId);
    if (roomDrop) {
      if (posX === undefined) posX = roomDrop.x;
      if (posY === undefined) posY = roomDrop.y;
    }
  }

  if (posX === undefined || posY === undefined) {
    const bounds = computeFloorPlanBounds(plan);
    posX = bounds.width > 0 ? Math.round(bounds.centerX) : 2000;
    posY = bounds.height > 0 ? Math.round(bounds.centerY) : 2000;
  }

  const rawRot = placement?.rotation ?? 0;
  const rotation = ((rawRot % 360) + 360) % 360;
  const id =
    placement?.id ?? `f-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Dimensions strictly resolved from predefined specification
  const instance: FurnitureInstance = {
    id,
    definitionId: def.id,
    specificationId: selectedSpec.id,
    x: Math.round(posX),
    y: Math.round(posY),
    width: selectedSpec.width,
    depth: selectedSpec.depth,
    rotation,
    ...(selectedSpec.height !== undefined ? { elevation: 0 } : {}),
  };

  const nextPlan = cloneFloorPlan(plan);
  nextPlan.furniture.push(instance);

  return {
    success: true,
    plan: nextPlan,
    instance: { ...instance },
  };
}

/**
 * Switches a placed furniture instance to another predefined FurnitureSpecification
 * while keeping center (x, y) and rotation strictly unchanged (AC-5).
 */
export function changeFurnitureSpecification(
  plan: FloorPlan,
  catalog: FurnitureCatalog,
  furnitureId: string,
  specificationId: string,
): ChangeSpecificationResult {
  const existing = plan.furniture.find((f) => f.id === furnitureId);
  if (!existing) {
    return {
      success: false,
      error: `Furniture instance "${furnitureId}" not found.`,
    };
  }

  const def = catalog.definitions.find((d) => d.id === existing.definitionId);
  if (!def) {
    return {
      success: false,
      error: `Furniture definition "${existing.definitionId}" not found in catalog.`,
    };
  }

  const spec = def.specifications.find((s) => s.id === specificationId);
  if (!spec) {
    return {
      success: false,
      error: `Furniture specification "${specificationId}" not found for definition "${def.id}".`,
    };
  }

  const nextPlan = cloneFloorPlan(plan);
  const target = nextPlan.furniture.find((f) => f.id === furnitureId)!;
  target.specificationId = spec.id;
  target.width = spec.width;
  target.depth = spec.depth;
  // Center (x, y) and rotation remain unchanged (AC-5)

  return {
    success: true,
    plan: nextPlan,
    instance: { ...target },
    specification: { ...spec },
  };
}

/**
 * Updates position coordinates of a furniture instance (US-11, AC-11).
 */
export function moveFurnitureInstance(
  plan: FloorPlan,
  furnitureId: string,
  x: number,
  y: number,
): MoveFurnitureResult {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return {
      success: false,
      error: "Coordinates x and y must be finite numbers.",
    };
  }

  const existing = plan.furniture.find((f) => f.id === furnitureId);
  if (!existing) {
    return {
      success: false,
      error: `Furniture instance "${furnitureId}" not found.`,
    };
  }

  const nextPlan = cloneFloorPlan(plan);
  const target = nextPlan.furniture.find((f) => f.id === furnitureId)!;
  target.x = Math.round(x);
  target.y = Math.round(y);

  return {
    success: true,
    plan: nextPlan,
    instance: { ...target },
  };
}

/**
 * Rotates a furniture instance in 90-degree steps (US-11, AC-11).
 */
export function rotateFurnitureInstance(
  plan: FloorPlan,
  furnitureId: string,
  stepDeg: number = 90,
): RotateFurnitureResult {
  if (!Number.isFinite(stepDeg)) {
    return {
      success: false,
      error: "Rotation step must be a finite number.",
    };
  }

  const existing = plan.furniture.find((f) => f.id === furnitureId);
  if (!existing) {
    return {
      success: false,
      error: `Furniture instance "${furnitureId}" not found.`,
    };
  }

  const nextPlan = cloneFloorPlan(plan);
  const target = nextPlan.furniture.find((f) => f.id === furnitureId)!;
  const currentRot = target.rotation || 0;
  const nextRot = ((((currentRot + stepDeg) % 360) + 360) % 360);
  target.rotation = nextRot;

  return {
    success: true,
    plan: nextPlan,
    instance: { ...target },
  };
}

/**
 * Removes a furniture instance from FloorPlan (US-11, AC-11).
 */
export function deleteFurnitureInstance(
  plan: FloorPlan,
  furnitureId: string,
): DeleteFurnitureResult {
  const existing = plan.furniture.find((f) => f.id === furnitureId);
  if (!existing) {
    return {
      success: false,
      error: `Furniture instance "${furnitureId}" not found.`,
    };
  }

  const nextPlan = cloneFloorPlan(plan);
  nextPlan.furniture = nextPlan.furniture.filter((f) => f.id !== furnitureId);

  return {
    success: true,
    plan: nextPlan,
    deletedId: furnitureId,
  };
}

/**
 * Helper to fetch detailed metadata for a furniture instance including its definition and active specification.
 */
export function getFurnitureInstanceDetails(
  plan: FloorPlan,
  catalog: FurnitureCatalog,
  furnitureId: string,
): FurnitureInstanceDetails | undefined {
  const instance = plan.furniture.find((f) => f.id === furnitureId);
  if (!instance) return undefined;

  const definition = catalog.definitions.find((d) => d.id === instance.definitionId);
  const specification =
    definition?.specifications.find((s) => s.id === instance.specificationId) ??
    definition?.specifications[0];
  return {
    instance,
    definition,
    specification,
  };
}
