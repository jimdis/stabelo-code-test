import * as React from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import * as api from "../../api/api";

const useBuilding = () => {
  const { lastJsonMessage, readyState } = useWebSocket(api.SOCKET_URL);
  const [building, setBuilding] = React.useState<api.TBuilding>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

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
    setBuilding(lastJsonMessage);
  }, [lastJsonMessage]);

  React.useEffect(() => {
    console.log(`ReadyState changed to ${readyState}`);
  }, [readyState]);

  const callElevator = (floorNumber: number) => {
    // ignore click if already waiting for elevator or if elevator already is on floor
    if (
      !building ||
      building.elevators.find((el) => el.floor === floorNumber)
    ) {
      return;
    }
    console.log(`Called elevator to floor ${floorNumber}`);
    api.callElevator(floorNumber);
  };

  return { building, callElevator, loading, error };
};

export default useBuilding;
