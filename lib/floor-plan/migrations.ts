import type { FloorPlan } from "./types";
import { validateFloorPlan } from "./validators";

export const CURRENT_FLOOR_PLAN_VERSION = 2;
export const SUPPORTED_SCHEMA_VERSIONS = [CURRENT_FLOOR_PLAN_VERSION] as const;

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
export function parseRawPayload(
  input: unknown,
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
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
 * Public entry point to parse and validate any raw FloorPlan record under the v2 contract.
 * Strictly requires schema version 2 and rejects legacy v0/v1 or corrupt payloads safely without throwing.
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
        error: `Invalid FloorPlan v2: ${validation.errors.map((e) => e.message).join("; ")}`,
      };
    }
    return { ok: true, value: validation.value };
  }

  return {
    ok: false,
    error: `Unsupported schema version: ${version}. Supported versions are: ${SUPPORTED_SCHEMA_VERSIONS.join(", ")}`,
  };
}
