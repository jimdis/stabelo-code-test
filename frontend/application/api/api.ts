import axios from "axios";
const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

export type TElevator = { number: number; floor: number };

export type TBuilding = {
  floors: number;
  elevators: TElevator[];
};

export const getBuilding = async () => {
  const url = "/building";
  const { data: building } = await api.get<TBuilding>(url);
  return building;
};
