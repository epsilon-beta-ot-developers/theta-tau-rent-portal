import { Form } from "react-bootstrap";
import React, { ReactElement } from "react";

import "./AddEditRoomForm.scss";
import type IAddEditRoomFormProps from "./AddEditRoomForm.interface";

const AddEditRoomForm: React.FC<IAddEditRoomFormProps> = ({
  room,
}: IAddEditRoomFormProps): ReactElement => {
  const [capacity, setCapacity] = React.useState<number>(room?.capacity ?? 1);
  const [rentPrices, setRentPrices] = React.useState<number[]>(room?.rent ?? []);
  const [roomNo, setRoomNo] = React.useState<string>(room?.roomNo ?? "");

  const capacityArray = React.useMemo<number[]>(() => {
    return Array.from({ length: capacity }, (_, i) => i + 1);
  }, [capacity]);

  const handleChangeCapacity = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCapacity(+event.target.value);
    },
    []
  );

  const handleChangeRents = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newRentPrices = [...rentPrices];
      newRentPrices[index] = +event.target.value;
      setRentPrices(newRentPrices);
    },
    [rentPrices]
  );

  const handleChangeRoomNo = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRoomNo(event.target.value);
    },
    []
  );

  return (
    <Form>
      <Form.Group controlId="formRoomNumber">
        <Form.Label>Room Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter room number"
          onChange={handleChangeRoomNo}
          value={roomNo}
        />
      </Form.Group>
      <Form.Group controlId="formRoomCapacity">
        <Form.Label>Room Capacity</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter room capacity"
          min={1}
          max={20}
          onChange={handleChangeCapacity}
          value={capacity}
        />
      </Form.Group>
      {capacityArray.map((capacity) => (
        <Form.Group controlId="formRoomRent">
          <Form.Label>{`Room Rent: ${capacity} Occupant${capacity > 1 ? "s" : ""}`}</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter room rent"
            min={1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeRents(e, capacity - 1)}
            value={rentPrices[capacity - 1]}
          />
        </Form.Group>
      ))}
    </Form>
  );
};

export default AddEditRoomForm;
