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
    //TODO: Clean up code..
    let fastestTime = 1e9;
    let fastestElevatorIndex = 0;
    this._elevators.forEach((elevator, i) => {
      console.log("checking elevator", elevator.id);
      const totalTime = elevator.calculateSecondsToReachFloor(floorNumber);
      console.log("totalTime", totalTime);
      console.log("fastestTime", fastestTime);
      if (totalTime < fastestTime) {
        console.log("totalTime is fastest!");
        fastestTime = totalTime;
        fastestElevatorIndex = i;
      }
    });
    const selectedElevator = this._elevators[fastestElevatorIndex];
    selectedElevator.callElevator(floorNumber);
  }
}

export default Building;
