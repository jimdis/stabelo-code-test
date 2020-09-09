import * as React from "react";
import Loader from "../loader/Loader";
import useBuilding from "./useBuilding";
import Floor from "./Floor";

const Building = () => {
  const {
    building,
    waitingFloors,
    loading,
    error,
    callElevator,
  } = useBuilding();

  if (!building) {
    return loading ? <Loader /> : error ? <p>{error}</p> : null;
  }

  const floors = Array.from(Array(building.floorCount), (_, i) => {
    const number = building.floorCount - i;
    const waiting = waitingFloors.includes(number);
    const queuedElevator = building.elevators.find((el) =>
      el.queue.includes(number)
    );
    return { number, waiting, queuedElevator };
  });

  return (
    <div>
      {floors.map((floor) => (
        <Floor
          key={`floor-${floor}`}
          number={floor.number}
          waiting={floor.waiting}
          elevators={building.elevators}
          onButtonClick={() => callElevator(floor.number)}
          queuedElevator={floor.queuedElevator}
        />
      ))}
      <p>Elevators:</p>
      <ul>
        {building.elevators.map((elevator) => (
          <li key={elevator.id}>
            <div>
              Id: <strong>{elevator.id}</strong>
              <br />
              Floor: <strong>{elevator.floor}</strong>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Building;
