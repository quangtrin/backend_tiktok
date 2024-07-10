const controllers = require("../controllers/chat");
const router = require("express").Router();
const Multer = require("multer");
const { authenticateToken } = require("../middlewares/auth");

const multer = Multer({
  storage: Multer.memoryStorage(),
  preservePath: true,
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});

function Chat(app) {
  app.use("/api/chat", router);
  // CRUD Routes /users
  router.get("/list", authenticateToken, controllers.getListChatUserCurrent);
  router.get(
    "/messages/:id",
    authenticateToken,
    controllers.getChatUserCurrentWithOtherUser
  );
  router.post(
    "/add",
    authenticateToken,
    multer.single("image"),
    controllers.addChat
  );
  router.put("/update/read", authenticateToken, controllers.updateReadChat);
}

module.exports = Chat;
