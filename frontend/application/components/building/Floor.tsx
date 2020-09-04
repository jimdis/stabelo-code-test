import * as React from "react";

type Props = {
  number: number;
  onButtonClick: () => void;
};
const Floor = ({ number, onButtonClick }: Props) => {
  return (
    <div>
      <p>Floor {number}</p>
      <button onClick={onButtonClick}>Call elevator</button>
    </div>
  );
};

export default Floor;
