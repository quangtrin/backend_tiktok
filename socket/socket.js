const socket = require("socket.io");
const { NotificationContent } = require("../util/notification");

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
      onlineUsers.push({ information: user, socketId: socket.id });
    });

    socket.on("new-notification", ({ notification }) => {
      onlineUsers
        .filter((user) => user.information.id === notification.receiver_id)
        .forEach((followed) => {
          socket
            .to(followed.socketId)
            .emit("send-notification", { notification });
        });
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("Someone disconnected");
    });
  });
};
