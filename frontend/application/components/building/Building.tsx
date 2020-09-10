import * as React from "react";
import Loader from "../loader/Loader";
import useBuilding from "./useBuilding";
import NewBuildingForm from "./NewBuildingForm";
import Floor from "./Floor";
import * as css from "./Building.module.scss";

const Building = () => {
  const {
    building,
    waitingFloors,
    loading,
    error,
    createBuilding,
    callElevator,
    deleteBuilding,
  } = useBuilding();

  if (!building) {
    return loading ? (
      <Loader />
    ) : error ? (
      <p>{error}</p>
    ) : (
      <NewBuildingForm onSubmit={createBuilding} />
    );
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
    <div className={css.building}>
      <div className={css.buildingBody}>
        <div className={css.penthouse}>{building.name}</div>
        {floors.map((floor) => (
          <Floor
            key={`floor-${floor.number}`}
            number={floor.number}
            waiting={floor.waiting}
            elevators={building.elevators}
            onButtonClick={() => callElevator(floor.number)}
            queuedElevator={floor.queuedElevator}
          />
        ))}
      </div>
      <button className={css.deleteButton} onClick={deleteBuilding}>
        Delete building
      </button>
    </div>
  );
};

export default Building;
