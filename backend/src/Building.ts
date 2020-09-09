import * as shortid from "shortid";
import Elevator from "./Elevator";

//Todo: limit min/max floors and elevators
class Building {
  readonly id: string;
  private _elevators: Elevator[] = [];
  name: string;

  constructor(
    readonly floorCount: number,
    elevatorCount: number,
    name?: string
  ) {
    if (floorCount < 2 || elevatorCount > 20 || elevatorCount >= floorCount) {
      throw new Error(
        "floorCount must be >2 and elevatorCount less than floorCount and less than 20"
      );
    }
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
