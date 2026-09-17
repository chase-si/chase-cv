export type FloorPlanEntityType = "wall" | "room" | "opening" | "furniture";

export interface SelectedEntity {
  type: FloorPlanEntityType;
  id: string;
}

export type EntitySelectHandler = (entity: SelectedEntity | null) => void;
