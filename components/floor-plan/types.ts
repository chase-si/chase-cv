export type FloorPlanEntityType = "wall" | "room" | "opening" | "furniture" | "dimension";

export interface SelectedEntity {
  type: FloorPlanEntityType;
  id: string;
}

export type EntitySelectHandler = (entity: SelectedEntity | null) => void;
