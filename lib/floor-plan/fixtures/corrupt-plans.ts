export const UNSUPPORTED_VERSION_FLOOR_PLAN = {
  version: 999,
  unit: "mm",
  meta: {
    name: "Future Plan v999",
    source: "template",
  },
  vertices: [{ id: "v1", x: 0, y: 0 }],
  walls: [],
  openings: [],
  rooms: [],
  furniture: [],
};

export const CORRUPT_PLANS = {
  brokenJson: "INVALID_JSON_{{::not-a-valid-payload",
  nullPayload: null,
  emptyObject: {},
  missingVersion: {
    unit: "mm",
    meta: { name: "Missing Version" },
    vertices: [],
  },
  unsupportedVersionHigh: {
    version: 42,
    unit: "mm",
    vertices: [],
    walls: [],
    rooms: [],
  },
  negativeVersion: {
    version: -1,
    unit: "mm",
    vertices: [],
    walls: [],
    rooms: [],
  },
  nonArrayVertices: {
    version: 1,
    unit: "mm",
    meta: { name: "Corrupt Vertices", source: "template" },
    vertices: "not-an-array",
    walls: [],
    rooms: [],
    openings: [],
    furniture: [],
  },
  brokenVertexReference: {
    version: 1,
    unit: "mm",
    meta: { name: "Broken Vertex Ref", source: "template" },
    vertices: [{ id: "v1", x: 0, y: 0 }],
    walls: [
      {
        id: "w1",
        from: "v1",
        to: "missing-vertex-id",
        thickness: 200,
        lockAxis: "horizontal",
      },
    ],
    rooms: [],
    openings: [],
    furniture: [],
  },
  brokenOpeningPosition: {
    version: 1,
    unit: "mm",
    meta: { name: "Broken Position", source: "template" },
    vertices: [
      { id: "v1", x: 0, y: 0 },
      { id: "v2", x: 3000, y: 0 },
    ],
    walls: [
      { id: "w1", from: "v1", to: "v2", thickness: 200, lockAxis: "horizontal" },
    ],
    openings: [
      {
        id: "op1",
        type: "door",
        wallId: "w1",
        position: 2.5, // invalid ratio > 1
        width: 900,
      },
    ],
    rooms: [],
    furniture: [],
  },
};
