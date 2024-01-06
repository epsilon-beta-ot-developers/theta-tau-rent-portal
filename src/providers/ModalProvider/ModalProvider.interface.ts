import IModalProps from "@/components/Modal/Modal.interface";

export default interface IModalContext {
  create: (props: IModalProps) => void;
  hide: () => void;
}
