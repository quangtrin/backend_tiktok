const socket = require("socket.io");

global.onlineUsers = [];

exports.connectSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Someone connected");

    socket.on("add-user", (user) => {
      !onlineUsers.some(
        (onlineUser) =>
          onlineUser.information.id === user.id &&
          onlineUser.socketId === socket.id
      ) && onlineUsers.push({ information: user, socketId: socket.id });
    });

    socket.on("new-notification", async ({ notification }) => {
      onlineUsers
        .filter((user) => user.information.id === notification.receiver_id)
        .forEach(async (receiver) => {
          socket
            .to(receiver.socketId)
            .emit("send-notification", { notification });
        });
    });

    socket.on("new-message", async ({ message }) => {
      onlineUsers
        .filter((user) => user.information.id === message.receiver_id)
        .forEach(async (receiver) => {
          socket.to(receiver.socketId).emit("send-message", { message });
        });
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("Someone disconnected");
    });
  });
};
