import axios from "axios";
const API_URL = "http://localhost:3000";
export const SOCKET_URL = "ws://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

export type TElevator = { id: number; floor: number; queue: number[] };

export type TBuilding = {
  id: number;
  floorCount: number;
  elevators: TElevator[];
};

//TODO: Dynamic ID
export const getBuilding = async () => {
  const url = "/buildings/1";
  const { data: building } = await api.get<TBuilding>(url);
  return building;
};

//TODO: Dynamic ID
export const callElevator = async (floorNumber: number) => {
  const url = `/buildings/1/floors/${floorNumber}`;
  const { data: building } = await api.get<TBuilding>(url);
  return building;
};
