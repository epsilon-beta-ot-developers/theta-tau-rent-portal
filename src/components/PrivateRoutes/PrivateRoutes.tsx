import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Forbidden from "@/pages/ErrorPages/Forbidden";
import type { RootState } from "@/store";

export interface PrivateRoutesProps {
  roles?: string[];
}

const PrivateRoute: FC<PrivateRoutesProps> = ({ roles }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/account" />;
  } else if (roles && !roles.includes(user.role)) {
    return <Forbidden />;
  } else {
    return <Outlet />;
  }
};

export default PrivateRoute;
