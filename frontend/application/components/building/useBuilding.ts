import * as React from "react";
import useWebSocket from "react-use-websocket";
import * as api from "../../api/api";

const useBuilding = () => {
  const { lastJsonMessage, readyState } = useWebSocket(api.SOCKET_URL);
  const [building, setBuilding] = React.useState<api.TBuilding>();
  const [waitingFloors, setWaitingFloors] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const newBuilding: api.TBuilding | null = lastJsonMessage;

  React.useEffect(() => {
    const loadBuilding = async () => {
      setLoading(true);
      try {
        const currentBuilding = await api.getBuilding();
        setBuilding(currentBuilding);
        setLoading(false);
      } catch (e) {
        setError("Något gick fel :(");
        setLoading(false);
      }
    };
    loadBuilding();
  }, []);

  React.useEffect(() => {
    if (newBuilding) {
      setBuilding(newBuilding);
      setWaitingFloors(newBuilding.elevators.flatMap((el) => el.queue));
    }
  }, [newBuilding]);

  React.useEffect(() => {
    //TODO: Revert to fetching building manually if readystate changes to 0 for more than x seconds..
    console.log(`Websocket ReadyState changed to ${readyState}`);
  }, [readyState]);

  const callElevator = (floorNumber: number) => {
    // ignore click if already waiting for elevator or if elevator already is on floor
    if (
      !building ||
      building.elevators.find((el) => el.floor === floorNumber)
    ) {
      return;
    }
    setWaitingFloors([...waitingFloors, floorNumber]);
    api.callElevator(floorNumber);
  };

  return { building, waitingFloors, callElevator, loading, error };
};

export default useBuilding;
