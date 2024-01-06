import Modal from "@/components/Modal/Modal";
import React, { PropsWithChildren, createContext } from "react";

import type IModalProps from "@/components/Modal/Modal.interface";
import type IModalContext from "./ModalProvider.interface";

export const ModalContext = createContext<IModalContext | undefined>(undefined);

export const ModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [modalProps, setModalProps] = React.useState<IModalProps>(
    {} as IModalProps,
  );
  const [showModal, setShowModal] = React.useState<boolean>(false);
  console.log("ModalProvider");

  const create = React.useCallback((modalProps: IModalProps) => {
    console.log("ModalProvider.create");
    setModalProps(modalProps);
    setShowModal(true);
  }, []);

  const hide = React.useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <ModalContext.Provider value={{ create, hide }}>
      {children}
      {showModal ? (
        <Modal
          {...modalProps}
          onHide={() => setShowModal(false)}
          show={showModal}
        />
      ) : null}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (context === undefined || context === null) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
