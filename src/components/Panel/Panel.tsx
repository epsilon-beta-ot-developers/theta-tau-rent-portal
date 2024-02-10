import { FC } from "react";

import "./Panel.scss";
import IPanelProps from "./Panel.interface";

const Panel: FC<IPanelProps> = ({ children, className, ...rest }) => {
  const panelClassNames = `panel ${className}`;

  return (
    <div {...rest} className={panelClassNames}>
      {children}
    </div>
  );
};

export default Panel;
