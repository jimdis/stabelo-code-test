import axios from "axios";
const API_URL = "http://localhost:3000";
export const SOCKET_URL = "ws://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

export type TElevator = { id: number; floor: number; queue: number[] };

export type TBuilding = {
  id: string;
  floorCount: number;
  elevators: TElevator[];
  name: string;
};

export type TNewBuildingBody = {
  floorCount?: number;
  elevatorCount?: number;
  name?: string;
};
export const createBuilding = async (body?: TNewBuildingBody) => {
  const url = "/buildings";
  const { data: building } = await api.post<TBuilding>(url, body);
  return building;
};

export const getBuilding = async (id: string) => {
  const url = `/buildings/${id}`;
  const { data: building } = await api.get<TBuilding>(url);
  return building;
};

export const callElevator = async (buildingId: string, floorNumber: number) => {
  const url = `/buildings/${buildingId}/floors/${floorNumber}`;
  const { data: building } = await api.get<TBuilding>(url);
  return building;
};

export const deleteBuilding = async (id: string) => {
  const url = `/buildings/${id}`;
  await api.delete<TBuilding>(url);
};
