import * as React from "react";
import * as css from "./Display.module.scss";

type Props = {
  elevatorId?: number;
  onFloor?: number;
};

const Display = ({ elevatorId, onFloor }: Props) => (
  <div className={css.display}>
    <div className={css.row}>E: {elevatorId}</div>
    <div className={css.row}>F: {onFloor}</div>
  </div>
);

export default Display;
