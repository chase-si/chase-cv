import {
  CANONICAL_UNIT,
  type FloorPlan,
  type FurnitureCatalog,
  type FurnitureCatalogV1,
  type FurnitureDefinition,
  type FurniturePlacement,
  type FurnitureSide,
  type FurnitureSpecification,
  type PlacementScenario,
  type SpaceRuleConfig,
  type ValidationError,
  type ValidationResult,
} from "./types";

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val);
}

function isPositiveNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && val > 0;
}

function isNonNegativeNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && val >= 0;
}

/**
 * Validate Normalized Canonical FloorPlan v1
 */
export function validateFloorPlan(input: unknown): ValidationResult<FloorPlan> {
  const errors: ValidationError[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      errors: [{ path: "", message: "FloorPlan must be a JSON object" }],
    };
  }

  if (input.version !== 1) {
    errors.push({
      path: "version",
      message: `FloorPlan version must be 1 (received ${input.version})`,
    });
  }

  if (input.unit !== CANONICAL_UNIT) {
    errors.push({
      path: "unit",
      message: `FloorPlan unit must be '${CANONICAL_UNIT}' (millimetres), received '${input.unit}'`,
    });
  }

  if (!isObject(input.meta) || !isNonEmptyString(input.meta.name)) {
    errors.push({
      path: "meta.name",
      message: "meta.name must be a non-empty string",
    });
  }

  // Vertices validation
  const vertexIdSet = new Set<string>();
  if (!Array.isArray(input.vertices)) {
    errors.push({ path: "vertices", message: "vertices must be an array" });
  } else {
    input.vertices.forEach((v: unknown, idx: number) => {
      if (!isObject(v)) {
        errors.push({
          path: `vertices[${idx}]`,
          message: "Vertex must be an object",
        });
        return;
      }
      if (!isNonEmptyString(v.id)) {
        errors.push({
          path: `vertices[${idx}].id`,
          message: "Vertex id must be a non-empty string",
        });
      } else if (vertexIdSet.has(v.id)) {
        errors.push({
          path: `vertices[${idx}].id`,
          message: `Duplicate Vertex id '${v.id}'`,
        });
      } else {
        vertexIdSet.add(v.id);
      }

      if (!isFiniteNumber(v.x) || !isFiniteNumber(v.y)) {
        errors.push({
          path: `vertices[${idx}]`,
          message: `Vertex '${v.id}' x and y must be finite numbers in mm`,
        });
      }
    });
  }

  // Walls validation
  const wallIdSet = new Set<string>();
  if (!Array.isArray(input.walls)) {
    errors.push({ path: "walls", message: "walls must be an array" });
  } else {
    input.walls.forEach((w: unknown, idx: number) => {
      if (!isObject(w)) {
        errors.push({
          path: `walls[${idx}]`,
          message: "Wall must be an object",
        });
        return;
      }

      if (!isNonEmptyString(w.id)) {
        errors.push({
          path: `walls[${idx}].id`,
          message: "Wall id must be a non-empty string",
        });
      } else if (wallIdSet.has(w.id)) {
        errors.push({
          path: `walls[${idx}].id`,
          message: `Duplicate Wall id '${w.id}'`,
        });
      } else {
        wallIdSet.add(w.id);
      }

      if (!isNonEmptyString(w.from) || !vertexIdSet.has(w.from)) {
        errors.push({
          path: `walls[${idx}].from`,
          message: `Wall '${w.id}' references non-existent Vertex '${w.from}'`,
        });
      }

      if (!isNonEmptyString(w.to) || !vertexIdSet.has(w.to)) {
        errors.push({
          path: `walls[${idx}].to`,
          message: `Wall '${w.id}' references non-existent Vertex '${w.to}'`,
        });
      }

      if (w.from === w.to && isNonEmptyString(w.from)) {
        errors.push({
          path: `walls[${idx}]`,
          message: `Wall '${w.id}' start and end vertices cannot be identical`,
        });
      }

      if (!isPositiveNumber(w.thickness)) {
        errors.push({
          path: `walls[${idx}].thickness`,
          message: `Wall '${w.id}' thickness must be positive millimetres`,
        });
      }

      const validLockAxes = ["horizontal", "vertical", "none"];
      if (!isNonEmptyString(w.lockAxis) || !validLockAxes.includes(w.lockAxis)) {
        errors.push({
          path: `walls[${idx}].lockAxis`,
          message: `Wall '${w.id}' lockAxis must be one of: ${validLockAxes.join(", ")}`,
        });
      }
    });
  }

  // Openings validation
  const openingIdSet = new Set<string>();
  if (!Array.isArray(input.openings)) {
    errors.push({ path: "openings", message: "openings must be an array" });
  } else {
    input.openings.forEach((op: unknown, idx: number) => {
      if (!isObject(op)) {
        errors.push({
          path: `openings[${idx}]`,
          message: "Opening must be an object",
        });
        return;
      }

      if (!isNonEmptyString(op.id)) {
        errors.push({
          path: `openings[${idx}].id`,
          message: "Opening id must be a non-empty string",
        });
      } else if (openingIdSet.has(op.id)) {
        errors.push({
          path: `openings[${idx}].id`,
          message: `Duplicate Opening id '${op.id}'`,
        });
      } else {
        openingIdSet.add(op.id);
      }

      if (!isNonEmptyString(op.wallId) || !wallIdSet.has(op.wallId)) {
        errors.push({
          path: `openings[${idx}].wallId`,
          message: `Opening '${op.id}' references non-existent Wall '${op.wallId}'`,
        });
      }

      if (
        !isFiniteNumber(op.position) ||
        op.position < 0 ||
        op.position > 1
      ) {
        errors.push({
          path: `openings[${idx}].position`,
          message: `Opening '${op.id}' position must be between 0.0 and 1.0 (received ${op.position})`,
        });
      }

      if (!isPositiveNumber(op.width)) {
        errors.push({
          path: `openings[${idx}].width`,
          message: `Opening '${op.id}' width must be positive millimetres`,
        });
      }

      if (op.height !== undefined && !isPositiveNumber(op.height)) {
        errors.push({
          path: `openings[${idx}].height`,
          message: `Opening '${op.id}' height must be positive millimetres if specified`,
        });
      }
    });
  }

  // Rooms validation
  const roomIdSet = new Set<string>();
  if (!Array.isArray(input.rooms)) {
    errors.push({ path: "rooms", message: "rooms must be an array" });
  } else {
    input.rooms.forEach((r: unknown, idx: number) => {
      if (!isObject(r)) {
        errors.push({
          path: `rooms[${idx}]`,
          message: "Room must be an object",
        });
        return;
      }

      if (!isNonEmptyString(r.id)) {
        errors.push({
          path: `rooms[${idx}].id`,
          message: "Room id must be a non-empty string",
        });
      } else if (roomIdSet.has(r.id)) {
        errors.push({
          path: `rooms[${idx}].id`,
          message: `Duplicate Room id '${r.id}'`,
        });
      } else {
        roomIdSet.add(r.id);
      }

      if (!isNonEmptyString(r.type)) {
        errors.push({
          path: `rooms[${idx}].type`,
          message: `Room '${r.id}' type must be a non-empty string`,
        });
      }

      if (!Array.isArray(r.boundaryWallIds) || r.boundaryWallIds.length === 0) {
        errors.push({
          path: `rooms[${idx}].boundaryWallIds`,
          message: `Room '${r.id}' boundaryWallIds must be a non-empty array of wall IDs`,
        });
      } else {
        r.boundaryWallIds.forEach((wallId: unknown, wIdx: number) => {
          if (!isNonEmptyString(wallId) || !wallIdSet.has(wallId)) {
            errors.push({
              path: `rooms[${idx}].boundaryWallIds[${wIdx}]`,
              message: `Room '${r.id}' boundary references non-existent Wall '${wallId}'`,
            });
          }
        });
      }
    });
  }

  // Furniture validation
  const furnitureIdSet = new Set<string>();
  if (!Array.isArray(input.furniture)) {
    errors.push({ path: "furniture", message: "furniture must be an array" });
  } else {
    input.furniture.forEach((f: unknown, idx: number) => {
      if (!isObject(f)) {
        errors.push({
          path: `furniture[${idx}]`,
          message: "FurnitureInstance must be an object",
        });
        return;
      }

      if (!isNonEmptyString(f.id)) {
        errors.push({
          path: `furniture[${idx}].id`,
          message: "FurnitureInstance id must be a non-empty string",
        });
      } else if (furnitureIdSet.has(f.id)) {
        errors.push({
          path: `furniture[${idx}].id`,
          message: `Duplicate FurnitureInstance id '${f.id}'`,
        });
      } else {
        furnitureIdSet.add(f.id);
      }

      if (!isNonEmptyString(f.definitionId)) {
        errors.push({
          path: `furniture[${idx}].definitionId`,
          message: "FurnitureInstance definitionId must be a non-empty string",
        });
      }

      if (!isFiniteNumber(f.x) || !isFiniteNumber(f.y)) {
        errors.push({
          path: `furniture[${idx}]`,
          message: `FurnitureInstance '${f.id}' coordinates must be finite numbers in mm`,
        });
      }

      if (!isPositiveNumber(f.width) || !isPositiveNumber(f.depth)) {
        errors.push({
          path: `furniture[${idx}]`,
          message: `FurnitureInstance '${f.id}' width and depth must be positive millimetres`,
        });
      }

      if (!isFiniteNumber(f.rotation)) {
        errors.push({
          path: `furniture[${idx}].rotation`,
          message: `FurnitureInstance '${f.id}' rotation must be a finite number`,
        });
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: input as unknown as FloorPlan };
}

const VALID_FURNITURE_CATEGORIES = [
  "bed",
  "sofa",
  "table",
  "chair",
  "storage",
  "desk",
  "tv_stand",
  "other",
] as const;

const VALID_FURNITURE_SIDES: FurnitureSide[] = [
  "front",
  "back",
  "left",
  "right",
];

/**
 * Validate FurnitureDefinition (Contract Section 2, Section 5, AC-4, AC-19)
 */
export function validateFurnitureDefinition(
  input: unknown,
): ValidationResult<FurnitureDefinition> {
  const errors: ValidationError[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      errors: [{ path: "", message: "FurnitureDefinition must be a JSON object" }],
    };
  }

  if (!isNonEmptyString(input.id)) {
    errors.push({
      path: "id",
      message: "FurnitureDefinition id must be a non-empty string",
    });
  }

  if (!isNonEmptyString(input.name)) {
    errors.push({
      path: "name",
      message: "FurnitureDefinition name must be a non-empty string",
    });
  }

  if (
    !isNonEmptyString(input.category) ||
    !VALID_FURNITURE_CATEGORIES.includes(input.category as any)
  ) {
    errors.push({
      path: "category",
      message: `FurnitureDefinition category must be one of: ${VALID_FURNITURE_CATEGORIES.join(", ")}`,
    });
  }

  if (!Array.isArray(input.specifications)) {
    errors.push({
      path: "specifications",
      message: "FurnitureDefinition specifications must be an array",
    });
  } else if (input.specifications.length === 0) {
    errors.push({
      path: "specifications",
      message: `FurnitureDefinition '${input.id || ""}' must contain at least one specification`,
    });
  } else {
    const specIdSet = new Set<string>();
    input.specifications.forEach((spec: unknown, sIdx: number) => {
      const specPath = `specifications[${sIdx}]`;
      if (!isObject(spec)) {
        errors.push({
          path: specPath,
          message: "FurnitureSpecification must be an object",
        });
        return;
      }

      if (!isNonEmptyString(spec.id)) {
        errors.push({
          path: `${specPath}.id`,
          message: "FurnitureSpecification id must be a non-empty string",
        });
      } else if (specIdSet.has(spec.id)) {
        errors.push({
          path: `${specPath}.id`,
          message: `Duplicate FurnitureSpecification id '${spec.id}' in definition '${input.id || ""}'`,
        });
      } else {
        specIdSet.add(spec.id);
      }

      if (!isNonEmptyString(spec.name)) {
        errors.push({
          path: `${specPath}.name`,
          message: `FurnitureSpecification '${spec.id || sIdx}' name must be a non-empty string`,
        });
      }

      if (!isPositiveNumber(spec.width)) {
        errors.push({
          path: `${specPath}.width`,
          message: `Specification '${spec.id || sIdx}' width must be a positive finite number in mm`,
        });
      }

      if (!isPositiveNumber(spec.depth)) {
        errors.push({
          path: `${specPath}.depth`,
          message: `Specification '${spec.id || sIdx}' depth must be a positive finite number in mm`,
        });
      }

      if (spec.height !== undefined && !isPositiveNumber(spec.height)) {
        errors.push({
          path: `${specPath}.height`,
          message: `Specification '${spec.id || sIdx}' height must be a positive finite number in mm if specified`,
        });
      }

      if (!isObject(spec.clearance)) {
        errors.push({
          path: `${specPath}.clearance`,
          message: `Specification '${spec.id || sIdx}' clearance must be an object containing front, back, left, and right thresholds`,
        });
      } else {
        for (const side of VALID_FURNITURE_SIDES) {
          const sideThreshold = (spec.clearance as Record<string, unknown>)[side];
          const sidePath = `${specPath}.clearance.${side}`;
          if (!isObject(sideThreshold)) {
            errors.push({
              path: sidePath,
              message: `Clearance threshold for side '${side}' in specification '${spec.id || sIdx}' must be an object with minimum and recommended`,
            });
            continue;
          }

          const { minimum, recommended } = sideThreshold;
          let minValid = true;
          let recValid = true;

          if (!isNonNegativeNumber(minimum)) {
            errors.push({
              path: `${sidePath}.minimum`,
              message: `Clearance minimum for side '${side}' in specification '${spec.id || sIdx}' must be a non-negative finite number in mm`,
            });
            minValid = false;
          }

          if (!isNonNegativeNumber(recommended)) {
            errors.push({
              path: `${sidePath}.recommended`,
              message: `Clearance recommended for side '${side}' in specification '${spec.id || sIdx}' must be a non-negative finite number in mm`,
            });
            recValid = false;
          }

          if (minValid && recValid && (minimum as number) > (recommended as number)) {
            errors.push({
              path: sidePath,
              message: `Clearance minimum (${minimum}) must be <= recommended (${recommended}) for side '${side}' in specification '${spec.id || sIdx}'`,
            });
          }
        }
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: input as unknown as FurnitureDefinition };
}

/**
 * Validate Furniture Catalog (Contract Section 2, Section 5, AC-4, AC-19, AC-21)
 */
export function validateFurnitureCatalog(
  input: unknown,
): ValidationResult<FurnitureCatalog> {
  const errors: ValidationError[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      errors: [{ path: "", message: "FurnitureCatalog must be a JSON object" }],
    };
  }

  if (input.version !== 2) {
    errors.push({
      path: "version",
      message: `FurnitureCatalog version must be 2 (received ${input.version})`,
    });
  }

  if (input.unit !== CANONICAL_UNIT) {
    errors.push({
      path: "unit",
      message: `FurnitureCatalog unit must be '${CANONICAL_UNIT}' (millimetres), received '${input.unit}'`,
    });
  }

  const defIdSet = new Set<string>();
  const catalogSpecIdSet = new Set<string>();

  if (!Array.isArray(input.definitions)) {
    errors.push({
      path: "definitions",
      message: "FurnitureCatalog definitions must be an array",
    });
  } else {
    input.definitions.forEach((def: unknown, idx: number) => {
      const defPathPrefix = `definitions[${idx}]`;
      if (!isObject(def)) {
        errors.push({
          path: defPathPrefix,
          message: "FurnitureDefinition must be an object",
        });
        return;
      }

      if (!isNonEmptyString(def.id)) {
        errors.push({
          path: `${defPathPrefix}.id`,
          message: "FurnitureDefinition id must be a non-empty string",
        });
      } else if (defIdSet.has(def.id)) {
        errors.push({
          path: `${defPathPrefix}.id`,
          message: `Duplicate FurnitureDefinition id '${def.id}'`,
        });
      } else {
        defIdSet.add(def.id);
      }

      const defResult = validateFurnitureDefinition(def);
      if (!defResult.ok) {
        for (const err of defResult.errors) {
          if (err.path === "id" && errors.some((e) => e.path === `${defPathPrefix}.id`)) {
            continue;
          }
          errors.push({
            path: err.path ? `${defPathPrefix}.${err.path}` : defPathPrefix,
            message: err.message,
            code: err.code,
          });
        }
      }

      // Check duplicate specification IDs across entire catalog
      if (Array.isArray(def.specifications)) {
        def.specifications.forEach((spec: unknown, sIdx: number) => {
          if (isObject(spec) && isNonEmptyString(spec.id)) {
            if (catalogSpecIdSet.has(spec.id)) {
              errors.push({
                path: `${defPathPrefix}.specifications[${sIdx}].id`,
                message: `Duplicate FurnitureSpecification id '${spec.id}' across catalog in definition '${def.id || idx}'`,
              });
            } else {
              catalogSpecIdSet.add(spec.id);
            }
          }
        });
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: input as unknown as FurnitureCatalog };
}

/**
 * Validate Legacy Furniture Catalog v1
 */
export function validateFurnitureCatalogV1(
  input: unknown,
): ValidationResult<FurnitureCatalogV1> {
  const errors: ValidationError[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      errors: [{ path: "", message: "FurnitureCatalog must be a JSON object" }],
    };
  }

  if (input.version !== 1) {
    errors.push({
      path: "version",
      message: `FurnitureCatalog version must be 1 (received ${input.version})`,
    });
  }

  if (input.unit !== CANONICAL_UNIT) {
    errors.push({
      path: "unit",
      message: `FurnitureCatalog unit must be '${CANONICAL_UNIT}' (millimetres), received '${input.unit}'`,
    });
  }

  const defIdSet = new Set<string>();
  if (!Array.isArray(input.definitions)) {
    errors.push({
      path: "definitions",
      message: "FurnitureCatalog definitions must be an array",
    });
  } else {
    input.definitions.forEach((def: unknown, idx: number) => {
      if (!isObject(def)) {
        errors.push({
          path: `definitions[${idx}]`,
          message: "FurnitureDefinition must be an object",
        });
        return;
      }

      if (!isNonEmptyString(def.id)) {
        errors.push({
          path: `definitions[${idx}].id`,
          message: "FurnitureDefinition id must be a non-empty string",
        });
      } else if (defIdSet.has(def.id)) {
        errors.push({
          path: `definitions[${idx}].id`,
          message: `Duplicate FurnitureDefinition id '${def.id}'`,
        });
      } else {
        defIdSet.add(def.id);
      }

      if (!isNonEmptyString(def.name)) {
        errors.push({
          path: `definitions[${idx}].name`,
          message: "FurnitureDefinition name must be a non-empty string",
        });
      }

      if (!isNonEmptyString(def.category)) {
        errors.push({
          path: `definitions[${idx}].category`,
          message: "FurnitureDefinition category must be a non-empty string",
        });
      }

      if (!isObject(def.defaultSize)) {
        errors.push({
          path: `definitions[${idx}].defaultSize`,
          message: "defaultSize must be an object with width and depth in mm",
        });
      } else {
        if (!isPositiveNumber(def.defaultSize.width)) {
          errors.push({
            path: `definitions[${idx}].defaultSize.width`,
            message: "defaultSize.width must be positive millimetres",
          });
        }
        if (!isPositiveNumber(def.defaultSize.depth)) {
          errors.push({
            path: `definitions[${idx}].defaultSize.depth`,
            message: "defaultSize.depth must be positive millimetres",
          });
        }
      }

      if (def.clearanceRules !== undefined) {
        if (!isObject(def.clearanceRules)) {
          errors.push({
            path: `definitions[${idx}].clearanceRules`,
            message: "clearanceRules must be an object",
          });
        } else {
          for (const [side, clearance] of Object.entries(def.clearanceRules)) {
            if (clearance !== undefined && !isNonNegativeNumber(clearance)) {
              errors.push({
                path: `definitions[${idx}].clearanceRules.${side}`,
                message: `clearanceRules.${side} must be non-negative millimetres`,
              });
            }
          }
        }
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: input as unknown as FurnitureCatalogV1 };
}

/**
 * Validate Space-Rule Configuration
 */
export function validateSpaceRuleConfig(
  input: unknown,
): ValidationResult<SpaceRuleConfig> {
  const errors: ValidationError[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      errors: [{ path: "", message: "SpaceRuleConfig must be a JSON object" }],
    };
  }

  if (input.version !== 1) {
    errors.push({
      path: "version",
      message: `SpaceRuleConfig version must be 1 (received ${input.version})`,
    });
  }

  if (input.unit !== CANONICAL_UNIT) {
    errors.push({
      path: "unit",
      message: `SpaceRuleConfig unit must be '${CANONICAL_UNIT}' (millimetres), received '${input.unit}'`,
    });
  }

  if (!isObject(input.rules)) {
    errors.push({
      path: "rules",
      message: "rules must be an object containing rule definitions",
    });
    return { ok: false, errors };
  }

  const { collision, doorSwing, circulation, furnitureClearance } = input.rules;

  if (!isObject(collision) || typeof collision.enabled !== "boolean") {
    errors.push({
      path: "rules.collision",
      message: "rules.collision must have boolean 'enabled'",
    });
  }

  if (!isObject(doorSwing) || !isPositiveNumber(doorSwing.minClearanceDepthMm)) {
    errors.push({
      path: "rules.doorSwing.minClearanceDepthMm",
      message: "doorSwing.minClearanceDepthMm must be positive millimetres",
    });
  }

  if (!isObject(circulation)) {
    errors.push({
      path: "rules.circulation",
      message: "rules.circulation must be an object",
    });
  } else {
    if (!isPositiveNumber(circulation.minMainPassageWidthMm)) {
      errors.push({
        path: "rules.circulation.minMainPassageWidthMm",
        message: "circulation.minMainPassageWidthMm must be positive millimetres",
      });
    }
    if (!isPositiveNumber(circulation.minSecondaryPassageWidthMm)) {
      errors.push({
        path: "rules.circulation.minSecondaryPassageWidthMm",
        message: "circulation.minSecondaryPassageWidthMm must be positive millimetres",
      });
    }
  }

  if (!isObject(furnitureClearance)) {
    errors.push({
      path: "rules.furnitureClearance",
      message: "rules.furnitureClearance must be an object",
    });
  } else {
    const checks = [
      ["bedSideClearanceMm", furnitureClearance.bedSideClearanceMm],
      ["bedFootClearanceMm", furnitureClearance.bedFootClearanceMm],
      ["wardrobeFrontClearanceMm", furnitureClearance.wardrobeFrontClearanceMm],
      ["diningChairPulloutMm", furnitureClearance.diningChairPulloutMm],
    ] as const;

    for (const [key, val] of checks) {
      if (!isNonNegativeNumber(val)) {
        errors.push({
          path: `rules.furnitureClearance.${key}`,
          message: `${key} must be non-negative millimetres`,
        });
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: input as unknown as SpaceRuleConfig };
}

/**
 * Validate PlacementScenario (Contract section 3)
 */
export function validatePlacementScenario(
  input: unknown,
): ValidationResult<PlacementScenario> {
  const errors: ValidationError[] = [];

  if (!isObject(input)) {
    return {
      ok: false,
      errors: [{ path: "", message: "PlacementScenario must be a JSON object" }],
    };
  }

  if (input.version !== 1) {
    errors.push({
      path: "version",
      message: `PlacementScenario version must be 1 (received ${input.version})`,
    });
  }

  if (input.unit !== CANONICAL_UNIT) {
    errors.push({
      path: "unit",
      message: `PlacementScenario unit must be '${CANONICAL_UNIT}' (millimetres), received '${input.unit}'`,
    });
  }

  if (!isNonEmptyString(input.planId)) {
    errors.push({
      path: "planId",
      message: "planId must be a non-empty string",
    });
  }

  const placementIdSet = new Set<string>();

  if (!Array.isArray(input.placements)) {
    errors.push({
      path: "placements",
      message: "placements must be an array",
    });
  } else {
    input.placements.forEach((p: unknown, idx: number) => {
      const pathPrefix = `placements[${idx}]`;
      if (!isObject(p)) {
        errors.push({
          path: pathPrefix,
          message: "FurniturePlacement must be an object",
        });
        return;
      }

      if (!isNonEmptyString(p.id)) {
        errors.push({
          path: `${pathPrefix}.id`,
          message: "FurniturePlacement id must be a non-empty string",
        });
      } else if (placementIdSet.has(p.id)) {
        errors.push({
          path: `${pathPrefix}.id`,
          message: `Duplicate placement id '${p.id}'`,
        });
      } else {
        placementIdSet.add(p.id);
      }

      if (!isNonEmptyString(p.definitionId)) {
        errors.push({
          path: `${pathPrefix}.definitionId`,
          message: "FurniturePlacement definitionId must be a non-empty string",
        });
      }

      if (!isNonEmptyString(p.specificationId)) {
        errors.push({
          path: `${pathPrefix}.specificationId`,
          message: "FurniturePlacement specificationId must be a non-empty string",
        });
      }

      if (!isFiniteNumber(p.x)) {
        errors.push({
          path: `${pathPrefix}.x`,
          message: "FurniturePlacement x must be a finite number in mm",
        });
      }

      if (!isFiniteNumber(p.y)) {
        errors.push({
          path: `${pathPrefix}.y`,
          message: "FurniturePlacement y must be a finite number in mm",
        });
      }

      const validRotations = [0, 90, 180, 270];
      if (typeof p.rotation !== "number" || !validRotations.includes(p.rotation)) {
        errors.push({
          path: `${pathPrefix}.rotation`,
          message: "FurniturePlacement rotation must be 0, 90, 180, or 270",
        });
      }
    });
  }

  if (input.targetPlacementId !== undefined) {
    if (!isNonEmptyString(input.targetPlacementId)) {
      errors.push({
        path: "targetPlacementId",
        message: "targetPlacementId must be a non-empty string if specified",
      });
    } else if (Array.isArray(input.placements) && !placementIdSet.has(input.targetPlacementId)) {
      errors.push({
        path: "targetPlacementId",
        message: `targetPlacementId '${input.targetPlacementId}' not found in placements`,
      });
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: input as unknown as PlacementScenario };
}

