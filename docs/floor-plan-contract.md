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

### Custom rectangular room

A custom room is one independent, editable rectangle, not a standard-plan catalog entry. It keeps `FloorPlan.version: 2`, `unit: "mm"`, `meta.source: "user"`, and one room of type `other`.

- User-entered width and depth are positive integer millimetres measured between inside wall faces. Walls have a fixed thickness of 120 mm; their centerlines extend outward by 60 mm. A 3000 × 4000 mm room therefore has exactly 12 m² of usable area.
- `meta.customRoom` and the room's `customNetDimensions` hold the same `widthMm` / `depthMm`. Summary areas, room-list areas, SVG labels, principal dimensions, interior spans, and image exports all use these net dimensions. Standard plans retain their existing centerline measurement convention.
- Doors and windows remain wall-bound openings. The editor measures from the left on horizontal walls and the top on vertical walls, from the inner wall corner to the near edge of the opening. Width must be a positive integer; offset must be a non-negative integer. Openings must fit within the clear wall length and must not overlap on the same wall; touching edges are allowed.
- Form inputs retain their original text until complete numeric parsing and integer validation. Fractional or empty measurements cannot be applied; exponential notation representing an integer is interpreted by its full numeric value rather than truncated.
- Valid settings drafts preview without changing the committed plan. Apply commits the relevant form; cancel, close, backdrop dismissal, Escape, and collapsing the settings panel discard its draft. Furniture gestures and shortcuts are disabled during room editing, and modal dialogs isolate background keyboard input.
- Changing either net dimension requires confirmation and rebuilds an empty room, clearing all openings and furniture. Renaming or applying unchanged dimensions preserves the layout. No undo history is provided.

The local room library uses a separate version-1 document containing complete custom room records and the last selected plan. The optional `recentCustomRoomIds` list records custom-room visits in most-recent-first order. Older version-1 documents remain readable; when history is absent, the last selected room and reverse record order provide a deterministic fallback. Deleting the active custom room selects the most recently visited surviving room, or the default standard plan if none survives.

In-memory records are the working state. A failed read or write must not crash the workspace, overwrite unreadable stored data, or silently claim persistence. The UI shows that changes are unsaved, retains all in-memory rooms and layouts, and can retry saving the complete current library when storage recovers. Initial hydration finishes before persistence starts. Asset previews do not read or write the library. Standard-plan furniture layouts are not persisted.

The canvas always identifies dimension units as millimetres; area retains `m²`. Custom rooms do not add arbitrary furniture sizes, polygon editing, room joining, opening drag gestures, door swing configuration, cloud sync, or file backup/restore.

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

A placement scenario combines a standard plan or a custom room with user-selected furniture specifications.

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

The product UI derives its whole-layout and per-furniture verdicts from one normalized default rule list. That list combines the findings above with advisory door keep-clear / approach checks; a door advisory therefore yields `trade-off` even when the physical assessment has no findings. The displayed issue count is the number of list entries, with symmetric furniture overlaps counted once. See [the spatial-rule review](./floor-plan-space-rules-review.md) for ownership, scope, and model limitations.

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
