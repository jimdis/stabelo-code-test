import * as React from "react";
import { getBuilding, TBuilding } from "../../api/api";
import Floor from "./Floor";

const Building = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [building, setBuilding] = React.useState<TBuilding>();
  const handleClick = async () => {
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

  return (
    <div>
      <button onClick={handleClick}>Get bulding</button>
      {loading && <p>'Laddar...'</p>}
      {error && <p>{error}</p>}
      {building && (
        <div>
          <p>Floors:</p>
          <ul>
            {Array.from(Array(building.floors), (_, i) => (
              <li key={i + 1}>
                <Floor
                  number={i + 1}
                  onButtonClick={() =>
                    console.log(`Called elevator to floor ${i + 1}`)
                  }
                />
              </li>
            ))}
          </ul>
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
