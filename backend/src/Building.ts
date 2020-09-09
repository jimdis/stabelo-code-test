import * as shortid from "shortid";
import Elevator from "./Elevator";

//Todo: limit min/max floors and elevators
class Building {
  private _elevators: Elevator[] = [];
  readonly id: string;
  name: string;

  constructor(
    readonly floorCount: number,
    elevatorCount: number,
    name?: string
  ) {
    this.id = shortid();
    this.name = name ?? `Building-${this.id}`;
    for (let i = 1; i <= elevatorCount; i++) {
      this._elevators.push(new Elevator(i, this.id));
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
    //TODO: Clean up code..
    let fastestTime = 1e9;
    let fastestElevatorIndex = 0;
    this._elevators.forEach((elevator, i) => {
      const totalTime = elevator.calculateSecondsToReachFloor(floorNumber);
      if (totalTime < fastestTime) {
        fastestTime = totalTime;
        fastestElevatorIndex = i;
      }
    });
    const selectedElevator = this._elevators[fastestElevatorIndex];
    selectedElevator.callElevator(floorNumber);
  }
}

export default Building;
