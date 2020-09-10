import { Server } from "http";
import * as WebSocket from "ws";

//Stores each socket according to an id
const sockets: { [id: string]: WebSocket | undefined } = {};

export const createServer = (server: Server) => {
  const wss = new WebSocket.Server({ server });
  console.info("WebSocket server started...");

  wss.on("connection", (ws, req) => {
    //TODO: proper url parsing...
    const id = req.url?.substring(1);
    if (id) {
      sockets[id] = ws;
    }
  });
};

export const sendMessage = (socketId: string, payload: any) => {
  const socket = sockets[socketId];
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
};
