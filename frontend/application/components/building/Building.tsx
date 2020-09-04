import * as React from "react";
import { getBuilding, TBuilding } from "../../api/api";

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
          <p>
            Floors: <strong>{building.floors}</strong>
          </p>
          <p>Elevators:</p>
          <ul>
            {building.elevators.map((elevator) => (
              <li>
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
