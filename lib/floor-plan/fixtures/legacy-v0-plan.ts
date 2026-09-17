import type { FloorPlanV0 } from "../types";

export const LEGACY_V0_FLOOR_PLAN: FloorPlanV0 = {
  version: 0,
  unit: "m",
  meta: {
    name: "Legacy-2BR-Standard",
    source: "template",
  },
  vertices: [
    { id: "v1", x: 0, y: 0 },
    { id: "v2", x: 4, y: 0 },
    { id: "v3", x: 4, y: 4 },
    { id: "v4", x: 0, y: 4 },
  ],
  walls: [
    { id: "w1", from: "v1", to: "v2", thickness: 0.2, lockAxis: "horizontal" },
    { id: "w2", from: "v2", to: "v3", thickness: 0.2, lockAxis: "vertical" },
    { id: "w3", from: "v3", to: "v4", thickness: 0.2, lockAxis: "horizontal" },
    { id: "w4", from: "v4", to: "v1", thickness: 0.2, lockAxis: "vertical" },
  ],
  openings: [
    {
      id: "win1",
      type: "window",
      wallId: "w1",
      position: 0.5,
      width: 1.5,
      height: 1.4,
    },
    {
      id: "door1",
      type: "door",
      wallId: "w4",
      position: 0.25,
      width: 0.9,
      height: 2.1,
    },
  ],
  rooms: [
    {
      id: "r1",
      type: "bedroom",
      name: "Main Room",
      wallIds: ["w1", "w2", "w3", "w4"],
    },
  ],
  furniture: [
    {
      id: "f1",
      definitionId: "bed-double",
      x: 1.2,
      y: 1.0,
      width: 1.8,
      depth: 2.0,
      rotation: 0,
    },
  ],
};
