import {
  computeFloorPlanBounds,
  computePolygonCentroid,
  computeRoomPolygon,
  getVertexMap,
  getWallMap,
} from "./geometry";
import type {
  DimensionRange,
  FloorPlan,
  FurnitureCatalog,
  FurnitureDefinition,
  FurnitureInstance,
} from "./types";

import { cloneFloorPlan } from "./user-plan";
import { getFloorPlanI18n } from "./i18n";

export interface PlacementOptions {
  x?: number;
  y?: number;
  rotation?: number;
  id?: string;
  roomId?: string;
}

export interface ResizeOptions {
  clamp?: boolean;
  locale?: string;
}

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

export type ResizeFurnitureResult =
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
  widthRange?: DimensionRange;
  depthRange?: DimensionRange;
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
 * Adds an item using its default dimensions from definition (US-10, AC-10, AC-13).
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

  const defaultSpec = def.specifications?.[0];
  const width = def.defaultSize?.width ?? defaultSpec?.width ?? 1000;
  const depth = def.defaultSize?.depth ?? defaultSpec?.depth ?? 1000;
  const height = def.defaultSize?.height ?? defaultSpec?.height;

  // Default dimensions from definition or primary specification
  const instance: FurnitureInstance = {
    id,
    definitionId: def.id,
    specificationId: defaultSpec?.id,
    x: Math.round(posX),
    y: Math.round(posY),
    width,
    depth,
    rotation,
    ...(height !== undefined ? { elevation: 0 } : {}),
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
 * Resizes a furniture instance within configured min/max/step limits (US-11, AC-11).
 * Rejects invalid dimensions with clear reason; non-mutation guarantee on rejection.
 */
export function resizeFurnitureInstance(
  plan: FloorPlan,
  catalog: FurnitureCatalog,
  furnitureId: string,
  widthMm: number,
  depthMm: number,
  options?: ResizeOptions,
): ResizeFurnitureResult {
  const isZh = options?.locale?.toLowerCase().startsWith("zh");

  if (!Number.isFinite(widthMm) || !Number.isFinite(depthMm) || widthMm <= 0 || depthMm <= 0) {
    return {
      success: false,
      error: isZh
        ? "尺寸宽度和进深必须为大于 0 的有效数值。"
        : "Dimensions width and depth must be positive numbers.",
    };
  }

  const existing = plan.furniture.find((f) => f.id === furnitureId);
  if (!existing) {
    return {
      success: false,
      error: isZh
        ? `未在方案中找到编号为 "${furnitureId}" 的家具构件。`
        : `Furniture instance "${furnitureId}" not found.`,
    };
  }

  const def = catalog.definitions.find((d) => d.id === existing.definitionId);
  const widthRange = def?.allowedSizeRanges?.width;
  const depthRange = def?.allowedSizeRanges?.depth;

  let finalWidth = Math.round(widthMm);
  let finalDepth = Math.round(depthMm);

  if (options?.clamp) {
    if (widthRange) {
      finalWidth = Math.max(widthRange.min, Math.min(widthRange.max, finalWidth));
      if (widthRange.step && widthRange.step > 0) {
        finalWidth =
          widthRange.min +
          Math.round((finalWidth - widthRange.min) / widthRange.step) * widthRange.step;
      }
    }
    if (depthRange) {
      finalDepth = Math.max(depthRange.min, Math.min(depthRange.max, finalDepth));
      if (depthRange.step && depthRange.step > 0) {
        finalDepth =
          depthRange.min +
          Math.round((finalDepth - depthRange.min) / depthRange.step) * depthRange.step;
      }
    }
  } else {
    const furnitureName = def
      ? (isZh ? getFloorPlanI18n(options?.locale).getFurnitureName(def.id, def.name) : def.name)
      : existing.definitionId;

    if (widthRange) {
      if (finalWidth < widthRange.min) {
        return {
          success: false,
          error: isZh
            ? `宽度 ${finalWidth} mm 低于${furnitureName}允许的最小尺寸 ${widthRange.min} mm。`
            : `Width ${finalWidth} mm is below minimum allowed ${widthRange.min} mm for ${furnitureName}.`,
        };
      }
      if (finalWidth > widthRange.max) {
        return {
          success: false,
          error: isZh
            ? `宽度 ${finalWidth} mm 超出${furnitureName}允许的最大尺寸 ${widthRange.max} mm。`
            : `Width ${finalWidth} mm exceeds maximum allowed ${widthRange.max} mm for ${furnitureName}.`,
        };
      }
    }

    if (depthRange) {
      if (finalDepth < depthRange.min) {
        return {
          success: false,
          error: isZh
            ? `进深 ${finalDepth} mm 低于${furnitureName}允许的最小尺寸 ${depthRange.min} mm。`
            : `Depth ${finalDepth} mm is below minimum allowed ${depthRange.min} mm for ${furnitureName}.`,
        };
      }
      if (finalDepth > depthRange.max) {
        return {
          success: false,
          error: isZh
            ? `进深 ${finalDepth} mm 超出${furnitureName}允许的最大尺寸 ${depthRange.max} mm。`
            : `Depth ${finalDepth} mm exceeds maximum allowed ${depthRange.max} mm for ${furnitureName}.`,
        };
      }
    }
  }

  const nextPlan = cloneFloorPlan(plan);
  const target = nextPlan.furniture.find((f) => f.id === furnitureId)!;
  target.width = finalWidth;
  target.depth = finalDepth;

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
 * Helper to fetch detailed metadata for a furniture instance including its definition and allowed ranges.
 */
export function getFurnitureInstanceDetails(
  plan: FloorPlan,
  catalog: FurnitureCatalog,
  furnitureId: string,
): FurnitureInstanceDetails | undefined {
  const instance = plan.furniture.find((f) => f.id === furnitureId);
  if (!instance) return undefined;

  const definition = catalog.definitions.find((d) => d.id === instance.definitionId);
  return {
    instance,
    definition,
    widthRange: definition?.allowedSizeRanges?.width,
    depthRange: definition?.allowedSizeRanges?.depth,
  };
}
