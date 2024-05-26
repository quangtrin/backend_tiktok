const controllers = require("../controllers/chat");
const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth");
function Chat(app) {
  app.use("/api/chat", router);
  // CRUD Routes /users
  router.get("/list", authenticateToken, controllers.getListChatUserCurrent);
  router.get(
    "/messages/:id",
    authenticateToken,
    controllers.getChatUserCurrentWithOtherUser
  );
  router.post("/add", authenticateToken, controllers.addChat);
  router.put("/update/read", authenticateToken, controllers.updateReadChat);
}

module.exports = Chat;
