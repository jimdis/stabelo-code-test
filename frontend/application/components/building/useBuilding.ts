import * as React from "react";
import useWebSocket from "react-use-websocket";
import * as api from "../../api/api";

const useBuilding = () => {
  const [building, setBuilding] = React.useState<api.TBuilding>();
  const buildingId = building?.id ?? null;
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

  const updatedBuilding: api.TBuilding | null = lastJsonMessage;

  //TODO: Add back below to fetch building based on locally stored id
  // React.useEffect(() => {
  //   const loadBuilding = async () => {
  //     setLoading(true);
  //     try {
  //       const currentBuilding = await api.getBuilding();
  //       setBuilding(currentBuilding);
  //       setLoading(false);
  //     } catch (e) {
  //       setError("Något gick fel :(");
  //       setLoading(false);
  //     }
  //   };
  //   loadBuilding();
  // }, []);

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

  const createBuilding = async (formData: api.TNewBuildingBody) => {
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

  const callElevator = (floorNumber: number) => {
    // ignore click if already waiting for elevator or if elevator already is on floor
    if (
      !building ||
      building.elevators.find((el) => el.floor === floorNumber)
    ) {
      return;
    }
    setWaitingFloors([...waitingFloors, floorNumber]);
    api.callElevator(building.id, floorNumber);
  };

  const deleteBuilding = async () => {
    setLoading(true);
    try {
      if (buildingId) {
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
