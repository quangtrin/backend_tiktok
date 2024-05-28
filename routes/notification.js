const controllers = require("../controllers/notification");
const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth");
function Notification(app) {
  app.use("/api/notification", router);
  // CRUD Routes /users
  router.get("/user", authenticateToken, controllers.getNotificationUser);
  router.post(
    "/create/follow",
    authenticateToken,
    controllers.createNotificationFollow
  );

  router.post(
    "/create/requestFriend",
    authenticateToken,
    controllers.createNotificationRequestFriend
  );

  router.post(
    "/create/comment",
    authenticateToken,
    controllers.createNotificationComment
  );

  router.post(
    "/create/likeVideo",
    authenticateToken,
    controllers.createNotificationLikeVideo
  );

  router.post(
    "/create/acceptFriend",
    authenticateToken,
    controllers.createNotificationAcceptFriend
  );

  router.put("/update", authenticateToken, controllers.updateNotification);
}

module.exports = Notification;
