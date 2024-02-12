import React from "react";

import "./ErrorPages.scss";

const Forbidden: React.FC = () => {
  return (
    <div className="error-page">
      <h1>Uh-oh! We hit a snag...</h1>
      <p>You do not have permission to access this resource.</p>
    </div>
  );
};

export default Forbidden;
