import * as Router from "koa-router";
import * as wsServer from "./wsServer";
import emitter, { ELEVATOR_MOVED } from "./emitter";
import Building from "./Building";

const FLOOR_COUNT_DEFAULT = 20;
const ELEVATOR_COUNT_DEFAULT = 5;

const router = new Router();

//In-memory storage...
const buildings: Building[] = [];

//TODO: Turn into middleware?
const createResponseBody = (buildingId: string) => {
  const building = buildings.find((building) => building.id === buildingId);
  if (building) {
    const { id, floorCount, elevators, name } = building;
    return {
      id,
      floorCount,
      elevators,
      name,
    };
  } else return null;
};

type TBuildingPost = {
  floorCount?: number;
  elevatorCount?: number;
  name?: string;
};
router.post("/buildings", (context) => {
  const {
    floorCount = FLOOR_COUNT_DEFAULT,
    elevatorCount = ELEVATOR_COUNT_DEFAULT,
    name,
  } = <TBuildingPost | undefined>context.request.body ?? {};
  try {
    const building = new Building(floorCount, elevatorCount, name);
    buildings.push(building);
    context.response.body = createResponseBody(building.id);
    context.response.status = 200;
  } catch (e) {
    context.response.body = e.message ?? "Något gick fel..";
    context.response.status = 400;
  }
});

router.get("/buildings/:id", (context) => {
  const id = context.params.id;
  const buildingResponse = createResponseBody(id);
  if (!buildingResponse) {
    return (context.response.status = 404);
  }
  context.response.body = buildingResponse;
  context.response.status = 200;
});

router.post("/buildings/:id/callElevator", (context) => {
  const id = context.params.id;
  const { floorNumber } = context.request.body ?? {};
  if (!floorNumber || typeof floorNumber !== "number") {
    return (context.response.status = 400);
  }
  const building = buildings.find((building) => building.id === id);
  if (!building) {
    return (context.response.status = 404);
  }
  building.callElevator(floorNumber);
  wsServer.sendMessage(id, createResponseBody(id));
  context.response.body = createResponseBody(id);
  context.response.status = 200;
});

router.delete("/buildings/:id", (context) => {
  const id = context.params.id;
  const buildingIndex = buildings.findIndex((building) => building.id === id);
  if (buildingIndex === -1) {
    return (context.response.status = 404);
  }
  buildings.splice(buildingIndex, 1);
  context.response.status = 204;
});

emitter.on(ELEVATOR_MOVED, (buildingId: string) => {
  wsServer.sendMessage(buildingId, createResponseBody(buildingId));
});

export default router;
