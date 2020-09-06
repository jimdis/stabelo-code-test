import * as React from "react";
import * as css from "./Elevator.module.scss";

type Props = {
  number: number;
};
const Elevator = ({ number }: Props) => {
  return <div className={css.elevator}></div>;
};

export default Elevator;
