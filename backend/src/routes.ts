import * as Router from "koa-router";
import * as wsServer from "./wsServer";
import emitter, { ELEVATOR_MOVED } from "./emitter";
import Building from "./Building";

const FLOOR_COUNT_DEFAULT = 20;
const ELEVATOR_COUNT_DEFAULT = 5;

const router = new Router();

const buildings: Building[] = [];

//TODO: turn into middleware?
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
  }
};

type TBuildingPost = {
  floorCount?: number;
  elevatorCount?: number;
  name?: string;
};
router.post("/buildings", (context) => {
  console.log(context.request.body);
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
  if (!id) {
    return (context.response.status = 400);
  }
  const buildingResponse = createResponseBody(id);
  if (!buildingResponse) {
    return (context.response.status = 404);
  }
  context.response.body = buildingResponse;
  context.response.status = 200;
});

router.get("/buildings/:id/floors/:number", (context) => {
  const id = context.params.id;
  const floorNumber = parseInt(context.params.number);
  if (!id || isNaN(floorNumber)) {
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

emitter.on(ELEVATOR_MOVED, (buildingId: string) => {
  wsServer.sendMessage(buildingId, createResponseBody(buildingId));
});

export default router;
