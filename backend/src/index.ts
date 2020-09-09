import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";
import * as http from "http";
import * as wsServer from "./wsServer";
import emitter, { ELEVATOR_MOVED } from "./emitter";
import Building from "./Building";

const app = new Koa();
const router = new Router();

// This is just an example route
router.get("/sample", (context) => {
  context.response.body = { message: "Hello world" };
  context.response.status = 200;
});

const buildings: Building[] = [];

//TODO: turn into middleware?
const createResponseBody = (buildingId: string) => {
  const building = buildings.find((building) => building.id === buildingId);
  if (building) {
    const { id, floorCount, elevators } = building;
    return {
      id,
      floorCount,
      elevators,
    };
  }
};

router.post("/buildings", (context) => {
  const { name } = context.body ?? {};
  const building = new Building(20, 5, name);
  buildings.push(building);
  context.response.body = createResponseBody(building.id);
  context.response.status = 200;
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

app.use(
  bodyparser({
    enableTypes: ["json"],
  })
);
app.use(cors());

app.use(router.routes());

const server = http.createServer(app.callback());

server.listen(3000);

wsServer.createServer(server);

emitter.on(ELEVATOR_MOVED, (buildingId: string) => {
  wsServer.sendMessage(buildingId, createResponseBody(buildingId));
});
