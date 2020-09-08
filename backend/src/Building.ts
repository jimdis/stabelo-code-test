import Elevator from "./Elevator";

//Todo: limit min/max floors and elevators
class Building {
  private _elevators: Elevator[] = [];

  constructor(
    readonly id: number,
    readonly floorCount: number,
    elevatorCount: number
  ) {
    for (let i = 1; i <= elevatorCount; i++) {
      this._elevators.push(new Elevator(i));
    }
  }

  public get elevators() {
    return this._elevators.map((elevator) => ({
      id: elevator.id,
      floor: elevator.currentFloor,
      queue: elevator.floorQueue,
    }));
  }

  public callElevator(floorNumber: number) {
    if (floorNumber < 1 || floorNumber > this.floorCount) {
      return;
    }
    //TODO: Some math to figure out which elevator to call
    const selectedElevator = this._elevators[0];
    selectedElevator.callElevator(floorNumber);
  }
}

export default Building;
