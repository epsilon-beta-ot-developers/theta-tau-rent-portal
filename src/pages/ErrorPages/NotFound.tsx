import React from "react";

import "./ErrorPages.scss";

const NotFound: React.FC = () => {
  return (
    <div className="error-page">
      <h1>Uh-oh! We hit a snag...</h1>
      <p>The attempted resource could not be found.</p>
    </div>
  );
};

export default NotFound;
