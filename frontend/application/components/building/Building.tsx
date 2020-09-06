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

  const handleButtonClick = (floorNumber: number) => {
    //TODO: Call API
    console.log(`Called elevator to floor ${floorNumber}`);
    setWaitingFloors([...waitingFloors, floorNumber]);
    setTimeout(() => {
      const elevatorNumber = 1;
      if (building) {
        const newBuilding = {
          ...building,
          elevators: building.elevators.map((elevator) => {
            if (elevator.number === elevatorNumber) {
              return {
                number: elevatorNumber,
                floor: floorNumber,
              };
            } else {
              return elevator;
            }
          }),
        };
        setBuilding(newBuilding);
        setWaitingFloors(waitingFloors.filter((no) => floorNumber !== no));
      }
    }, 2000);
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
