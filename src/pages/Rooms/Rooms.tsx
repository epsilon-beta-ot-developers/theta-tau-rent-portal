import Button from "react-bootstrap/Button";
import React, { ReactElement } from "react";
import Table from "react-bootstrap/Table";

import "./Rooms.scss";
import { AMENITIES_TABLE_HEADERS, ROOMS_TABLE_HEADERS } from "./constants";
import AddEditRoomForm from "./components/AddEditRoomForm/AddEditRoomForm";
import getAmenitiesData from "./constants/amenitiesData";
import getRoomsData from "./constants/roomsData";
import { useModal } from "@/providers/ModalProvider/ModalProvider";
import type IAmenity from "@/interfaces/amenity";
import type IRoom from "@/interfaces/room";
import Panel from "@/components/Panel/Panel";

const Rooms: React.FC = (): ReactElement => {
  const modal = useModal();
  const [amenities, setAmenities] = React.useState<IAmenity[]>([]);
  const [rooms, setRooms] = React.useState<IRoom[]>([]);

  const fetchAmenities = React.useCallback(() => {
    //FUTURE: Replace with getAmenities API call
    setAmenities(getAmenitiesData());
  }, []);

  const fetchRooms = React.useCallback(() => {
    //FUTURE: Replace with getRooms API call
    setRooms(getRoomsData());
  }, []);

  const handleConfirmAddAmenity = React.useCallback(() => {
    console.log("API Call: Add Amenity");
    modal.hide();
  }, []);

  const handleConfirmEditAmenity = React.useCallback((amenity: IAmenity) => {
    console.log("API Call: Edit Amenity with ID: ", amenity.id);
    modal.hide();
  }, []);

  const handleAddEditAmenity = React.useCallback(
    (amenity?: IAmenity) => {
      modal.create({
        title: `${amenity ? "Edit" : "Add"} Amenity`,
        backdrop: "static",
        content: `${amenity ? "Edit" : "Add"} Amenity Form`,
        actionButtons: [
          {
            text: "Cancel",
            variant: "secondary",
            cb: modal.hide,
          },
          {
            text: amenity ? "Save" : "Add Amenity",
            variant: "primary",
            cb: () =>
              amenity
                ? handleConfirmEditAmenity(amenity)
                : handleConfirmAddAmenity(),
          },
        ],
      });
    },
    [handleConfirmEditAmenity, modal.create, modal.hide]
  );

  const handleConfirmDeleteAmenity = React.useCallback(
    (amenityId: string) => {
      console.log("API Call: Delete Amenity with ID: ", amenityId);
      modal.hide();
    },
    [modal.hide]
  );

  const handleDeleteAmenity = React.useCallback(
    (amenityId: string) => {
      modal.create({
        title: "Delete Amenity",
        content: "Are you sure you want to delete this amenity?",
        actionButtons: [
          {
            text: "Cancel",
            variant: "secondary",
            cb: modal.hide,
          },
          {
            text: "Delete",
            variant: "danger",
            cb: () => handleConfirmDeleteAmenity(amenityId),
          },
        ],
      });
    },
    [handleConfirmDeleteAmenity, modal.create, modal.hide]
  );

  const handleConfirmAddRoom = React.useCallback(() => {
    console.log("API Call: Add Room");
    modal.hide();
  }, []);

  const handleConfirmEditRoom = React.useCallback((room: IRoom) => {
    console.log("API Call: Edit Room with ID: ", room?.id);
    modal.hide();
  }, []);

  const handleAddEditRoom = React.useCallback(
    (room?: IRoom) => {
      modal.create({
        title: `${room ? "Edit" : "Add"} Room`,
        backdrop: "static",
        content: <AddEditRoomForm room={room} />,
        actionButtons: [
          {
            text: "Cancel",
            variant: "secondary",
            cb: modal.hide,
          },
          {
            text: room ? "Save" : "Add Room",
            variant: "primary",
            cb: () =>
              room ? handleConfirmEditRoom(room) : handleConfirmAddRoom(),
          },
        ],
      });
    },
    [handleConfirmEditRoom, modal.create, modal.hide]
  );

  const handleConfirmDeleteRoom = React.useCallback(
    (roomId: string) => {
      console.log("API Call: Delete Room with ID: ", roomId);
      modal.hide();
    },
    [modal.hide]
  );

  const handleDeleteRoom = React.useCallback(
    (roomId: string) => {
      modal.create({
        title: "Delete Room",
        content: "Are you sure you want to delete this room?",
        actionButtons: [
          {
            text: "Cancel",
            variant: "secondary",
            cb: modal.hide,
          },
          {
            text: "Delete",
            variant: "danger",
            cb: () => handleConfirmDeleteRoom(roomId),
          },
        ],
      });
    },
    [handleConfirmDeleteRoom, modal.create, modal.hide]
  );

  React.useEffect(() => {
    fetchAmenities();
    fetchRooms();
  }, []);

  return (
    <div className="rooms-page">
      <Panel>
        <div className="panel-heading">
          <h1>478 W. Alexandrine - Rooms</h1>
          <Button onClick={() => handleAddEditRoom()} variant="primary">
            Add Room
          </Button>
        </div>
        <Table responsive hover className="panel-table">
          <thead>
            <tr>
              {ROOMS_TABLE_HEADERS.map((header: string) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room: IRoom) => (
              <tr key={room.id}>
                <td>{room.roomNo}</td>
                <td>{room.tenants.map((tenant) => tenant.name).join("\n")}</td>
                <td>${room.rent.slice(0, room.tenants.length).join("\n$")}</td>
                <td className="action-buttons">
                  <Button
                    onClick={() => handleAddEditRoom(room)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteRoom(room.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
      <Panel>
        <div className="panel-heading">
          <h1>Amenities</h1>
          <Button onClick={() => handleAddEditAmenity()} variant="primary">
            Add Amenity
          </Button>
        </div>
        <Table responsive hover className="panel-table">
          <thead>
            <tr>
              {AMENITIES_TABLE_HEADERS.map((header: string) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {amenities.map((amenity: IAmenity) => (
              <tr key={amenity.id}>
                <td>{amenity.name}</td>
                <td>{amenity.maxPerRoom}</td>
                <td>${amenity.cost}</td>
                <td className="action-buttons">
                  <Button
                    onClick={() => handleAddEditAmenity(amenity)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteAmenity(amenity.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    </div>
  );
};

export default Rooms;
