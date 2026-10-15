import type { FloorPlan, Opening, Wall } from "./types";
import {
  FIXED_WALL_THICKNESS_MM,
  createRectangularRoomPlan,
} from "./rectangular-room";

export type CustomRoomWallSide = "top" | "right" | "bottom" | "left";

export const WALL_SIDE_TO_ID: Record<CustomRoomWallSide, string> = {
  top: "w-top",
  right: "w-right",
  bottom: "w-bottom",
  left: "w-left",
};

export const WALL_ID_TO_SIDE: Record<string, CustomRoomWallSide> = {
  "w-top": "top",
  "w-right": "right",
  "w-bottom": "bottom",
  "w-left": "left",
};

export interface CustomOpeningDraft {
  id: string;
  type: "door" | "window";
  wall: CustomRoomWallSide;
  widthMm: number;
  offsetMm: number;
}

export interface OpeningValidationError {
  width?: string;
  offset?: string;
  general?: string;
}

export interface OpeningsValidationResult {
  isValid: boolean;
  errors: Record<string, OpeningValidationError>;
  overallError?: string;
}

export const DEFAULT_DOOR_WIDTH_MM = 900;
export const DEFAULT_WINDOW_WIDTH_MM = 1200;
export const DEFAULT_OPENING_OFFSET_MM = 0;

/**
 * Creates a default draft opening for custom rectangular room (AC-7).
 * Door: 900 mm wide, 0 mm offset.
 * Window: 1200 mm wide, 0 mm offset.
 */
export function createDefaultOpeningDraft(
  type: "door" | "window",
  wall: CustomRoomWallSide = "top",
  widthMm?: number,
  offsetMm?: number,
): CustomOpeningDraft {
  const defaultWidth = type === "door" ? DEFAULT_DOOR_WIDTH_MM : DEFAULT_WINDOW_WIDTH_MM;
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    type,
    wall,
    widthMm: widthMm ?? defaultWidth,
    offsetMm: offsetMm ?? DEFAULT_OPENING_OFFSET_MM,
  };
}

/**
 * Converts user-facing drafts into canonical FloorPlan Opening objects (AC-7).
 *
 * Geometry rules (AC-7):
 * - Fixed 120 mm wall thickness, 60 mm outward offset.
 * - Horizontal walls (top, bottom): measured from left inner corner (x = 0).
 * - Vertical walls (left, right): measured from top inner corner (y = 0).
 * - Offset is the net clear distance from wall inner corner to near edge of opening.
 */
export function convertDraftsToOpenings(
  drafts: readonly CustomOpeningDraft[],
  roomWidthMm: number,
  roomDepthMm: number,
): Opening[] {
  const halfT = FIXED_WALL_THICKNESS_MM / 2; // 60 mm

  return drafts.map((draft) => {
    const wallId = WALL_SIDE_TO_ID[draft.wall];
    let position = 0.5;

    if (draft.wall === "top") {
      const wallLen = roomWidthMm + 2 * halfT;
      const centerDistFromStart = halfT + draft.offsetMm + draft.widthMm / 2;
      position = centerDistFromStart / wallLen;
    } else if (draft.wall === "bottom") {
      const wallLen = roomWidthMm + 2 * halfT;
      const centerDistFromStart = roomWidthMm + halfT - draft.offsetMm - draft.widthMm / 2;
      position = centerDistFromStart / wallLen;
    } else if (draft.wall === "right") {
      const wallLen = roomDepthMm + 2 * halfT;
      const centerDistFromStart = halfT + draft.offsetMm + draft.widthMm / 2;
      position = centerDistFromStart / wallLen;
    } else if (draft.wall === "left") {
      const wallLen = roomDepthMm + 2 * halfT;
      const centerDistFromStart = roomDepthMm + halfT - draft.offsetMm - draft.widthMm / 2;
      position = centerDistFromStart / wallLen;
    }

    // Clamp position between 0 and 1
    const clampedPos = Math.max(0, Math.min(1, position));

    return {
      id: draft.id,
      type: draft.type,
      wallId,
      position: clampedPos,
      width: draft.widthMm,
      height: draft.type === "door" ? 2100 : 1500,
    };
  });
}

