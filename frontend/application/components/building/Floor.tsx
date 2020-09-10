import * as React from "react";
import { TElevator } from "../../types";
import Elevator from "./Elevator";
import Display from "./Display";
import * as css from "./Floor.module.scss";

type Props = {
  number: number;
  waiting: boolean;
  elevators: TElevator[];
  queuedElevator?: TElevator;
  onButtonClick: () => void;
};
const Floor = ({
  number,
  waiting,
  elevators,
  queuedElevator,
  onButtonClick,
}: Props) => {
  const isButtonDisabled =
    waiting || !!elevators.find((el) => el.floor === number);

  const handleClick = () => {
    if (!isButtonDisabled) {
      onButtonClick();
    }
  };

  return (
    <div className={css.floor}>
      <div className={css.buttonArea}>
        <button
          className={
            waiting ? css.active : isButtonDisabled ? css.disabled : ""
          }
          onClick={handleClick}
        >
          {number}
        </button>
      </div>
      {elevators.map((elevator) => (
        <div className={css.elevatorSlot} key={`elevator-${elevator.id}`}>
          {elevator.floor === number && <Elevator number={elevator.id} />}
        </div>
      ))}
      <div className={css.display}>
        <Display
          elevatorId={queuedElevator?.id}
          onFloor={queuedElevator?.floor}
        />
      </div>
    </div>
  );
};

export default Floor;
