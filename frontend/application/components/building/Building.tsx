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

  return (
    <div>
      {loading && <p>'Laddar...'</p>}
      {error && <p>{error}</p>}
      {building && (
        <div>
          {Array.from(Array(building.floors), (_, i) => (
            <Floor
              key={`floor-${i + 1}`}
              number={i + 1}
              active={waitingFloors.includes(i + 1)}
              onButtonClick={() => {
                console.log(`Called elevator to floor ${i + 1}`);
                setWaitingFloors((waitingFloors: number[]) => [
                  ...waitingFloors,
                  i + 1,
                ]);
              }}
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
