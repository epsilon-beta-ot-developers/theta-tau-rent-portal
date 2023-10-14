import IAmenity from "@/interfaces/amenity";

const getAmenitiesData = (): IAmenity[] => [
  {
    id: "546ab56fc8da5f67d9ab8101",
    name: "Mini Fridge",
    cost: 15,
    maxPerRoom: 1,
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2021-01-01"),
  },
  {
    id: "546ab56fc8da5f67d9ab8102",
    name: "Microwave",
    cost: 10,
    maxPerRoom: 2,
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2021-01-01"),
  },
  {
    id: "546ab56fc8da5f67d9ab8103",
    name: "Toaster",
    cost: 10,
    maxPerRoom: 2,
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2021-01-01"),
  },
];

export default getAmenitiesData;
