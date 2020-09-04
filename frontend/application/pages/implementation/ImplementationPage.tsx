import * as React from "react";
import Building from "../../components/building/Building";

import * as css from "./ImplementationPage.module.scss";

class ImplementationPage extends React.Component {
  public render() {
    return (
      <>
        <h2 className={css.title}>Lägg implementationen här</h2>
        <Building />
      </>
    );
  }
}

export default ImplementationPage;
