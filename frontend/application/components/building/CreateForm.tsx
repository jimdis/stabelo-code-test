import * as React from "react";

type Props = {
  onSubmit: () => void;
};

const CreateForm = ({ onSubmit }: Props) => (
  <div>
    <h2>Skapa ny byggnad!</h2>
    <div>
      <button onClick={onSubmit}>Skapa!</button>
    </div>
  </div>
);

export default CreateForm;
