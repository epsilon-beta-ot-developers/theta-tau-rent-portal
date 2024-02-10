import { FC, PropsWithChildren, createContext, useContext } from "react";

import { ModalProvider } from "./ModalProvider/ModalProvider";

export const GlobalContext = createContext<undefined>(undefined);

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <GlobalContext.Provider value={undefined}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
