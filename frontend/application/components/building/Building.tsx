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

  const floors = Array.from(
    Array(building.floorCount),
    (_, i) => building.floorCount - i
  );

  return (
    <div>
      {floors.map((floorNumber) => (
        <Floor
          key={`floor-${floorNumber}`}
          number={floorNumber}
          active={waitingFloors.includes(floorNumber)}
          elevators={building.elevators}
          onButtonClick={() => callElevator(floorNumber)}
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
