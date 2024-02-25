import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";

import { ModalProvider } from "./ModalProvider/ModalProvider";
import { initialize } from "@/store";

export const GlobalContext = createContext<undefined>(undefined);

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();

  // Initialize auth state on app load
  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <GlobalContext.Provider value={undefined}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
