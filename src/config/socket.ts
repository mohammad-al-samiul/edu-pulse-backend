import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId: string) => {
      socket.join(userId);
    });
  });
};

export const emitNotification = (
  userId: string,
  payload: any,
) => {
  io.to(userId).emit("notification", payload);
};