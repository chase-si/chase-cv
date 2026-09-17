import {
  CANONICAL_UNIT,
  type FloorPlan,
  type FloorPlanV0,
  type LockAxis,
  type OpeningType,
  type PlanSourceType,
  type RoomType,
} from "./types";
import { validateFloorPlan } from "./validators";

export const CURRENT_FLOOR_PLAN_VERSION = 1;
export const PREVIOUS_FLOOR_PLAN_VERSION = 0;
export const SUPPORTED_SCHEMA_VERSIONS = [PREVIOUS_FLOOR_PLAN_VERSION, CURRENT_FLOOR_PLAN_VERSION] as const;

export type SupportedVersion = (typeof SUPPORTED_SCHEMA_VERSIONS)[number];

export type MigrationOutcome<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

/**
 * Safely parse raw input (JSON string or object) without throwing
 */
export function parseRawPayload(input: unknown): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (!isObject(parsed)) {
        return { ok: false, error: "Parsed JSON is not an object" };
      }
      return { ok: true, value: parsed };
    } catch (err) {
      return {
        ok: false,
        error: `JSON parse error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  if (isObject(input)) {
    return { ok: true, value: input };
  }

  return { ok: false, error: "Payload must be a JSON object or valid JSON string" };
}

/**
 * Migrate legacy v0 schema to canonical v1 schema
 */
export function migrateV0ToV1(raw: Record<string, unknown>): MigrationOutcome<FloorPlan> {
  try {
    const isMeters = raw.unit === "m" || (Array.isArray(raw.walls) && raw.walls.some((w) => isObject(w) && typeof w.thickness === "number" && w.thickness < 2));
    const scaleFactor = isMeters ? 1000 : 1;

    const rawMeta = isObject(raw.meta) ? raw.meta : {};
    const validSources: PlanSourceType[] = ["template", "user", "cubicasa", "import"];
    const source: PlanSourceType =
      typeof rawMeta.source === "string" && validSources.includes(rawMeta.source as PlanSourceType)
        ? (rawMeta.source as PlanSourceType)
        : "template";

    const meta = {
      id: typeof rawMeta.id === "string" ? rawMeta.id : undefined,
      name: typeof rawMeta.name === "string" ? rawMeta.name : "Migrated Plan",
      source,
      createdAt: typeof rawMeta.createdAt === "string" ? rawMeta.createdAt : new Date().toISOString(),
      updatedAt: typeof rawMeta.updatedAt === "string" ? rawMeta.updatedAt : new Date().toISOString(),
    };

    const rawVertices = Array.isArray(raw.vertices) ? raw.vertices : [];
    const vertices = rawVertices.map((v) => {
      if (!isObject(v)) return { id: "unknown", x: 0, y: 0 };
      return {
        id: String(v.id || ""),
        x: Math.round((Number(v.x) || 0) * scaleFactor),
        y: Math.round((Number(v.y) || 0) * scaleFactor),
      };
    });

    const rawWalls = Array.isArray(raw.walls) ? raw.walls : [];
    const walls = rawWalls.map((w) => {
      if (!isObject(w)) {
        return {
          id: "w-unknown",
          from: "",
          to: "",
          thickness: 200,
          lockAxis: "none" as LockAxis,
        };
      }
      const rawLockAxis = String(w.lockAxis || "none");
      const lockAxis: LockAxis =
        rawLockAxis === "horizontal" || rawLockAxis === "vertical"
          ? rawLockAxis
          : "none";

      return {
        id: String(w.id || ""),
        from: String(w.from || ""),
        to: String(w.to || ""),
        thickness: Math.round((Number(w.thickness) || 0.2) * scaleFactor),
        lockAxis,
      };
    });

    const rawOpenings = Array.isArray(raw.openings) ? raw.openings : [];
    const openings = rawOpenings.map((op) => {
      if (!isObject(op)) {
        return {
          id: "op-unknown",
          type: "door" as OpeningType,
          wallId: "",
          position: 0.5,
          width: 900,
        };
      }
      const rawType = String(op.type || "door");
      const type: OpeningType =
        rawType === "door" ||
        rawType === "window" ||
        rawType === "sliding_door" ||
        rawType === "opening"
          ? rawType
          : "door";

      return {
        id: String(op.id || ""),
        type,
        wallId: String(op.wallId || ""),
        position: Math.max(0, Math.min(1, Number(op.position) || 0)),
        width: Math.round((Number(op.width) || 0.9) * scaleFactor),
        height: op.height !== undefined ? Math.round((Number(op.height) || 2.1) * scaleFactor) : undefined,
      };
    });

    const rawRooms = Array.isArray(raw.rooms) ? raw.rooms : [];
    const rooms = rawRooms.map((r) => {
      if (!isObject(r)) {
        return {
          id: "r-unknown",
          type: "other" as RoomType,
          boundaryWallIds: [],
        };
      }
      // v0 used wallIds, v1 uses boundaryWallIds
      const wallIds = Array.isArray(r.boundaryWallIds)
        ? r.boundaryWallIds
        : Array.isArray(r.wallIds)
          ? r.wallIds
          : [];

      return {
        id: String(r.id || ""),
        type: (String(r.type || "other")) as RoomType,
        name: typeof r.name === "string" ? r.name : undefined,
        boundaryWallIds: wallIds.map(String),
      };
    });

    const rawFurniture = Array.isArray(raw.furniture) ? raw.furniture : [];
    const furniture = rawFurniture.map((f) => {
      if (!isObject(f)) {
        return {
          id: "f-unknown",
          definitionId: "unknown",
          x: 0,
          y: 0,
          width: 1000,
          depth: 1000,
          rotation: 0,
        };
      }
      return {
        id: String(f.id || ""),
        definitionId: String(f.definitionId || ""),
        x: Math.round((Number(f.x) || 0) * scaleFactor),
        y: Math.round((Number(f.y) || 0) * scaleFactor),
        width: Math.round((Number(f.width) || 1.0) * scaleFactor),
        depth: Math.round((Number(f.depth) || 1.0) * scaleFactor),
        rotation: Number(f.rotation) || 0,
      };
    });

    const v1Candidate: FloorPlan = {
      version: 1,
      unit: CANONICAL_UNIT,
      meta,
      vertices,
      walls,
      openings,
      rooms,
      furniture,
    };

    const validation = validateFloorPlan(v1Candidate);
    if (!validation.ok) {
      return {
        ok: false,
        error: `Migration from v0 succeeded but v1 validation failed: ${validation.errors.map((e) => e.message).join("; ")}`,
      };
    }

    return { ok: true, value: validation.value };
  } catch (err) {
    return {
      ok: false,
      error: `Failed to migrate v0 payload: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Public entry point to parse, migrate, and validate any raw FloorPlan record
 * Supports:
 * - Current version (v1)
 * - Immediately previous version (v0)
 * Rejects corrupt data and unsupported versions safely without throwing.
 */
export function loadFloorPlanRecord(raw: unknown): MigrationOutcome<FloorPlan> {
  const parsedRes = parseRawPayload(raw);
  if (!parsedRes.ok) {
    return { ok: false, error: parsedRes.error };
  }

  const payload = parsedRes.value;
  const version = payload.version;

  if (typeof version !== "number") {
    return {
      ok: false,
      error: "Invalid document: missing numeric 'version' field",
    };
  }

  if (version === CURRENT_FLOOR_PLAN_VERSION) {
    const validation = validateFloorPlan(payload);
    if (!validation.ok) {
      return {
        ok: false,
        error: `Invalid FloorPlan v1: ${validation.errors.map((e) => e.message).join("; ")}`,
      };
    }
    return { ok: true, value: validation.value };
  }

  if (version === PREVIOUS_FLOOR_PLAN_VERSION) {
    return migrateV0ToV1(payload);
  }

  return {
    ok: false,
    error: `Unsupported schema version: ${version}. Supported versions are: ${SUPPORTED_SCHEMA_VERSIONS.join(", ")}`,
  };
}

export const migrateFloorPlan = loadFloorPlanRecord;
