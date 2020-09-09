import * as React from "react";
import { TElevator } from "../../api/api";
import Elevator from "./Elevator";
import * as css from "./Floor.module.scss";

type Props = {
  number: number;
  active: boolean;
  elevators: TElevator[];
  onButtonClick: () => void;
};
const Floor = ({ number, active, elevators, onButtonClick }: Props) => {
  return (
    <div className={css.floor}>
      <div className={css.buttonArea}>
        <button className={active ? css.active : ""} onClick={onButtonClick}>
          {number}
        </button>
      </div>
      {elevators.map((elevator) => (
        <div className={css.elevatorSlot} key={`elevator-${elevator.id}`}>
          {elevator.floor === number && <Elevator number={elevator.id} />}
        </div>
      ))}
    </div>
  );
};

export default Floor;
