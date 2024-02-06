import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import Modal from "@/components/Modal/Modal";

import type IModalProps from "@/components/Modal/Modal.interface";
import type IModalContext from "./ModalProvider.interface";

export const ModalContext = createContext<IModalContext | undefined>(undefined);

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [modalProps, setModalProps] = useState<IModalProps>({} as IModalProps);
  const [showModal, setShowModal] = useState<boolean>(false);

  const create = useCallback((modalProps: IModalProps) => {
    setModalProps(modalProps);
    setShowModal(true);
  }, []);

  const hide = useCallback(() => {
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
  const context = useContext(ModalContext);
  if (context === undefined || context === null) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
