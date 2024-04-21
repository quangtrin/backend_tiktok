const controllers = require("../controllers/notification");
const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth");
function Notification(app) {
  app.use("/api/notification", router);
  // CRUD Routes /users
  router.get(
    "/user",
    authenticateToken,
    controllers.getNotificationUser
  );
  router.post(
    "/create",
    authenticateToken,
    controllers.createNotification
  )

  router.put(
    "/update",
    authenticateToken,
    controllers.updateNotification
  )
}

module.exports = Notification;
