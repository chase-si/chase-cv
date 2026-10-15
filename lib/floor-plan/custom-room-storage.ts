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
  recentCustomRoomIds?: string[];
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

  let raw: string | null;
  try {
    raw = s.getItem(CUSTOM_ROOM_STORAGE_KEY);
  } catch (error) {
    return { ok: false, error: `Storage read failed: ${error instanceof Error ? error.message : String(error)}` };
  }
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
      recentCustomRoomIds: normalizeRecentRoomIds({
        rooms: validatedRooms,
        lastActive,
        recentCustomRoomIds: Array.isArray(recordObj.recentCustomRoomIds)
          ? recordObj.recentCustomRoomIds.filter((id): id is string => typeof id === "string")
          : undefined,
      }),
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

/** Most recent first; old v1 records remain readable without a migration. */
function normalizeRecentRoomIds(doc: Pick<CustomRoomStorageDoc, "rooms" | "lastActive" | "recentCustomRoomIds">): string[] {
  const existingIds = new Set(doc.rooms.map((room) => room.id));
  return [...new Set([
    ...(doc.lastActive?.type === "custom" ? [doc.lastActive.id] : []),
    ...(doc.recentCustomRoomIds ?? []),
    ...doc.rooms.map((room) => room.id).reverse(),
  ])].filter((id) => existingIds.has(id));
}

export function selectPlanInRoomLibrary(
  doc: CustomRoomStorageDoc,
  selection: LastActivePlanSelection,
): CustomRoomStorageDoc {
  const recent = normalizeRecentRoomIds(doc);
  return {
    ...doc,
    lastActive: selection,
    recentCustomRoomIds: selection.type === "custom"
      ? [selection.id, ...recent.filter((id) => id !== selection.id)]
      : recent,
  };
}

export function upsertRoomInLibrary(doc: CustomRoomStorageDoc, record: CustomRoomRecord): CustomRoomStorageDoc {
  const updatedRecord = { ...record, updatedAt: new Date().toISOString() };
  const exists = doc.rooms.some((room) => room.id === record.id);
  return selectPlanInRoomLibrary({
    ...doc,
    rooms: exists ? doc.rooms.map((room) => room.id === record.id ? updatedRecord : room) : [...doc.rooms, updatedRecord],
  }, { type: "custom", id: record.id });
}

export function copyRoomRecord(existing: CustomRoomRecord, locale?: string): CustomRoomRecord {
  const isZh = locale?.startsWith("zh") ?? true;
  const baseName = existing.name.trim() || (isZh ? "矩形房间" : "Rectangular Room");
  const name = `${baseName}${isZh ? " 副本" : " Copy"}`;
  const id = `custom-room-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const plan: FloorPlan = JSON.parse(JSON.stringify(existing.plan));
  plan.meta = { ...plan.meta, id, name, createdAt: now, updatedAt: now };
  if (plan.rooms[0]) plan.rooms[0].name = name;
  return { ...existing, id, name, createdAt: now, updatedAt: now, plan };
}

export function renameRoomInLibrary(doc: CustomRoomStorageDoc, id: string, name: string, locale?: string): CustomRoomStorageDoc {
  const index = doc.rooms.findIndex((room) => room.id === id);
  if (index < 0) return doc;
  const isZh = locale?.startsWith("zh") ?? true;
  const effectiveName = name.trim() || (isZh ? `矩形房间 ${index + 1}` : `Rectangular Room ${index + 1}`);
  const now = new Date().toISOString();
  return { ...doc, rooms: doc.rooms.map((record) => record.id === id ? {
    ...record,
    name: effectiveName,
    updatedAt: now,
    plan: {
      ...record.plan,
      meta: { ...record.plan.meta, name: effectiveName, updatedAt: now },
      rooms: record.plan.rooms.map((room, roomIndex) => roomIndex === 0 ? { ...room, name: effectiveName } : room),
    },
  } : record) };
}

export function removeRoomFromLibrary(doc: CustomRoomStorageDoc, id: string, defaultStandardPlanId: string): CustomRoomStorageDoc {
  const recentCustomRoomIds = normalizeRecentRoomIds(doc).filter((roomId) => roomId !== id);
  const rooms = doc.rooms.filter((room) => room.id !== id);
  const lastActive = doc.lastActive?.type === "custom" && doc.lastActive.id === id
    ? recentCustomRoomIds[0]
      ? { type: "custom" as const, id: recentCustomRoomIds[0] }
      : { type: "standard" as const, id: defaultStandardPlanId }
    : doc.lastActive;
  return { ...doc, rooms, recentCustomRoomIds, lastActive };
}

/**
 * Saves or updates a single custom room record in localStorage (AC-4, AC-5).
 * - Refuses to overwrite if previous storage read failed (preserves corrupt/unsupported data).
 * - Updates the record in place if it exists; appends if new.
 * - Sets this custom room as the last active selection.
 */
export function saveCustomRoomRecord(record: CustomRoomRecord, storage?: Storage): StorageSaveResult {
  const current = loadCustomRoomStorage(storage);
  if (!current.ok) return current;
  return saveCustomRoomStorage(upsertRoomInLibrary(current.doc, record), storage);
}

/**
 * Tracks the user's active plan selection (standard template or custom room) across reloads (AC-5).
 */
export function setLastActivePlan(type: "custom" | "standard", id: string, storage?: Storage): StorageSaveResult {
  const current = loadCustomRoomStorage(storage);
  if (!current.ok) return current;
  return saveCustomRoomStorage(selectPlanInRoomLibrary(current.doc, { type, id }), storage);
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
export function duplicateCustomRoomRecord(id: string, locale?: string, storage?: Storage): DuplicateCustomRoomResult {
  const current = loadCustomRoomStorage(storage);
  if (!current.ok) return current;
  const existing = current.doc.rooms.find((room) => room.id === id);
  if (!existing) return { ok: false, error: `Room '${id}' not found in storage` };
  const duplicatedRecord = copyRoomRecord(existing, locale);
  const next = upsertRoomInLibrary({ ...current.doc, rooms: [duplicatedRecord, ...current.doc.rooms] }, duplicatedRecord);
  const saved = saveCustomRoomStorage(next, storage);
  if (!saved.ok) return saved;
  return { ok: true, doc: next, duplicatedRecord };
}

/**
 * Renames a custom room record without clearing openings or furniture layout (AC-12).
 * Auto-names sequentially or with fallback if blank.
 */
export function renameCustomRoomRecord(id: string, newName: string, locale?: string, storage?: Storage): StorageSaveResult {
  const current = loadCustomRoomStorage(storage);
  if (!current.ok) return current;
  if (!current.doc.rooms.some((room) => room.id === id)) return { ok: false, error: `Room '${id}' not found in storage` };
  return saveCustomRoomStorage(renameRoomInLibrary(current.doc, id, newName, locale), storage);
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
  const current = loadCustomRoomStorage(storage);
  if (!current.ok) return current;
  const doc = removeRoomFromLibrary(current.doc, id, defaultStandardPlanId);
  const saved = saveCustomRoomStorage(doc, storage);
  if (!saved.ok) return saved;
  return { ok: true, doc, nextActive: doc.lastActive };
}
