const controllers = require("../controllers/friend");
const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth");
function Friend(app) {
  app.use("/api/friend", router);
  // CRUD Routes /users
  router.get(
    "/current",
    authenticateToken,
    controllers.getFriendUserCurrent
  );
}

module.exports = Friend;