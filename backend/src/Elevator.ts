class Elevator {
  private _speedAsSecondsPerFloor = 2;
  private _currentFloor = 1;
  private _floorQueue: number[] = [];

  constructor(readonly id: number) {}

  public get currentFloor() {
    return this._currentFloor;
  }

  public get floorQueue() {
    return this._floorQueue;
  }

  public secondsToReachFloor(floorNumber: number) {
    const indexOfAddedFloor = this.calculateQueueIndex(floorNumber);
    let previousFloor = this._currentFloor;
    let totalSeconds = 0;
    this._floorQueue.forEach((queuedFloor, i) => {
      if (i <= indexOfAddedFloor) {
        totalSeconds +=
          Math.abs(queuedFloor - previousFloor) * this._speedAsSecondsPerFloor;
        previousFloor = queuedFloor;
      }
    });
    return totalSeconds;
  }

  public callElevator(floorNumber: number) {
    if (this._floorQueue.includes(floorNumber)) {
      return;
    }
    console.log(`called elevator ${this.id} to floor ${floorNumber}`);
    const wasIdle = this.isIdle;
    this.addFloorToQueue(floorNumber);
    console.log("queue", this._floorQueue);
    if (wasIdle) {
      this.moveElevator();
    }
  }

  private get isGoingUp() {
    return this._currentFloor < this._floorQueue[0];
  }

  private get isGoingDown() {
    return this._currentFloor > this._floorQueue[0];
  }

  private get isIdle() {
    return this._floorQueue.length === 0;
  }

  private addFloorToQueue(addedFloorNumber: number) {
    const addToIndex = this.calculateQueueIndex(addedFloorNumber);
    this._floorQueue.splice(addToIndex, 0, addedFloorNumber);
  }

  private moveElevator() {
    setTimeout(() => {
      this._currentFloor += this.isGoingUp ? 1 : -1;
      if (this._currentFloor === this._floorQueue[0]) {
        this._floorQueue.shift();
      }
      console.log(`elevator ${this.id} in now on floor ${this.currentFloor}`);
      if (!this.isIdle) {
        this.moveElevator();
      }
    }, this._speedAsSecondsPerFloor * 1000);
  }

  private calculateQueueIndex(addedFloorNumber: number) {
    const turningPoint = this.isGoingUp
      ? Math.max(...this._floorQueue)
      : Math.min(...this._floorQueue);

    // Default - set new value at beginning of floorQueue
    let index = 0;

    // If new value comes before initial value, set it at end of floorQueue
    const isBeforeInitialValue = this.isGoingUp
      ? addedFloorNumber < this._currentFloor
      : addedFloorNumber > this._currentFloor;
    if (isBeforeInitialValue) {
      index = this._floorQueue.length + 1;
    }

    // Loop through floorQueue to check if new value should go into an index in the floorQueue
    for (let i = 0; i < this._floorQueue.length; i++) {
      const currentValue = this._floorQueue[i];
      const nextValue = this._floorQueue[i + 1];

      const isBeforeCurrentValue = this.isGoingUp
        ? addedFloorNumber > this._currentFloor &&
          addedFloorNumber < currentValue
        : addedFloorNumber < this._currentFloor &&
          addedFloorNumber > currentValue;

      const isBetweenValues =
        addedFloorNumber > Math.min(currentValue, nextValue) &&
        addedFloorNumber < Math.max(currentValue, nextValue);

      const isAtTurningPoint =
        currentValue === turningPoint &&
        (this.isGoingUp
          ? addedFloorNumber > turningPoint
          : addedFloorNumber < turningPoint);

      if (isBeforeCurrentValue) {
        index = i;
        break;
      }
      if (isBetweenValues || isAtTurningPoint) {
        index = i + 1;
        break;
      }
    }
    return index;
  }
}

export default Elevator;