/**
 * Converts canonical FloorPlan Opening objects back to user-facing CustomOpeningDraft objects (AC-7).
 */
export function convertOpeningsToDrafts(
  openings: readonly Opening[],
  roomWidthMm: number,
  roomDepthMm: number,
): CustomOpeningDraft[] {
  const halfT = FIXED_WALL_THICKNESS_MM / 2; // 60 mm

  return openings
    .map((op) => {
      const wallSide = WALL_ID_TO_SIDE[op.wallId];
      if (!wallSide) return null;

      let offsetMm = 0;

      if (wallSide === "top") {
        const wallLen = roomWidthMm + 2 * halfT;
        const cx = -halfT + wallLen * op.position;
        offsetMm = Math.round(cx - op.width / 2);
      } else if (wallSide === "bottom") {
        const wallLen = roomWidthMm + 2 * halfT;
        const cx = roomWidthMm + halfT - wallLen * op.position;
        offsetMm = Math.round(cx - op.width / 2);
      } else if (wallSide === "right") {
        const wallLen = roomDepthMm + 2 * halfT;
        const cy = -halfT + wallLen * op.position;
        offsetMm = Math.round(cy - op.width / 2);
      } else if (wallSide === "left") {
        const wallLen = roomDepthMm + 2 * halfT;
        const cy = roomDepthMm + halfT - wallLen * op.position;
        offsetMm = Math.round(cy - op.width / 2);
      }

      return {
        id: op.id,
        type: op.type === "window" ? ("window" as const) : ("door" as const),
        wall: wallSide,
        widthMm: op.width,
        offsetMm: Math.max(0, offsetMm),
      };
    })
    .filter((d): d is CustomOpeningDraft => d !== null);
}

/**
 * Validates opening drafts according to AC-8.
 *
 * Rules (AC-8):
 * - Openings count can be zero (no openings allowed) or multiple.
 * - widthMm must be positive integer.
 * - offsetMm must be non-negative integer.
 * - Must fit inside the selected wall's inner clear length (roomWidthMm for top/bottom, roomDepthMm for right/left).
 * - Same-wall openings cannot overlap. Edge-to-edge touching is allowed.
 * - Different walls do not overlap.
 */
