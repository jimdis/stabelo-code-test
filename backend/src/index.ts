import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as Router from "koa-router";

const app = new Koa();
const router = new Router();

// This is just an example route
router.get("/sample", (context) => {
  context.response.body = { message: "Hello world" };
  context.response.status = 200;
});

// Add additional routes for implementation here...

//TODO: Replace with models etc
let elevators: { number: number; floor: number }[] = [];
for (let i = 1; i <= 5; i++) {
  elevators.push({
    number: i,
    floor: Math.floor(Math.random() * 20) + 1,
  });
}
router.get("/building", (context) => {
  context.response.body = { floors: 20, elevators };
  context.response.status = 200;
});

router.get("/floor/:number", (context) => {
  const floorNumber = context.params.number;
  const elevator = elevators[Math.floor(Math.random() * elevators.length)];
  const secondsPerFloor = 2;
  const eta = Math.abs(floorNumber - elevator.floor) * secondsPerFloor;
  context.response.body = { elevator, eta };
  context.response.status = 200;
});

app.use(
  bodyparser({
    enableTypes: ["json"],
  })
);
app.use(cors());

app.use(router.routes());

app.listen(3000);
