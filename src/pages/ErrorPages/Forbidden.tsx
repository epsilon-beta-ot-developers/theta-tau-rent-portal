import React from "react";

import "./ErrorPages.scss";

const Forbidden: React.FC = () => {
  return (
    <div className="error-page">
      <h1>403: Forbidden</h1>;
    </div>
  );
};

export default Forbidden;
