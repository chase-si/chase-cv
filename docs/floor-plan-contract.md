# FloorPlan v1 Contract Specification

This document defines the canonical **FloorPlan v1** contract for the floor plan editor, standard plans, user drafts, exports, and image importers.

All real-world dimensions across all contract models use **millimetres (`mm`)** as specified in `AC-17`.

---

## 1. Plan Source-Package Metadata (`PlanSourcePackageMetadata`)

Used for image uploads, CubiCasa recognition results, and imported source packages before or during topology normalization.

```ts
interface PlanSourcePackageMetadata {
  version: 1;
  unit: "mm";
  imageId: string;
  imageUri?: string;
  imageHash: string;
  imageWidthPx: number;
  imageHeightPx: number;
  sourceType: "cubicasa" | "image" | "cad" | "template";
  calibration: {
    realLengthMm: number; // in mm
    selectedPixelLength: number; // in px
    mmPerPixel: number; // calculated: realLengthMm / selectedPixelLength
    scaled: boolean; // true if two-point calibration has been performed
  };
  inference?: {
    engine: string;
    modelVersion: string;
    inferenceMs?: number;
  };
  meta: {
    name: string;
    source: string;
    createdAt: string; // ISO 8601
    updatedAt?: string;
  };
}
```

---

## 2. Normalized Standard Plan (`FloorPlan` / `StandardFloorPlan`)

Canonical, scale-aware topology shared by standard templates, user plans, exports, and storage.

```ts
interface FloorPlan {
  version: 1;
  unit: "mm";
  meta: {
    id?: string;
    name: string;
    source: "template" | "user" | "cubicasa" | "import";
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
    isStandard?: boolean; // true for curated read-only standard plans
    description?: string;
  };
  vertices: Array<{
    id: string;
    x: number; // in mm
    y: number; // in mm
  }>;
  walls: Array<{
    id: string;
    from: string; // references Vertex.id
    to: string; // references Vertex.id
    thickness: number; // in mm (e.g. 120, 200, 240)
    lockAxis: "horizontal" | "vertical" | "none";
  }>;
  openings: Array<{
    id: string;
    type: "door" | "window" | "sliding_door" | "opening";
    wallId: string; // references Wall.id
    position: number; // 0.0 to 1.0 along the wall
    width: number; // in mm (e.g. 900, 1500)
    height?: number; // in mm (optional)
  }>;
  rooms: Array<{
    id: string;
    type:
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
    name?: string;
    boundaryWallIds: string[]; // ordered cycle of wall IDs
  }>;
  furniture: Array<{
    id: string;
    definitionId: string; // references FurnitureDefinition.id
    x: number; // in mm
    y: number; // in mm
    width: number; // in mm
    depth: number; // in mm
    rotation: number; // in degrees (0, 90, 180, 270)
    elevation?: number; // in mm (optional)
  }>;
}
```

---

## 3. Furniture Catalog & Definitions (`FurnitureCatalog`)

Defines available furniture types with default real-world dimensions, allowed dimension ranges, and clearance rules for spatial verification.

```ts
interface FurnitureDefinition {
  id: string;
  name: string;
  category: "bed" | "sofa" | "table" | "chair" | "storage" | "desk" | "tv_stand" | "other";
  defaultSize: {
    width: number; // in mm
    depth: number; // in mm
    height?: number; // in mm
  };
  allowedSizeRanges?: {
    width?: { min: number; max: number; step?: number }; // in mm
    depth?: { min: number; max: number; step?: number }; // in mm
    height?: { min: number; max: number; step?: number }; // in mm
  };
  clearanceRules?: {
    front?: number; // in mm
    back?: number; // in mm
    left?: number; // in mm
    right?: number; // in mm
    all?: number; // in mm
  };
}

interface FurnitureCatalog {
  version: 1;
  unit: "mm";
  definitions: FurnitureDefinition[];
}
```

---

## 4. Space-Rule Configuration (`SpaceRuleConfig`)

Configurable spatial rules and thresholds in millimetres for collision, circulation, door swing zones, and furniture clearance.

```ts
interface SpaceRuleConfig {
  version: 1;
  unit: "mm";
  rules: {
    collision: {
      enabled: boolean;
      severity: "error" | "warning";
    };
    doorSwing: {
      enabled: boolean;
      severity: "error" | "warning";
      minClearanceDepthMm: number; // e.g. 900 mm
    };
    circulation: {
      enabled: boolean;
      severity: "warning" | "info";
      minMainPassageWidthMm: number; // e.g. 900 mm
      minSecondaryPassageWidthMm: number; // e.g. 600 mm
    };
    furnitureClearance: {
      enabled: boolean;
      severity: "warning" | "info";
      bedSideClearanceMm: number; // e.g. 600 mm
      bedFootClearanceMm: number; // e.g. 600 mm
      wardrobeFrontClearanceMm: number; // e.g. 800 mm
      diningChairPulloutMm: number; // e.g. 750 mm
    };
  };
}
```

---

## 5. Schema Migration & Safe Storage Failure Guarantee (`AC-18`)

1. **Supported Versions**:
   - Current schema: Version `1` (`FloorPlan`)
   - Previous schema: Version `0` (`FloorPlanV0` - legacy plans migrated automatically, normalizing meters to mm and `wallIds` to `boundaryWallIds`).
2. **Safe Failure**:
   - Documents with unsupported schema versions (e.g. `version >= 2` or negative numbers) or corrupt data (broken JSON, malformed coordinates, broken topological references) fail gracefully via `loadFloorPlanRecord()`.
   - `FloorPlanRepository.updateSafely()` guarantees that existing stored plans are never mutated or overwritten when parsing or migration fails.
