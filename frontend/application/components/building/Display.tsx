import * as React from "react";
import * as css from "./Display.module.scss";

type Props = {
  elevatorId?: number;
  onFloor?: number;
};

const Display = ({ elevatorId, onFloor }: Props) => (
  <div className={css.display}>
    <div className={css.row}>
      E: <span className={css.rowText}>{elevatorId}</span>
    </div>
    <div className={css.row}>
      F: <span className={css.rowText}>{onFloor}</span>
    </div>
  </div>
);

export default Display;
