import type { FloorPlan, Room, Vertex, Wall } from "./types";

export const DEFAULT_ROOM_WIDTH_MM = 3000;
export const DEFAULT_ROOM_DEPTH_MM = 4000;
export const FIXED_WALL_THICKNESS_MM = 120;

export interface CustomRoomNetDimensions {
  widthMm: number;
  depthMm: number;
}

export interface CustomRoomRecord {
  id: string;
  name: string;
  widthMm: number;
  depthMm: number;
  createdAt: string;
  updatedAt: string;
  plan: FloorPlan;
}

export interface CreateRectangularRoomOptions {
  name?: string;
  widthMm?: number;
  depthMm?: number;
  sequenceNumber?: number;
  locale?: string;
}

export { formatNetArea } from "./geometry";

/**
 * Creates a normalized FloorPlan v2 and CustomRoomRecord for an independent rectangular room (AC-1, AC-2).
 *
 * Geometric contract (AC-2):
 * - Fixed wall thickness is 120 mm.
 * - Wall centerlines are offset outward by half the wall thickness (60 mm).
 * - Net inner clear space equals exact widthMm × depthMm.
 * - Single room with type 'other'.
 * - Default name generated sequentially when empty (e.g. 矩形房间 1, 矩形房间 2).
 */
export function createRectangularRoomPlan(
  options: CreateRectangularRoomOptions = {},
): { plan: FloorPlan; record: CustomRoomRecord } {
  const locale = options.locale ?? "zh";
  const isZh = locale.startsWith("zh");

  const widthMm =
    typeof options.widthMm === "number" &&
    Number.isInteger(options.widthMm) &&
    options.widthMm > 0
      ? options.widthMm
      : DEFAULT_ROOM_WIDTH_MM;

  const depthMm =
    typeof options.depthMm === "number" &&
    Number.isInteger(options.depthMm) &&
    options.depthMm > 0
      ? options.depthMm
      : DEFAULT_ROOM_DEPTH_MM;

  const trimmedName = options.name?.trim();
  const seq = options.sequenceNumber ?? 1;
  const defaultName = isZh ? `矩形房间 ${seq}` : `Rectangle Room ${seq}`;
  const resolvedName = trimmedName && trimmedName.length > 0 ? trimmedName : defaultName;

  const id = `custom-room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date().toISOString();
  const halfT = FIXED_WALL_THICKNESS_MM / 2;

  // 4 vertices offset outward by 60mm so [0, widthMm] x [0, depthMm] is strictly clear inside
  const vertices: Vertex[] = [
    { id: "v-tl", x: -halfT, y: -halfT },
    { id: "v-tr", x: widthMm + halfT, y: -halfT },
    { id: "v-br", x: widthMm + halfT, y: depthMm + halfT },
    { id: "v-bl", x: -halfT, y: depthMm + halfT },
  ];

  // 4 walls surrounding the room
  const walls: Wall[] = [
    {
      id: "w-top",
      from: "v-tl",
      to: "v-tr",
      thickness: FIXED_WALL_THICKNESS_MM,
      lockAxis: "horizontal",
    },
    {
      id: "w-right",
      from: "v-tr",
      to: "v-br",
      thickness: FIXED_WALL_THICKNESS_MM,
      lockAxis: "vertical",
    },
    {
      id: "w-bottom",
      from: "v-br",
      to: "v-bl",
      thickness: FIXED_WALL_THICKNESS_MM,
      lockAxis: "horizontal",
    },
    {
      id: "w-left",
      from: "v-bl",
      to: "v-tl",
      thickness: FIXED_WALL_THICKNESS_MM,
      lockAxis: "vertical",
    },
  ];

  const room: Room = {
    id: "room-1",
    type: "other",
    name: resolvedName,
    boundaryWallIds: ["w-top", "w-right", "w-bottom", "w-left"],
    customNetDimensions: {
      widthMm,
      depthMm,
    },
  };

  const plan: FloorPlan = {
    version: 2,
    unit: "mm",
    meta: {
      id,
      name: resolvedName,
      source: "user",
      isStandard: false,
      createdAt: now,
      updatedAt: now,
      customRoom: {
        widthMm,
        depthMm,
      },
    },
    vertices,
    walls,
    openings: [],
    rooms: [room],
    furniture: [],
  };

  const record: CustomRoomRecord = {
    id,
    name: resolvedName,
    widthMm,
    depthMm,
    createdAt: now,
    updatedAt: now,
    plan,
  };

  return { plan, record };
}
