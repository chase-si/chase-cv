/**
 * FloorPlan v2 Contract Types
 *
 * Domain types according to docs/floor.md v0.2 and CONTEXT.md:
 * - FloorPlan: Canonical scale-aware topology (vertices, walls, ordered room boundaries, wall-bound openings, furniture).
 * - Standard plan: Curated read-only FloorPlan.
 * - Millimetres (mm) for all real-world dimensions.
 */

export const CANONICAL_UNIT = "mm" as const;
export type UnitMillimetre = typeof CANONICAL_UNIT;

export type PlanSourceType = "template" | "user" | "import";

export type LockAxis = "horizontal" | "vertical" | "none";

export type OpeningType = "door" | "window" | "sliding_door" | "opening";

export type RoomType =
  | "living_room"
  | "bedroom"
  | "master_bedroom"
  | "kitchen"
  | "bathroom"
  | "balcony"
  | "dining_room"
  | "study"
  | "hallway"
  | "storage"
  | "other";

export type FurnitureCategory =
  | "bed"
  | "sofa"
  | "table"
  | "chair"
  | "storage"
  | "desk"
  | "tv_stand"
  | "other";

export type RuleSeverity = "error" | "warning" | "info";

export interface Vertex {
  id: string;
  x: number; // in mm
  y: number; // in mm
}

export interface Wall {
  id: string;
  from: string; // references Vertex.id
  to: string; // references Vertex.id
  thickness: number; // in mm (e.g. 120, 200, 240)
  lockAxis: LockAxis;
}

export interface Opening {
  id: string;
  type: OpeningType;
  wallId: string; // references Wall.id
  position: number; // relative position along wall, strictly 0.0 to 1.0
  width: number; // in mm (e.g. 900, 1500)
  height?: number; // in mm (optional)
}

export interface Room {
  id: string;
  type: RoomType;
  name?: string;
  boundaryWallIds: string[]; // ordered cycle of directed wall references
}

export type FurnitureRotation = 0 | 90 | 180 | 270;

export interface FurniturePlacement {
  id: string;
  definitionId: string;
  specificationId: string;
  x: number;
  y: number;
  rotation: FurnitureRotation;
}

export interface PlacementScenario {
  version: 1;
  unit: UnitMillimetre;
  planId: string;
  placements: FurniturePlacement[];
  targetPlacementId?: string;
}

export interface FurnitureInstance {
  id: string;
  definitionId: string; // references FurnitureDefinition.id
  specificationId?: string; // references FurnitureSpecification.id
  x: number; // in mm (plan coordinate space)
  y: number; // in mm
  width: number; // in mm
  depth: number; // in mm
  rotation: number; // in degrees (e.g. 0, 90, 180, 270)
  elevation?: number; // in mm (optional)
}

export interface FloorPlanMeta {
  id?: string;
  name: string;
  source: PlanSourceType;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  isStandard?: boolean;
  templateId?: string; // References original template ID if derived from a standard plan
  thumbnail?: string;
  description?: string;
  unscaled?: boolean;
  scaled?: boolean;
  scaleMmPerPixel?: number;
}

/**
 * Canonical FloorPlan v2
 */
export interface FloorPlan {
  version: 2;
  unit: UnitMillimetre;
  meta: FloorPlanMeta;
  vertices: Vertex[];
  walls: Wall[];
  openings: Opening[];
  rooms: Room[];
  furniture: FurnitureInstance[];
}

/**
 * Standard Plan: Curated, read-only FloorPlan
 */
export type StandardFloorPlan = FloorPlan & {
  meta: FloorPlanMeta & {
    isStandard: true;
    source: "template";
  };
};

/**
 * Furniture Catalog & Definitions (Contract Section 2)
 */
export type FurnitureSide = "front" | "back" | "left" | "right";

export interface ClearanceThreshold {
  minimum: number;
  recommended: number;
}

export interface FurnitureSpecification {
  id: string;
  name: string;
  width: number;
  depth: number;
  height?: number;
  clearance: Record<FurnitureSide, ClearanceThreshold>;
}

export interface FurnitureDefinition {
  id: string;
  name: string;
  category: FurnitureCategory;
  specifications: FurnitureSpecification[];
}

export interface FurnitureCatalog {
  version: 2;
  unit: UnitMillimetre;
  definitions: FurnitureDefinition[];
}

/**
 * Space Assessment Types (Contract Section 4)
 */
export type AssessmentStatus =
  | "suitable"
  | "trade-off"
  | "must-adjust"
  | "unavailable";

export type AssessmentFindingKind =
  | "furniture-overlap"
  | "wall-overlap"
  | "outside-room"
  | "below-minimum-clearance"
  | "below-recommended-clearance";

export interface AssessmentFinding {
  kind: AssessmentFindingKind;
  placementId: string;
  relatedPlacementId?: string;
  wallId?: string;
  side?: FurnitureSide;
  measuredMm?: number;
  minimumMm?: number;
  recommendedMm?: number;
}

export interface SpaceAssessment {
  status: AssessmentStatus;
  findings: AssessmentFinding[];
}

/**
 * Space-Rule Configuration
 */
export interface CollisionRuleConfig {
  enabled: boolean;
  severity: RuleSeverity;
}

export interface DoorSwingRuleConfig {
  enabled: boolean;
  severity: RuleSeverity;
  minClearanceDepthMm: number;
}

export interface CirculationRuleConfig {
  enabled: boolean;
  severity: RuleSeverity;
  minMainPassageWidthMm: number;
  minSecondaryPassageWidthMm: number;
}

export interface FurnitureClearanceRuleConfig {
  enabled: boolean;
  severity: RuleSeverity;
  bedSideClearanceMm: number;
  bedFootClearanceMm: number;
  wardrobeFrontClearanceMm: number;
  diningChairPulloutMm: number;
}

export interface SpaceRuleConfig {
  version: 1;
  unit: UnitMillimetre;
  rules: {
    collision: CollisionRuleConfig;
    doorSwing: DoorSwingRuleConfig;
    circulation: CirculationRuleConfig;
    furnitureClearance: FurnitureClearanceRuleConfig;
  };
}

/**
 * Validation Result & Error types
 */
export interface ValidationError {
  path: string;
  message: string;
  code?: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationError[] };
