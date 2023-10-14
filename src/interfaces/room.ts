export default interface IRoom {
  id: string;
  roomNo: string;
  capacity: number;
  rent: number[];
  tenants: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
