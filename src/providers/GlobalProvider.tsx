import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { ModalProvider } from "./ModalProvider/ModalProvider";
import { RootState, loadUser, logout } from "@/store";

export const GlobalContext = createContext<undefined>(undefined);

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const { loadUserAttempted, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (loadUserAttempted && !user) {
      dispatch(logout());
    }
  }, [dispatch, loadUserAttempted, user]);

  return (
    <GlobalContext.Provider value={undefined}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
