# Floor-plan MVP target contract

> This is the enforced domain contract (`version: 2`) for the converged MVP. Legacy `v0`/`v1` schema compatibility, arbitrary resize ranges, and temporary adapters have been removed (#225).

All real-world dimensions use millimetres (`mm`). IDs are stable, unique within their collection, and compared as opaque strings.

## 1. Standard floor plan

A standard floor plan is curated, read-only topology. Furniture placement is not part of the standard-plan definition.

```ts
interface StandardFloorPlan {
  version: 2;
  unit: "mm";
  meta: {
    id: string;
    name: string;
    source: "template";
    createdAt: string;
    updatedAt: string;
    description?: string;
  };
  vertices: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  walls: Array<{
    id: string;
    from: string;
    to: string;
    thickness: number;
    lockAxis: "horizontal" | "vertical" | "none";
  }>;
  openings: Array<{
    id: string;
    type: "door" | "window" | "sliding_door" | "opening";
    wallId: string;
    position: number;
    width: number;
    height?: number;
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
    boundaryWallIds: string[];
  }>;
}
```

`boundaryWallIds` must describe one closed room boundary. Rendering must reject an invalid boundary rather than reorder or repair it.

## 2. Furniture catalog

A furniture definition is a generic kind. A furniture specification is one predefined size of that kind. The catalog does not represent a brand, product, price, or SKU.

```ts
type FurnitureSide = "front" | "back" | "left" | "right";

interface ClearanceThreshold {
  minimum: number;
  recommended: number;
}

interface FurnitureSpecification {
  id: string;
  name: string;
  width: number;
  depth: number;
  height?: number;
  clearance: Record<FurnitureSide, ClearanceThreshold>;
}

interface FurnitureDefinition {
  id: string;
  name: string;
  category:
    | "bed"
    | "sofa"
    | "table"
    | "chair"
    | "storage"
    | "desk"
    | "tv_stand"
    | "other";
  specifications: FurnitureSpecification[];
}

interface FurnitureCatalog {
  version: 2;
  unit: "mm";
  definitions: FurnitureDefinition[];
}
```

Furniture orientation is defined as:

- `front`: the primary use or approach side;
- `back`: the side normally facing a wall for beds and sofas;
- `left` and `right`: viewed while facing the furniture front.

For every side, `0 <= minimum <= recommended`. A zero value means that side may touch an obstacle without a clearance shortfall; it does not permit physical overlap.

## 3. Placement scenario

A placement scenario combines a standard plan with user-selected furniture specifications.

```ts
interface FurniturePlacement {
  id: string;
  definitionId: string;
  specificationId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
}

interface PlacementScenario {
  version: 1;
  unit: "mm";
  planId: string;
  placements: FurniturePlacement[];
  targetPlacementId?: string;
}
```

Width, depth, and clearance are resolved from the selected furniture specification. A placement does not contain arbitrary dimension overrides in the MVP.

When a user changes `specificationId`, the placement keeps its center point and rotation. The next space assessment determines whether it remains suitable.

## 4. Space assessment

```ts
type AssessmentStatus =
  | "suitable"
  | "trade-off"
  | "must-adjust"
  | "unavailable";

type AssessmentFindingKind =
  | "furniture-overlap"
  | "wall-overlap"
  | "outside-room"
  | "below-minimum-clearance"
  | "below-recommended-clearance";

interface AssessmentFinding {
  kind: AssessmentFindingKind;
  placementId: string;
  relatedPlacementId?: string;
  wallId?: string;
  side?: FurnitureSide;
  measuredMm?: number;
  minimumMm?: number;
  recommendedMm?: number;
}

interface SpaceAssessment {
  status: AssessmentStatus;
  findings: AssessmentFinding[];
}
```

Status precedence is deterministic:

1. Unscaled plan: `unavailable`.
2. Any physical collision or below-minimum clearance: `must-adjust`.
3. Any below-recommended clearance: `trade-off`.
4. No findings: `suitable`.

Physical collisions compare solid geometry:

- furniture footprint against furniture footprint;
- furniture footprint against walls;
- furniture footprint against room boundaries.

Directional clearance compares one placement's clearance zone against walls, room boundaries, and other furniture footprints. Clearance zones are never compared with other clearance zones.

Domain findings contain measurements and object references, not localized prose. User-facing text and repair suggestions are derived outside the assessment contract.

## 5. Candidate asset validation

Candidate floor-plan validation guarantees only that data is safe to render and assess:

- required fields and types are valid;
- coordinates are finite;
- IDs are non-empty and unique;
- references resolve;
- walls have positive length and thickness;
- opening position is within the wall;
- opening width fits within the available wall length;
- each room boundary forms a closed cycle.

Candidate furniture validation guarantees:

- definition and specification IDs are non-empty and unique;
- every definition contains at least one specification;
- dimensions are positive finite millimetres;
- all clearances are finite and non-negative;
- each side satisfies `minimum <= recommended`.

Validators do not decide whether room relationships, window placement, or circulation are sensible. Those are human visual-review concerns for the MVP.

## 6. Development asset preview

The development-only asset preview accepts candidate data, displays deterministic validation errors, renders valid candidates, and lets the maintainer copy the final class-like JSON into the codebase.

It has no database, approval workflow, automatic semantic review, or automatic repair. Machine-generated repair suggestions are limited to deterministic validation failures.

## 7. Contract enforcement & removed legacy compatibility

Now that the v2 migration is complete (#225):

- `StandardFloorPlan` / `FloorPlan` and `FurnitureCatalog` strictly require `version: 2` and reject legacy `v0` / `v1` schemas;
- `FurnitureDefinition` strictly requires predefined `specifications` and rejects legacy `defaultSize`, `allowedSizeRanges`, and `clearanceRules` fields;
- arbitrary furniture resize operations (`resizeFurnitureInstance`) and v1 catalog/definition compatibility adapters have been removed;
- recognition metadata and recognition adapters remain outside the target contract.