export function validateCustomOpenings(
  drafts: readonly CustomOpeningDraft[],
  roomWidthMm: number,
  roomDepthMm: number,
  locale: string = "zh",
): OpeningsValidationResult {
  const isZh = locale.startsWith("zh");
  const errors: Record<string, OpeningValidationError> = {};
  let hasError = false;

  const setItemError = (id: string, key: keyof OpeningValidationError, msg: string) => {
    if (!errors[id]) errors[id] = {};
    errors[id][key] = msg;
    hasError = true;
  };

  for (const draft of drafts) {
    const isHorizontal = draft.wall === "top" || draft.wall === "bottom";
    const wallClearLen = isHorizontal ? roomWidthMm : roomDepthMm;

    // 1. Width validation
    if (
      typeof draft.widthMm !== "number" ||
      !Number.isInteger(draft.widthMm) ||
      draft.widthMm <= 0
    ) {
      setItemError(
        draft.id,
        "width",
        isZh ? "宽度必须为正整数毫米" : "Width must be a positive integer in mm",
      );
    }

    // 2. Offset validation
    if (
      typeof draft.offsetMm !== "number" ||
      !Number.isInteger(draft.offsetMm) ||
      draft.offsetMm < 0
    ) {
      setItemError(
        draft.id,
        "offset",
        isZh
          ? "距起点距离必须为非负整数毫米"
          : "Distance must be a non-negative integer in mm",
      );
    }

    // 3. Wall boundary fit
    const widthValid =
      typeof draft.widthMm === "number" &&
      Number.isInteger(draft.widthMm) &&
      draft.widthMm > 0;
    const offsetValid =
      typeof draft.offsetMm === "number" &&
      Number.isInteger(draft.offsetMm) &&
      draft.offsetMm >= 0;

    if (widthValid && offsetValid) {
      if (draft.offsetMm + draft.widthMm > wallClearLen) {
        const msg = isZh
          ? `超出墙体长度范围（墙长 ${wallClearLen} mm，当前占用至 ${draft.offsetMm + draft.widthMm} mm）`
          : `Exceeds wall clear length (${wallClearLen} mm, reached ${draft.offsetMm + draft.widthMm} mm)`;
        setItemError(draft.id, "general", msg);
      }
    }
  }

  // 4. Same-wall overlap validation
  // Group drafts by wall side
  const byWall: Record<CustomRoomWallSide, CustomOpeningDraft[]> = {
    top: [],
    right: [],
    bottom: [],
    left: [],
  };

  for (const draft of drafts) {
    byWall[draft.wall]?.push(draft);
  }

  for (const wallSide of Object.keys(byWall) as CustomRoomWallSide[]) {
    const list = byWall[wallSide];
    if (list.length <= 1) continue;

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];

        const aStart = a.offsetMm;
        const aEnd = a.offsetMm + a.widthMm;
        const bStart = b.offsetMm;
        const bEnd = b.offsetMm + b.widthMm;

        // Interval overlap condition: max(startA, startB) < min(endA, endB)
        // If max == min, they touch at edge, which is explicitly allowed!
        const maxStart = Math.max(aStart, bStart);
        const minEnd = Math.min(aEnd, bEnd);

        if (maxStart < minEnd) {
          const msg = isZh
            ? "同面墙上的门窗不能相互重叠"
            : "Openings on the same wall cannot overlap";
          setItemError(a.id, "general", msg);
          setItemError(b.id, "general", msg);
        }
      }
    }
  }

  return {
    isValid: !hasError,
    errors,
    overallError: hasError
      ? isZh
        ? "存在不合法的门窗配置，请修正后再应用"
        : "Invalid opening configurations, please resolve before applying"
      : undefined,
  };
}

export interface RebuildRoomOptions {
  widthMm: number;
  depthMm: number;
  name?: string;
  locale?: string;
}

export interface RebuildRoomResult {
  plan: FloorPlan;
  cleared: boolean;
}

/**
 * Rebuilds room dimensions (AC-9).
 * - If widthMm and depthMm are identical to current net dimensions:
 *   Retains all openings and furniture; updates name if changed. cleared = false.
 * - If widthMm or depthMm changed:
 *   Rebuilds clean empty room with new dimensions, clears all openings and furniture. cleared = true.
 */
export function rebuildRectangularRoomDimensions(
  currentPlan: FloorPlan,
  options: RebuildRoomOptions,
): RebuildRoomResult {
  const currentNetWidth =
    currentPlan.meta.customRoom?.widthMm ??
    currentPlan.rooms[0]?.customNetDimensions?.widthMm ??
    3000;
  const currentNetDepth =
    currentPlan.meta.customRoom?.depthMm ??
    currentPlan.rooms[0]?.customNetDimensions?.depthMm ??
    4000;

  const isSameDimensions =
    options.widthMm === currentNetWidth && options.depthMm === currentNetDepth;

  if (isSameDimensions) {
    const resolvedName = options.name?.trim() || currentPlan.meta.name;
    const updatedPlan: FloorPlan = {
      ...currentPlan,
      meta: {
        ...currentPlan.meta,
        name: resolvedName,
        updatedAt: new Date().toISOString(),
      },
      rooms: currentPlan.rooms.map((r, idx) =>
        idx === 0 ? { ...r, name: resolvedName } : r,
      ),
    };
    return { plan: updatedPlan, cleared: false };
  }

  // Dimensions changed: rebuild empty rectangular room (AC-9)
  const resolvedName = options.name?.trim() || currentPlan.meta.name;
  const { plan: newPlan } = createRectangularRoomPlan({
    name: resolvedName,
    widthMm: options.widthMm,
    depthMm: options.depthMm,
    locale: options.locale ?? "zh",
  });

  // Preserve plan id if present
  if (currentPlan.meta.id) {
    newPlan.meta.id = currentPlan.meta.id;
  }

  return { plan: newPlan, cleared: true };
}
