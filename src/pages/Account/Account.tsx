import { FC } from "react";

import "./Account.scss";
import Login from "./Login/login";

const Account: FC = () => {
  return (
    <div className="account-page">
      <Login />
    </div>
  );
};

export default Account;
