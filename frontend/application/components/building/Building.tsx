import * as React from "react";
import { getBuilding, TBuilding } from "../../api/api";
import Floor from "./Floor";

const Building = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [building, setBuilding] = React.useState<TBuilding>();
  const [waitingFloors, setWaitingFloors] = React.useState<number[]>([]);

  React.useEffect(() => {
    const loadBuilding = async () => {
      setLoading(true);
      try {
        const currentBuilding = await getBuilding();
        setBuilding(currentBuilding);
        setLoading(false);
      } catch (e) {
        setError("Något gick fel :(");
        setLoading(false);
      }
    };
    loadBuilding();
  }, []);

  //TODO: Major refactor
  const handleButtonClick = (floorNumber: number) => {
    // ignore click if already waiting for elevator or if elevator already is on floor
    if (
      !building ||
      waitingFloors.includes(floorNumber) ||
      building.elevators.find((el) => el.floor === floorNumber)
    ) {
      return;
    }
    //TODO: Call API
    console.log(`Called elevator to floor ${floorNumber}`);
    const elevatorNumberCalled = 1;
    const initialElevatorFloor = building.elevators.find(
      (el) => el.number === elevatorNumberCalled
    )?.floor;

    setWaitingFloors([...waitingFloors, floorNumber]);
    const moveElevator = (newFloor: number) => {
      if (building) {
        const newBuilding = {
          ...building,
          elevators: building.elevators.map((elevator) => {
            if (elevator.number === elevatorNumberCalled) {
              return {
                number: elevatorNumberCalled,
                floor: newFloor,
              };
            } else {
              return elevator;
            }
          }),
        };
        setBuilding(newBuilding);
      }
      if (floorNumber !== newFloor) {
        moveElevatorOneFloor(newFloor);
      } else {
        setWaitingFloors(waitingFloors.filter((no) => floorNumber !== no));
      }
    };
    const moveElevatorOneFloor = (currentFloor: number) => {
      const nextFloor =
        currentFloor < floorNumber ? currentFloor + 1 : currentFloor - 1;
      setTimeout(() => {
        moveElevator(nextFloor);
      }, 2000);
    };
    if (initialElevatorFloor) {
      moveElevatorOneFloor(initialElevatorFloor);
    }
  };

  const floors = building
    ? Array.from(Array(building.floors), (_, i) => building.floors - i)
    : [];

  return (
    <div>
      {loading && <p>'Laddar...'</p>}
      {error && <p>{error}</p>}
      {building && (
        <div>
          {floors.map((floorNumber) => (
            <Floor
              key={`floor-${floorNumber}`}
              number={floorNumber}
              active={waitingFloors.includes(floorNumber)}
              elevators={building.elevators}
              onButtonClick={() => handleButtonClick(floorNumber)}
            />
          ))}
          <p>Elevators:</p>
          <ul>
            {building.elevators.map((elevator) => (
              <li key={elevator.number}>
                <div>
                  Number: <strong>{elevator.number}</strong>
                  <br />
                  Floor: <strong>{elevator.floor}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Building;
