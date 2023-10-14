import IRoom from "@/interfaces/room";

const getRoomsData = (): IRoom[] => [
  {
    id: "638ab56fc8da5f67d9ab8109",
    roomNo: "1",
    capacity: 2,
    rent: [315, 225],
    tenants: [
      {
        id: "638ab56fc8da5f67d9ab01",
        name: "Ben Stiller",
      },
    ],
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2021-01-01"),
  },
  {
    id: "638ab56fc8da5f67d9ab8110",
    roomNo: "2",
    capacity: 2,
    rent: [315, 225],
    tenants: [
      {
        id: "638ab56fc8da5f67d9ab02",
        name: "Channing Tatum",
      },
    ],
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2021-01-01"),
  },
  {
    id: "638ab56fc8da5f67d9ab8111",
    roomNo: "3",
    capacity: 2,
    rent: [315, 225],
    tenants: [
      {
        id: "638ab56fc8da5f67d9ab03",
        name: "Will Ferrell",
      },
      {
        id: "638ab56fc8da5f67d9ab04",
        name: "John C. Reilly",
      },
    ],
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2021-01-01"),
  },
  {
    id: "638ab56fc8da5f67d9ab8112",
    roomNo: "4",
    capacity: 2,
    rent: [315, 225],
    tenants: [
      {
        id: "638ab56fc8da5f67d9ab05",
        name: "Edward Norton",
      },
    ],
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2021-01-01"),
  },
];

export default getRoomsData;
