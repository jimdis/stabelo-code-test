export type TElevator = { id: number; floor: number; queue: number[] };

export type TBuilding = {
  id: string;
  floorCount: number;
  elevators: TElevator[];
  name: string;
};

export type TNewBuildingBody = {
  floorCount?: number;
  elevatorCount?: number;
  name?: string;
};
