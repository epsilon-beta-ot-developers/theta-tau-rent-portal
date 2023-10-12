import React from 'react';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import './Rooms.scss';

const Rooms: React.FC = () => {
  const tableHeaders: string[] = ["Room #", "Occupants", "Amenities", "Monthly Rent", "Actions"];
  const tableData: string[][] = [
    ["1", "Ben Stiller", "(x1) Mini-fridge, (x1) Microwave", "$340.00"],
    ["2", "Channing Tatum", "(x1) Mini-fridge", "$330.00"],
    ["3", "Will Ferrell|John C. Reilly", "(x1) Mini-fridge|None", "$275.00|$260.00"],
    ["4", "Edward Norton", "None", "$315.00"],
  ];

  return (
    <div className="rooms-section">
      <div className="rooms-heading">
        <h1>478 W. Alexandrine - Rooms</h1>
        <Button variant="primary">Add Room</Button>
      </div>
      <Table responsive hover className="rooms-table">
        <thead>
          <tr>
            {tableHeaders.map((header: string) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row: string[]) => (
            <tr>
              {row.map((dataCell: string) => (
                <td key={dataCell}>{dataCell.replace("|", "\n")}</td>
              ))}
              <td className="action-buttons">
                <Button variant="secondary">Edit</Button>
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Rooms;
