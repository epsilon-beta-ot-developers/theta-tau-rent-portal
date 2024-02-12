import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { ModalProvider } from "./ModalProvider/ModalProvider";
import { initialize, logout, type RootState } from "@/store";

export const GlobalContext = createContext<undefined>(undefined);

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const { isInitialized, user } = useSelector((state: RootState) => state.auth);

  // Initialize auth state on app load
  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  // If user is not set during auth initialization, log out
  useEffect(() => {
    if (isInitialized && !user) {
      dispatch(logout());
    }
  }, [dispatch, isInitialized, user]);

  return (
    <GlobalContext.Provider value={undefined}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
