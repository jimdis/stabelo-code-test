import * as React from "react";
import { TNewBuildingBody } from "../../api/api";
import * as css from "./NewBuildingForm.module.scss";
type Props = {
  onSubmit: (body: TNewBuildingBody) => void;
};

const MIN_FLOOR_COUNT = 2;
const MAX_FLOOR_COUNT = 200;
const MIN_ELEVATOR_COUNT = 1;
const DEFAULT_FLOOR_COUNT = 20;
const DEFAULT_ELEVATOR_COUNT = 5;

const NewBuildingForm = ({ onSubmit }: Props) => {
  const [name, setName] = React.useState("Nakatomi Plaza");
  const [floorCount, setFloorCount] = React.useState(DEFAULT_FLOOR_COUNT);
  const [elevatorCount, setElevatorCount] = React.useState(
    DEFAULT_ELEVATOR_COUNT
  );
  const [error, setError] = React.useState("");

  const MAX_ELEVATOR_COUNT = isNaN(floorCount) ? 1 : floorCount - 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(floorCount) || isNaN(elevatorCount)) {
      setFloorCount(DEFAULT_FLOOR_COUNT);
      setElevatorCount(DEFAULT_ELEVATOR_COUNT);
      setError("Något värde var inte så bra.. Återställde standardvärden.");
      return;
    }
    setError("");
    onSubmit({ name, floorCount, elevatorCount });
  };

  return (
    <div>
      <h2>Skapa ny byggnad!</h2>
      <div className={css.newBuildingForm}>
        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          <label>
            Building name
            <input
              type="text"
              placeholder="Fancy building name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div className={css.numberInputs}>
            <div className={css.row}>
              <label>Number of floors</label>
              <input
                type="number"
                min={MIN_FLOOR_COUNT}
                max={MAX_FLOOR_COUNT}
                value={floorCount || ""}
                onChange={(e) => setFloorCount(parseInt(e.target.value))}
              />
            </div>
            <div className={css.row}>
              <label>Number of elevators</label>
              <input
                type="number"
                min={MIN_ELEVATOR_COUNT}
                max={MAX_ELEVATOR_COUNT}
                value={elevatorCount || ""}
                onChange={(e) => setElevatorCount(parseInt(e.target.value))}
              />
            </div>
          </div>
          <input type="submit" value="Skapa" />
        </form>
      </div>
    </div>
  );
};

export default NewBuildingForm;
