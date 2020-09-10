import * as React from "react";
import useWebSocket from "react-use-websocket";
import { TBuilding, TNewBuildingBody } from "../../types";
import * as api from "../../api/api";

const STORAGE_KEY = "buildingId";

const useBuilding = () => {
  const [building, setBuilding] = React.useState<TBuilding>();
  const buildingId = building?.id;
  const getSocketUrl = React.useCallback(() => {
    return new Promise<string>((resolve) => {
      if (buildingId) {
        resolve(api.SOCKET_URL + "/" + buildingId);
      }
    });
  }, [buildingId]);
  const { lastJsonMessage, readyState } = useWebSocket(getSocketUrl);
  const [waitingFloors, setWaitingFloors] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const updatedBuilding: TBuilding | null = lastJsonMessage;

  React.useEffect(() => {
    if (buildingId) {
      sessionStorage.setItem(STORAGE_KEY, buildingId);
    }
  }, [buildingId]);

  //TODO: Add back below to fetch building based on locally stored id
  React.useEffect(() => {
    const loadBuilding = async (id: string) => {
      setLoading(true);
      try {
        const currentBuilding = await api.getBuilding(id);
        setBuilding(currentBuilding);
        setLoading(false);
      } catch (e) {
        setBuilding(undefined);
        setLoading(false);
      }
    };
    const storedId = sessionStorage.getItem(STORAGE_KEY);
    console.log(storedId);
    if (storedId) {
      loadBuilding(storedId);
    }
  }, []);

  React.useEffect(() => {
    console.log("got message!", updatedBuilding);
    if (updatedBuilding) {
      setBuilding(updatedBuilding);
      setWaitingFloors(updatedBuilding.elevators.flatMap((el) => el.queue));
    }
  }, [updatedBuilding]);

  React.useEffect(() => {
    //TODO: Revert to fetching building manually if readystate changes to 0 for more than x seconds.. Or try reconnecting..
    console.log(`Websocket ReadyState changed to ${readyState}`);
  }, [readyState]);

  const createBuilding = async (formData: TNewBuildingBody) => {
    setLoading(true);
    try {
      const createdBuilding = await api.createBuilding(formData);
      setBuilding(createdBuilding);
      setLoading(false);
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      }
      setError("Något gick fel :(");
      setLoading(false);
    }
  };

  const callElevator = async (floorNumber: number) => {
    if (building) {
      setWaitingFloors([...waitingFloors, floorNumber]);
      try {
        await api.callElevator(building.id, floorNumber);
      } catch (e) {
        if (e.response) {
          console.error(e.response);
          setError("Något gick fel :(");
        }
        setError("Något gick fel :(");
      }
    }
  };

  const deleteBuilding = async () => {
    setLoading(true);
    try {
      if (buildingId) {
        sessionStorage.removeItem(STORAGE_KEY);
        await api.deleteBuilding(buildingId);
        setBuilding(undefined);
        setLoading(false);
      }
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      }
      setError("Något gick fel :(");
      setLoading(false);
    }
  };

  return {
    building,
    waitingFloors,
    loading,
    error,
    createBuilding,
    callElevator,
    deleteBuilding,
  };
};

export default useBuilding;
