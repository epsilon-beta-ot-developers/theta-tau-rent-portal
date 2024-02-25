import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Forbidden from "@/pages/ErrorPages/Forbidden";
import { logout, type RootState } from "@/store";

export interface PrivateRoutesProps {
  roles?: string[];
}

const PrivateRoute: FC<PrivateRoutesProps> = ({ roles }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    dispatch(logout());
  } else if (roles && !roles.includes(user.role)) {
    return <Forbidden />;
  } else {
    return <Outlet />;
  }
};

export default PrivateRoute;
