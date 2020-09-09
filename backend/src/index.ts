import * as cors from "kcors";
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as http from "http";
import * as wsServer from "./wsServer";
import router from "./routes";

const app = new Koa();

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
