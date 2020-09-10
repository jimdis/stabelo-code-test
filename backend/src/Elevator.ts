import emitter, { ELEVATOR_MOVED } from "./emitter";

class Elevator {
  readonly speedSecondsPerFloor = 2;
  private _currentFloor = 1;
  private _floorQueue: number[] = [];

  constructor(readonly id: number, readonly buildingId: string) {}

  public get currentFloor() {
    return this._currentFloor;
  }

  public get floorQueue() {
    return this._floorQueue;
  }

  private get isGoingUp() {
    return this._currentFloor < this._floorQueue[0];
  }

  public calculateSecondsToReachFloor(floorNumber: number) {
    const indexOfAddedFloor = this.calculateQueueIndex(floorNumber);
    const queueCopy = [...this._floorQueue];
    queueCopy.splice(indexOfAddedFloor, 0, floorNumber);
    let previousFloor = this._currentFloor;
    let totalSeconds = 0;
    queueCopy.forEach((queuedFloor, i) => {
      if (i <= indexOfAddedFloor) {
        totalSeconds +=
          Math.abs(queuedFloor - previousFloor) * this.speedSecondsPerFloor;
        previousFloor = queuedFloor;
      }
    });
    return totalSeconds;
  }

  public callElevator(floorNumber: number) {
    if (
      this._floorQueue.includes(floorNumber) ||
      this._currentFloor === floorNumber
    ) {
      return;
    }
    const isElevatorMoving = this.floorQueue.length > 0;
    const indexOfAddedFloor = this.calculateQueueIndex(floorNumber);
    this._floorQueue.splice(indexOfAddedFloor, 0, floorNumber);
    if (!isElevatorMoving) {
      this.moveElevator();
    }
  }

  private moveElevator() {
    setTimeout(() => {
      this._currentFloor += this.isGoingUp ? 1 : -1;
      if (this._currentFloor === this._floorQueue[0]) {
        this._floorQueue.shift();
      }
      emitter.emit(ELEVATOR_MOVED, this.buildingId);
      if (this._floorQueue.length > 0) {
        this.moveElevator();
      }
    }, this.speedSecondsPerFloor * 1000);
  }

  private calculateQueueIndex(addedFloorNumber: number) {
    const turningPointFloor = this.isGoingUp
      ? Math.max(...this._floorQueue)
      : Math.min(...this._floorQueue);

    // 1. Default - set added floor at start of floorQueue
    let index = 0;

    // 2. If elevator is moving and has already passed added floor, set it at end of floorQueue
    const hasElevatorPassedFloor = this.isGoingUp
      ? addedFloorNumber < this._currentFloor
      : addedFloorNumber > this._currentFloor;
    if (hasElevatorPassedFloor) {
      index = this._floorQueue.length + 1;
    }

    // 3. Loop through floorQueue to check if added floor should go into an index within floorQueue
    for (let i = 0; i < this._floorQueue.length; i++) {
      const currentQueueFloor = this._floorQueue[i];
      const nextQueueFloor = this._floorQueue[i + 1];

      const isBeforeCurrentQueueFloor = this.isGoingUp
        ? addedFloorNumber > this._currentFloor &&
          addedFloorNumber < currentQueueFloor
        : addedFloorNumber < this._currentFloor &&
          addedFloorNumber > currentQueueFloor;

      const isBetweenQueueFloors =
        addedFloorNumber > Math.min(currentQueueFloor, nextQueueFloor) &&
        addedFloorNumber < Math.max(currentQueueFloor, nextQueueFloor);

      const isAtTurningPoint =
        currentQueueFloor === turningPointFloor &&
        (this.isGoingUp
          ? addedFloorNumber > turningPointFloor
          : addedFloorNumber < turningPointFloor);

      if (isBeforeCurrentQueueFloor) {
        index = i;
        break;
      }
      if (isBetweenQueueFloors || isAtTurningPoint) {
        index = i + 1;
        break;
      }
    }
    return index;
  }
}

export default Elevator;
