import Button from "react-bootstrap/Button";
import BootstrapModal from "react-bootstrap/Modal";
import React, { ReactElement } from "react";

import type IModalProps from "./Modal.interface";

const Modal: React.FC<IModalProps> = (props: IModalProps): ReactElement => {
  const {
    actionButtons,
    children,
    content,
    title,
    ...modalProps
  }: IModalProps = props;

  return (
    <BootstrapModal {...modalProps} centered>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>{children ?? content}</BootstrapModal.Body>
      <BootstrapModal.Footer>
        {actionButtons?.map((actionButton) => {
          const { cb, text, ...buttonProps } = actionButton;
          return (
            <Button
              {...buttonProps}
              onClick={actionButton.cb}
              key={actionButton.text}
            >
              {actionButton.text}
            </Button>
          );
        })}
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default Modal;
