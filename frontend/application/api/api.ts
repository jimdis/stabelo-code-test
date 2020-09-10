import axios from "axios";
import { TBuilding, TNewBuildingBody } from "../types";
const API_URL = "http://localhost:3000";
export const SOCKET_URL = "ws://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

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
  const url = `/buildings/${buildingId}/callElevator`;
  const { data: building } = await api.post<TBuilding>(url, { floorNumber });
  return building;
};

export const deleteBuilding = async (id: string) => {
  const url = `/buildings/${id}`;
  await api.delete<TBuilding>(url);
};
