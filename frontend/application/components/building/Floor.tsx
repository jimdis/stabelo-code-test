import * as React from "react";
import * as css from "./Floor.module.scss";

type Props = {
  number: number;
  active: boolean;
  onButtonClick: () => void;
};
const Floor = ({ number, active, onButtonClick }: Props) => {
  return (
    <div className={css.floor}>
      <div className={css.buttonArea}>
        <button className={active ? css.active : ""} onClick={onButtonClick}>
          {number}
        </button>
      </div>
    </div>
  );
};

export default Floor;
