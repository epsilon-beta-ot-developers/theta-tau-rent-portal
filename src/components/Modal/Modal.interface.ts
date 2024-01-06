import { ButtonProps, ModalProps } from "react-bootstrap";
import { ReactNode } from "react";

export interface ActionButton extends Omit<ButtonProps, "children, onClick"> {
  cb?: () => boolean | void;
  text: string;
}

export default interface IModalProps extends ModalProps {
  actionButtons?: ActionButton[];
  content?: ReactNode;
  title?: string;
}
