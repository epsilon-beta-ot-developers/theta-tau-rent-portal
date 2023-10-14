import React, { PropsWithChildren, createContext } from "react";

import { ModalProvider } from "./ModalProvider/ModalProvider";

export const GlobalContext = createContext<undefined>(undefined);

export const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <GlobalContext.Provider value={undefined}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => React.useContext(GlobalContext);
