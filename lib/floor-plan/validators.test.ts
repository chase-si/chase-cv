import { describe, expect, it } from "vitest";
import {
  validateCandidateFloorPlan,
  validateFloorPlan,
  validateFurnitureCatalog,
  validateFurnitureDefinition,
  validatePlacementScenario,
  validateSpaceRuleConfig,
} from "./validators";
import {
  VALID_FURNITURE_CATALOG,
  VALID_SPACE_RULE_CONFIG,
  VALID_STANDARD_FLOOR_PLAN,
} from "./fixtures";

describe("AC-17: FloorPlan v1 Contract Formats & Validators", () => {

  describe("Normalized Standard FloorPlan v1", () => {
    it("validates a valid canonical FloorPlan with real-world dimensions in mm", () => {
      const result = validateFloorPlan(VALID_STANDARD_FLOOR_PLAN);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe(1);
        expect(result.value.unit).toBe("mm");
        expect(result.value.vertices.length).toBeGreaterThan(0);
        expect(result.value.walls.length).toBeGreaterThan(0);
        expect(result.value.rooms.length).toBeGreaterThan(0);
      }
    });

    it("rejects plans with missing or non-mm unit", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        unit: "m",
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.path.includes("unit"))).toBe(true);
      }
    });

    it("rejects walls referencing non-existent vertices", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        walls: [
          {
            id: "w-bad",
            from: "non-existent-v1",
            to: "non-existent-v2",
            thickness: 120,
            lockAxis: "horizontal",
          },
        ],
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.message.includes("Vertex"))).toBe(true);
      }
    });

    it("rejects openings referencing non-existent walls", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        openings: [
          {
            id: "op-bad",
            type: "door",
            wallId: "wall-that-does-not-exist",
            position: 0.5,
            width: 900,
          },
        ],
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.message.includes("Wall"))).toBe(true);
      }
    });

    it("rejects openings with out-of-range position (position not in 0..1)", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        openings: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.openings[0],
            position: 1.5,
          },
        ],
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
    });

    it("rejects negative or zero wall thickness and opening width", () => {
      const invalidThickness = {
        ...VALID_STANDARD_FLOOR_PLAN,
        walls: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.walls[0],
            thickness: 0,
          },
        ],
      };
      expect(validateFloorPlan(invalidThickness).ok).toBe(false);

      const invalidWidth = {
        ...VALID_STANDARD_FLOOR_PLAN,
        openings: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.openings[0],
            width: -50,
          },
        ],
      };
      expect(validateFloorPlan(invalidWidth).ok).toBe(false);
    });

    it("rejects rooms referencing non-existent boundary walls", () => {
      const invalid = {
        ...VALID_STANDARD_FLOOR_PLAN,
        rooms: [
          {
            id: "r1",
            type: "living_room",
            name: "Living Room",
            boundaryWallIds: ["w-missing-1", "w-missing-2", "w-missing-3"],
          },
        ],
      };
      const result = validateFloorPlan(invalid);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.message.includes("boundary"))).toBe(true);
      }
    });
  });

  describe("AC-15 & AC-16: Candidate FloorPlan Topology & Closure Validator", () => {
    it("accepts a candidate plan without furniture array and normalizes furniture to []", () => {
      const { furniture: _omitted, ...candidateWithoutFurniture } = VALID_STANDARD_FLOOR_PLAN;
      const result = validateCandidateFloorPlan(candidateWithoutFurniture);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.furniture).toEqual([]);
      }
    });

    it("rejects non-finite vertex coordinates (NaN / Infinity) and locates vertex ID and field path (AC-15)", () => {
      const candidate = {
        ...VALID_STANDARD_FLOOR_PLAN,
        vertices: VALID_STANDARD_FLOOR_PLAN.vertices.map((v, i) =>
          i === 1 ? { ...v, x: Number.NaN } : v,
        ),
      };
      const result = validateCandidateFloorPlan(candidate);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.some((e) => e.path === "vertices[1].x" && e.message.includes("v2"))).toBe(true);
      }
    });

    it("rejects duplicate IDs for vertices, walls, openings, and rooms (AC-15)", () => {
      const dupWallPlan = {
        ...VALID_STANDARD_FLOOR_PLAN,
        walls: [
          ...VALID_STANDARD_FLOOR_PLAN.walls,
          { ...VALID_STANDARD_FLOOR_PLAN.walls[0] },
        ],
      };
      const res = validateCandidateFloorPlan(dupWallPlan);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.errors.some((e) => e.path === "walls[7].id" && e.message.includes("w1"))).toBe(true);
      }
    });

    it("rejects zero-length walls where distinct vertices share identical coordinates (AC-15)", () => {
      const zeroLenWallPlan = {
        ...VALID_STANDARD_FLOOR_PLAN,
        vertices: VALID_STANDARD_FLOOR_PLAN.vertices.map((v) =>
          v.id === "v2" ? { ...v, x: 0, y: 0 } : v,
        ),
      };
      const res = validateCandidateFloorPlan(zeroLenWallPlan);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(
          res.errors.some(
            (e) => e.path === "walls[0]" && e.message.includes("w1") && e.message.includes("length must be greater than 0"),
          ),
        ).toBe(true);
      }
    });

    it("rejects openings wider than host wall or extending beyond host wall span (AC-15)", () => {
      const widerThanWall = {
        ...VALID_STANDARD_FLOOR_PLAN,
        openings: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.openings[0], // on w1 (length 3000)
            width: 3500,
          },
        ],
      };
      const resWider = validateCandidateFloorPlan(widerThanWall);
      expect(resWider.ok).toBe(false);
      if (!resWider.ok) {
        expect(
          resWider.errors.some(
            (e) =>
              e.path === "openings[0].width" &&
              e.message.includes("win1") &&
              e.message.includes("w1"),
          ),
        ).toBe(true);
      }

      const spanOutOfBounds = {
        ...VALID_STANDARD_FLOOR_PLAN,
        openings: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.openings[0], // on w1 (length 3000), width 1500
            position: 0.9, // center at 2700, end at 3450 > 3000
          },
        ],
      };
      const resSpan = validateCandidateFloorPlan(spanOutOfBounds);
      expect(resSpan.ok).toBe(false);
      if (!resSpan.ok) {
        expect(
          resSpan.errors.some(
            (e) =>
              e.path === "openings[0].position" &&
              e.message.includes("win1") &&
              e.message.includes("w1"),
          ),
        ).toBe(true);
      }
    });

    it("rejects unclosed room boundaries and shuffled boundaryWallIds without auto-reordering (AC-15, AC-16)", () => {
      const unclosedRoomPlan = {
        ...VALID_STANDARD_FLOOR_PLAN,
        rooms: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.rooms[0],
            boundaryWallIds: ["w1", "w7", "w5"], // missing closing wall w6
          },
          VALID_STANDARD_FLOOR_PLAN.rooms[1],
        ],
      };
      const resUnclosed = validateCandidateFloorPlan(unclosedRoomPlan);
      expect(resUnclosed.ok).toBe(false);
      if (!resUnclosed.ok) {
        expect(
          resUnclosed.errors.some(
            (e) =>
              e.path.startsWith("rooms[0].boundaryWallIds") &&
              e.message.includes("r1") &&
              e.message.includes("not closed"),
          ),
        ).toBe(true);
      }

      const shuffledRoomPlan = {
        ...VALID_STANDARD_FLOOR_PLAN,
        rooms: [
          {
            ...VALID_STANDARD_FLOOR_PLAN.rooms[0],
            boundaryWallIds: ["w1", "w5", "w7", "w6"], // w1 and w5 are opposite walls, not connected
          },
          VALID_STANDARD_FLOOR_PLAN.rooms[1],
        ],
      };
      const resShuffled = validateCandidateFloorPlan(shuffledRoomPlan);
      expect(resShuffled.ok).toBe(false);
      if (!resShuffled.ok) {
        expect(
          resShuffled.errors.some(
            (e) =>
              e.path === "rooms[0].boundaryWallIds[1]" &&
              e.message.includes("r1") &&
              e.message.includes("w5"),
          ),
        ).toBe(true);
      }
    });
  });

  describe("Furniture Catalog & Definitions (AC-4, AC-19)", () => {
    it("validates a standard furniture catalog v2 with predefined specifications (AC-4)", () => {
      const result = validateFurnitureCatalog(VALID_FURNITURE_CATALOG);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe(2);
        expect(result.value.unit).toBe("mm");
        expect(result.value.definitions.length).toBeGreaterThan(0);
        for (const def of result.value.definitions) {
          expect(def.specifications.length).toBeGreaterThanOrEqual(1);
          for (const spec of def.specifications) {
            expect(spec.width).toBeGreaterThan(0);
            expect(spec.depth).toBeGreaterThan(0);
            expect(spec.clearance.front.minimum).toBeLessThanOrEqual(spec.clearance.front.recommended);
            expect(spec.clearance.back.minimum).toBeLessThanOrEqual(spec.clearance.back.recommended);
            expect(spec.clearance.left.minimum).toBeLessThanOrEqual(spec.clearance.left.recommended);
            expect(spec.clearance.right.minimum).toBeLessThanOrEqual(spec.clearance.right.recommended);
          }
        }
      }
    });

    it("validates a standalone valid FurnitureDefinition (AC-19)", () => {
      const def = VALID_FURNITURE_CATALOG.definitions[0];
      const result = validateFurnitureDefinition(def);
      expect(result.ok).toBe(true);
    });

    it("rejects non-object or wrong version/unit for FurnitureCatalog", () => {
      expect(validateFurnitureCatalog(null).ok).toBe(false);
      expect(validateFurnitureCatalog("not-an-object").ok).toBe(false);

      const invalidVersion = { ...VALID_FURNITURE_CATALOG, version: 1 };
      const resVer = validateFurnitureCatalog(invalidVersion);
      expect(resVer.ok).toBe(false);
      if (!resVer.ok) {
        expect(resVer.errors.some((e) => e.path === "version")).toBe(true);
      }

      const invalidUnit = { ...VALID_FURNITURE_CATALOG, unit: "meter" };
      const resUnit = validateFurnitureCatalog(invalidUnit);
      expect(resUnit.ok).toBe(false);
      if (!resUnit.ok) {
        expect(resUnit.errors.some((e) => e.path === "unit")).toBe(true);
      }
    });

    it("rejects duplicate definition IDs in catalog (AC-19)", () => {
      const dupCatalog = {
        ...VALID_FURNITURE_CATALOG,
        definitions: [
          VALID_FURNITURE_CATALOG.definitions[0],
          { ...VALID_FURNITURE_CATALOG.definitions[0], name: "Duplicate Bed" },
        ],
      };
      const res = validateFurnitureCatalog(dupCatalog);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.errors.some((e) => e.message.includes("Duplicate FurnitureDefinition id"))).toBe(true);
      }
    });

    it("rejects duplicate specification IDs across definitions in catalog (AC-19)", () => {
      const def1 = VALID_FURNITURE_CATALOG.definitions[0];
      const def2 = {
        ...VALID_FURNITURE_CATALOG.definitions[1],
        id: "bed-single-unique",
        specifications: [
          {
            ...VALID_FURNITURE_CATALOG.definitions[1].specifications[0],
            id: def1.specifications[0].id, // duplicate spec ID from def1
          },
        ],
      };
      const dupSpecCatalog = {
        ...VALID_FURNITURE_CATALOG,
        definitions: [def1, def2],
      };
      const res = validateFurnitureCatalog(dupSpecCatalog);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.errors.some((e) => e.message.includes("Duplicate FurnitureSpecification id"))).toBe(true);
      }
    });

    it("rejects definition with empty specifications array (AC-19)", () => {
      const emptySpecsDef = {
        ...VALID_FURNITURE_CATALOG.definitions[0],
        specifications: [],
      };
      const res = validateFurnitureDefinition(emptySpecsDef);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.errors.some((e) => e.message.includes("must contain at least one specification"))).toBe(true);
      }
    });

    it("rejects definition with duplicate specification IDs within same definition (AC-19)", () => {
      const dupSpecDef = {
        ...VALID_FURNITURE_CATALOG.definitions[0],
        specifications: [
          VALID_FURNITURE_CATALOG.definitions[0].specifications[0],
          { ...VALID_FURNITURE_CATALOG.definitions[0].specifications[0], name: "Clone" },
        ],
      };
      const res = validateFurnitureDefinition(dupSpecDef);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.errors.some((e) => e.message.includes("Duplicate FurnitureSpecification id"))).toBe(true);
      }
    });

    it("rejects specification with non-positive dimensions (negative, zero, NaN, Infinity) (AC-19)", () => {
      const invalidDimensions = [
        { width: -100, depth: 2000, desc: "negative width" },
        { width: 0, depth: 2000, desc: "zero width" },
        { width: NaN, depth: 2000, desc: "NaN width" },
        { width: Infinity, depth: 2000, desc: "Infinity width" },
        { width: 1800, depth: -500, desc: "negative depth" },
        { width: 1800, depth: 0, desc: "zero depth" },
        { width: 1800, depth: NaN, desc: "NaN depth" },
        { width: 1800, depth: 2000, height: -10, desc: "negative height" },
        { width: 1800, depth: 2000, height: 0, desc: "zero height" },
      ];

      for (const item of invalidDimensions) {
        const badDef = {
          ...VALID_FURNITURE_CATALOG.definitions[0],
          specifications: [
            {
              ...VALID_FURNITURE_CATALOG.definitions[0].specifications[0],
              width: item.width,
              depth: item.depth,
              ...(item.height !== undefined ? { height: item.height } : {}),
            },
          ],
        };
        const res = validateFurnitureDefinition(badDef);
        expect(res.ok, `Should reject ${item.desc}`).toBe(false);
      }
    });

    it("rejects specification with negative clearance thresholds (AC-19)", () => {
      const badDef = {
        ...VALID_FURNITURE_CATALOG.definitions[0],
        specifications: [
          {
            ...VALID_FURNITURE_CATALOG.definitions[0].specifications[0],
            clearance: {
              ...VALID_FURNITURE_CATALOG.definitions[0].specifications[0].clearance,
              front: { minimum: -100, recommended: 500 },
            },
          },
        ],
      };
      const res = validateFurnitureDefinition(badDef);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.errors.some((e) => e.path.includes("clearance.front.minimum"))).toBe(true);
      }
    });

    it("rejects specification when minimum clearance > recommended clearance (AC-19)", () => {
      const badDef = {
        ...VALID_FURNITURE_CATALOG.definitions[0],
        specifications: [
          {
            ...VALID_FURNITURE_CATALOG.definitions[0].specifications[0],
            clearance: {
              ...VALID_FURNITURE_CATALOG.definitions[0].specifications[0].clearance,
              left: { minimum: 800, recommended: 600 },
            },
          },
        ],
      };
      const res = validateFurnitureDefinition(badDef);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.errors.some((e) => e.message.includes("must be <= recommended"))).toBe(true);
      }
    });

    it("rejects specification when clearance object or required side is missing", () => {
      const missingClearance = {
        ...VALID_FURNITURE_CATALOG.definitions[0],
        specifications: [
          {
            id: "spec-1",
            name: "Spec 1",
            width: 1000,
            depth: 1000,
          },
        ],
      };
      expect(validateFurnitureDefinition(missingClearance).ok).toBe(false);

      const missingSide = {
        ...VALID_FURNITURE_CATALOG.definitions[0],
        specifications: [
          {
            id: "spec-1",
            name: "Spec 1",
            width: 1000,
            depth: 1000,
            clearance: {
              front: { minimum: 100, recommended: 200 },
              // back, left, right missing
            },
          },
        ],
      };
      expect(validateFurnitureDefinition(missingSide).ok).toBe(false);
    });

    it("reports specific asset and specification ID on failure (AC-21)", () => {
      const catalogWithFailure = {
        ...VALID_FURNITURE_CATALOG,
        definitions: [
          {
            id: "problematic-sofa",
            name: "Faulty Sofa",
            category: "sofa",
            specifications: [
              {
                id: "faulty-spec-01",
                name: "Faulty Spec",
                width: 2000,
                depth: 900,
                clearance: {
                  front: { minimum: 1000, recommended: 500 }, // minimum > recommended!
                  back: { minimum: 0, recommended: 0 },
                  left: { minimum: 0, recommended: 0 },
                  right: { minimum: 0, recommended: 0 },
                },
              },
            ],
          },
        ],
      };

      const res = validateFurnitureCatalog(catalogWithFailure);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.errors.some((e) => e.path.includes("definitions[0].specifications[0]"))).toBe(true);
        expect(res.errors.some((e) => e.message.includes("faulty-spec-01"))).toBe(true);
      }
    });
  });

  describe("Space-Rule Configuration", () => {
    it("validates a space-rule configuration using millimetres", () => {
      const result = validateSpaceRuleConfig(VALID_SPACE_RULE_CONFIG);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.unit).toBe("mm");
        expect(result.value.rules.circulation.minMainPassageWidthMm).toBeGreaterThan(0);
        expect(result.value.rules.doorSwing.minClearanceDepthMm).toBeGreaterThan(0);
      }
    });

    it("rejects non-mm unit and negative threshold values", () => {
      const invalidUnit = {
        ...VALID_SPACE_RULE_CONFIG,
        unit: "cm",
      };
      expect(validateSpaceRuleConfig(invalidUnit).ok).toBe(false);

      const invalidThreshold = {
        ...VALID_SPACE_RULE_CONFIG,
        rules: {
          ...VALID_SPACE_RULE_CONFIG.rules,
          circulation: {
            ...VALID_SPACE_RULE_CONFIG.rules.circulation,
            minMainPassageWidthMm: -100,
          },
        },
      };
      expect(validateSpaceRuleConfig(invalidThreshold).ok).toBe(false);
    });
  });

  describe("PlacementScenario v1", () => {
    it("validates valid PlacementScenario with multiple placements and target placement", () => {
      const scenario = {
        version: 1,
        unit: "mm",
        planId: "floor-plan-std-01",
        placements: [
          {
            id: "p1",
            definitionId: "bed-double",
            specificationId: "bed-double-1800x2000",
            x: 1000,
            y: 1200,
            rotation: 0,
          },
          {
            id: "p2",
            definitionId: "desk",
            specificationId: "desk-1200x600",
            x: 2500,
            y: 1200,
            rotation: 90,
          },
        ],
        targetPlacementId: "p1",
      };

      const res = validatePlacementScenario(scenario);
      expect(res.ok).toBe(true);
    });

    it("rejects invalid PlacementScenario properties", () => {
      // Non-object
      expect(validatePlacementScenario(null).ok).toBe(false);
      // Wrong version
      expect(validatePlacementScenario({ version: 2, unit: "mm", planId: "p", placements: [] }).ok).toBe(false);
      // Missing planId
      expect(validatePlacementScenario({ version: 1, unit: "mm", planId: "", placements: [] }).ok).toBe(false);
      // Non-array placements
      expect(validatePlacementScenario({ version: 1, unit: "mm", planId: "p", placements: "bad" }).ok).toBe(false);
      // Duplicate placement id
      expect(
        validatePlacementScenario({
          version: 1,
          unit: "mm",
          planId: "p",
          placements: [
            { id: "p1", definitionId: "bed", specificationId: "s1", x: 0, y: 0, rotation: 0 },
            { id: "p1", definitionId: "bed", specificationId: "s2", x: 10, y: 10, rotation: 0 },
          ],
        }).ok,
      ).toBe(false);
      // Invalid rotation
      expect(
        validatePlacementScenario({
          version: 1,
          unit: "mm",
          planId: "p",
          placements: [
            { id: "p1", definitionId: "bed", specificationId: "s1", x: 0, y: 0, rotation: 45 },
          ],
        }).ok,
      ).toBe(false);
      // Non-existent targetPlacementId
      expect(
        validatePlacementScenario({
          version: 1,
          unit: "mm",
          planId: "p",
          placements: [
            { id: "p1", definitionId: "bed", specificationId: "s1", x: 0, y: 0, rotation: 0 },
          ],
          targetPlacementId: "non-existent-target",
        }).ok,
      ).toBe(false);
    });
  });
});

