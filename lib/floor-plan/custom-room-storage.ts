import type { CustomRoomRecord } from "./rectangular-room";
import type { FloorPlan } from "./types";
import { validateFloorPlan } from "./validators";

export const CUSTOM_ROOM_STORAGE_KEY = "floor_plan_custom_rooms_v1";
export const CUSTOM_ROOM_STORAGE_VERSION = 1 as const;

export interface LastActivePlanSelection {
  type: "custom" | "standard";
  id: string;
}

export interface CustomRoomStorageDoc {
  version: typeof CUSTOM_ROOM_STORAGE_VERSION;
  lastActive?: LastActivePlanSelection;
  rooms: CustomRoomRecord[];
}

export type StorageLoadResult =
  | { ok: true; doc: CustomRoomStorageDoc }
  | { ok: false; error: string };

export type StorageSaveResult =
  | { ok: true; doc: CustomRoomStorageDoc }
  | { ok: false; error: string };

function resolveStorage(customStorage?: Storage): Storage | null {
  if (customStorage) return customStorage;
  if (typeof window !== "undefined") {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Loads the versioned custom rooms document from browser localStorage (AC-4, AC-5).
 * Safe failure semantics: never overwrites corrupt data on load failure.
 */
export function loadCustomRoomStorage(storage?: Storage): StorageLoadResult {
  const s = resolveStorage(storage);
  if (!s) {
    return { ok: false, error: "Storage is not available in current environment" };
  }

  const raw = s.getItem(CUSTOM_ROOM_STORAGE_KEY);
  if (raw === null || raw.trim() === "") {
    return {
      ok: true,
      doc: {
        version: CUSTOM_ROOM_STORAGE_VERSION,
        rooms: [],
      },
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return {
      ok: false,
      error: `JSON parse error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "Stored custom rooms payload is not a valid JSON object" };
  }

  const recordObj = parsed as Record<string, unknown>;
  if (recordObj.version !== CUSTOM_ROOM_STORAGE_VERSION) {
    return {
      ok: false,
      error: `Unsupported storage version: ${String(recordObj.version)}. Supported version: ${CUSTOM_ROOM_STORAGE_VERSION}`,
    };
  }

  if (!Array.isArray(recordObj.rooms)) {
    return { ok: false, error: "Stored custom rooms document missing 'rooms' array" };
  }

  const validatedRooms: CustomRoomRecord[] = [];
  for (let i = 0; i < recordObj.rooms.length; i++) {
    const r = recordObj.rooms[i];
    if (typeof r !== "object" || r === null) {
      return { ok: false, error: `Invalid room record at index ${i}` };
    }
    const rObj = r as Record<string, unknown>;
    if (typeof rObj.id !== "string" || !rObj.id) {
      return { ok: false, error: `Room at index ${i} has invalid id` };
    }
    if (typeof rObj.name !== "string") {
      return { ok: false, error: `Room at index ${i} has invalid name` };
    }
    if (typeof rObj.widthMm !== "number" || rObj.widthMm <= 0) {
      return { ok: false, error: `Room at index ${i} has invalid widthMm` };
    }
    if (typeof rObj.depthMm !== "number" || rObj.depthMm <= 0) {
      return { ok: false, error: `Room at index ${i} has invalid depthMm` };
    }

    const planValidation = validateFloorPlan(rObj.plan);
    if (!planValidation.ok) {
      return {
        ok: false,
        error: `Room '${rObj.id}' contains invalid FloorPlan: ${planValidation.errors.map((e) => e.message).join("; ")}`,
      };
    }

    validatedRooms.push({
      id: rObj.id,
      name: rObj.name,
      widthMm: rObj.widthMm,
      depthMm: rObj.depthMm,
      createdAt: typeof rObj.createdAt === "string" ? rObj.createdAt : new Date().toISOString(),
      updatedAt: typeof rObj.updatedAt === "string" ? rObj.updatedAt : new Date().toISOString(),
      plan: planValidation.value,
    });
  }

  let lastActive: LastActivePlanSelection | undefined;
  if (
    recordObj.lastActive &&
    typeof recordObj.lastActive === "object" &&
    !Array.isArray(recordObj.lastActive)
  ) {
    const la = recordObj.lastActive as Record<string, unknown>;
    if (
      (la.type === "custom" || la.type === "standard") &&
      typeof la.id === "string" &&
      la.id.length > 0
    ) {
      lastActive = {
        type: la.type,
        id: la.id,
      };
    }
  }

  return {
    ok: true,
    doc: {
      version: CUSTOM_ROOM_STORAGE_VERSION,
      lastActive,
      rooms: validatedRooms,
    },
  };
}

/**
 * Saves the entire custom rooms document to browser localStorage (AC-4).
 * Returns safe failure on quota or persistence errors without throwing.
 */
export function saveCustomRoomStorage(
  doc: CustomRoomStorageDoc,
  storage?: Storage,
): StorageSaveResult {
  const s = resolveStorage(storage);
  if (!s) {
    return { ok: false, error: "Storage is not available in current environment" };
  }

  for (let i = 0; i < doc.rooms.length; i++) {
    const r = doc.rooms[i];
    const planValidation = validateFloorPlan(r.plan);
    if (!planValidation.ok) {
      return {
        ok: false,
        error: `Cannot save invalid FloorPlan for room '${r.id}': ${planValidation.errors.map((e) => e.message).join("; ")}`,
      };
    }
  }

  try {
    const serialized = JSON.stringify(doc);
    s.setItem(CUSTOM_ROOM_STORAGE_KEY, serialized);
    return { ok: true, doc };
  } catch (err) {
    return {
      ok: false,
      error: `Storage save failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Saves or updates a single custom room record in localStorage (AC-4, AC-5).
 * - Refuses to overwrite if previous storage read failed (preserves corrupt/unsupported data).
 * - Updates the record in place if it exists; appends if new.
 * - Sets this custom room as the last active selection.
 */
export function saveCustomRoomRecord(
  record: CustomRoomRecord,
  storage?: Storage,
): StorageSaveResult {
  const currentRes = loadCustomRoomStorage(storage);
  if (!currentRes.ok) {
    // Crucial: do not overwrite existing storage when read failed!
    return {
      ok: false,
      error: `Cannot save room record: previous storage state is invalid (${currentRes.error})`,
    };
  }

  const doc = currentRes.doc;
  const existingIdx = doc.rooms.findIndex((r) => r.id === record.id);

  const updatedRecord: CustomRoomRecord = {
    ...record,
    updatedAt: new Date().toISOString(),
  };

  const nextRooms =
    existingIdx >= 0
      ? doc.rooms.map((r, i) => (i === existingIdx ? updatedRecord : r))
      : [...doc.rooms, updatedRecord];

  const nextDoc: CustomRoomStorageDoc = {
    version: CUSTOM_ROOM_STORAGE_VERSION,
    lastActive: {
      type: "custom",
      id: record.id,
    },
    rooms: nextRooms,
  };

  return saveCustomRoomStorage(nextDoc, storage);
}

/**
 * Tracks the user's active plan selection (standard template or custom room) across reloads (AC-5).
 */
export function setLastActivePlan(
  type: "custom" | "standard",
  id: string,
  storage?: Storage,
): StorageSaveResult {
  const currentRes = loadCustomRoomStorage(storage);
  if (!currentRes.ok) {
    return {
      ok: false,
      error: `Cannot set last active plan: previous storage state is invalid (${currentRes.error})`,
    };
  }

  const nextDoc: CustomRoomStorageDoc = {
    ...currentRes.doc,
    lastActive: { type, id },
  };

  return saveCustomRoomStorage(nextDoc, storage);
}

export type DuplicateCustomRoomResult =
  | { ok: true; doc: CustomRoomStorageDoc; duplicatedRecord: CustomRoomRecord }
  | { ok: false; error: string; duplicatedRecord?: undefined };

export type DeleteCustomRoomResult =
  | {
      ok: true;
      doc: CustomRoomStorageDoc;
      nextActive?: LastActivePlanSelection;
    }
  | { ok: false; error: string; nextActive?: undefined };

/**
 * Duplicates a custom room record with deep copy of dimensions, openings, and furniture (AC-12).
 * Generates an isolated unique ID, sets localized copy name, and makes the duplicate active.
 */
export function duplicateCustomRoomRecord(
  id: string,
  locale?: string,
  storage?: Storage,
): DuplicateCustomRoomResult {
  const currentRes = loadCustomRoomStorage(storage);
  if (!currentRes.ok) {
    return {
      ok: false,
      error: `Cannot duplicate room: previous storage state is invalid (${currentRes.error})`,
    };
  }

  const existing = currentRes.doc.rooms.find((r) => r.id === id);
  if (!existing) {
    return {
      ok: false,
      error: `Room '${id}' not found in storage`,
    };
  }

  const isZh = locale?.startsWith("zh") ?? true;
  const rawBaseName = existing.name.trim();
  const defaultBaseName = isZh ? "矩形房间" : "Rectangular Room";
  const baseName = rawBaseName || defaultBaseName;
  const copySuffix = isZh ? " 副本" : " Copy";
  const newName = `${baseName}${copySuffix}`;

  const newId = `custom-room-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  // Deep clone plan
  const clonedPlan: FloorPlan = JSON.parse(JSON.stringify(existing.plan));
  clonedPlan.meta.id = newId;
  clonedPlan.meta.name = newName;
  clonedPlan.meta.createdAt = now;
  clonedPlan.meta.updatedAt = now;
  if (clonedPlan.rooms[0]) {
    clonedPlan.rooms[0].name = newName;
  }

  const duplicatedRecord: CustomRoomRecord = {
    id: newId,
    name: newName,
    widthMm: existing.widthMm,
    depthMm: existing.depthMm,
    createdAt: now,
    updatedAt: now,
    plan: clonedPlan,
  };

  const nextRooms = [duplicatedRecord, ...currentRes.doc.rooms];
  const nextDoc: CustomRoomStorageDoc = {
    version: CUSTOM_ROOM_STORAGE_VERSION,
    lastActive: {
      type: "custom",
      id: newId,
    },
    rooms: nextRooms,
  };

  const saveRes = saveCustomRoomStorage(nextDoc, storage);
  if (!saveRes.ok) {
    return { ok: false, error: saveRes.error };
  }

  return { ok: true, doc: nextDoc, duplicatedRecord };
}

/**
 * Renames a custom room record without clearing openings or furniture layout (AC-12).
 * Auto-names sequentially or with fallback if blank.
 */
export function renameCustomRoomRecord(
  id: string,
  newName: string,
  locale?: string,
  storage?: Storage,
): StorageSaveResult {
  const currentRes = loadCustomRoomStorage(storage);
  if (!currentRes.ok) {
    return {
      ok: false,
      error: `Cannot rename room: previous storage state is invalid (${currentRes.error})`,
    };
  }

  const existingIdx = currentRes.doc.rooms.findIndex((r) => r.id === id);
  if (existingIdx === -1) {
    return {
      ok: false,
      error: `Room '${id}' not found in storage`,
    };
  }

  const isZh = locale?.startsWith("zh") ?? true;
  const trimmed = newName.trim();
  const effectiveName =
    trimmed || (isZh ? `矩形房间 ${existingIdx + 1}` : `Rectangular Room ${existingIdx + 1}`);
  const now = new Date().toISOString();

  const existing = currentRes.doc.rooms[existingIdx];
  const updatedPlan: FloorPlan = {
    ...existing.plan,
    meta: {
      ...existing.plan.meta,
      name: effectiveName,
      updatedAt: now,
    },
    rooms: existing.plan.rooms.map((room, idx) =>
      idx === 0 ? { ...room, name: effectiveName } : room,
    ),
  };

  const updatedRecord: CustomRoomRecord = {
    ...existing,
    name: effectiveName,
    updatedAt: now,
    plan: updatedPlan,
  };

  const nextRooms = currentRes.doc.rooms.map((r, i) => (i === existingIdx ? updatedRecord : r));
  const nextDoc: CustomRoomStorageDoc = {
    ...currentRes.doc,
    rooms: nextRooms,
  };

  return saveCustomRoomStorage(nextDoc, storage);
}

/**
 * Deletes a custom room record from storage (AC-12).
 * If the active plan was deleted, enters the next available custom room or falls back to standard plan.
 */
export function deleteCustomRoomRecord(
  id: string,
  storage?: Storage,
  defaultStandardPlanId: string = "plan-cn-sh-ruidong-2br-67",
): DeleteCustomRoomResult {
  const currentRes = loadCustomRoomStorage(storage);
  if (!currentRes.ok) {
    return {
      ok: false,
      error: `Cannot delete room: previous storage state is invalid (${currentRes.error})`,
    };
  }

  const remainingRooms = currentRes.doc.rooms.filter((r) => r.id !== id);
  let nextActive = currentRes.doc.lastActive;

  if (currentRes.doc.lastActive?.type === "custom" && currentRes.doc.lastActive.id === id) {
    if (remainingRooms.length > 0) {
      nextActive = {
        type: "custom",
        id: remainingRooms[0].id,
      };
    } else {
      nextActive = {
        type: "standard",
        id: defaultStandardPlanId,
      };
    }
  }

  const nextDoc: CustomRoomStorageDoc = {
    version: CUSTOM_ROOM_STORAGE_VERSION,
    lastActive: nextActive,
    rooms: remainingRooms,
  };

  const saveRes = saveCustomRoomStorage(nextDoc, storage);
  if (!saveRes.ok) {
    return { ok: false, error: saveRes.error };
  }

  return { ok: true, doc: nextDoc, nextActive };
}

