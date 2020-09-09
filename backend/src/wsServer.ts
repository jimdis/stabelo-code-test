import { Server } from "http";
import * as WebSocket from "ws";

const sockets: { [id: string]: WebSocket | undefined } = {};

export const createServer = (server: Server) => {
  const wss = new WebSocket.Server({ server });
  console.info("WebSocket server started...");

  wss.on("connection", (ws, req) => {
    console.log("new socket connection established");
    const id = 1;
    sockets[id] = ws;
  });
};

export const sendMessage = (socketId: string, payload: any) => {
  console.log(socketId);
  console.log(payload);
  const socket = sockets[socketId];
  console.log("socket", socket);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
};
