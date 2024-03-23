const controllers = require("../controllers/follow");
const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth");
function Follow(app) {
  app.use("/api/follow", router);
  // CRUD Routes /users
  router.get(
    "/follower/current",
    authenticateToken,
    controllers.getFollowerUserCurrent
  );
  router.get(
    "/following/current",
    authenticateToken,
    controllers.getFollowingUserCurrent
  );
  router.get("/follower/:userId", controllers.getFollowerUserByUserId);
  router.get("/following/:userId", controllers.getFollowingUserByUserId);
  router.post("/:user_id", authenticateToken, controllers.follow);
  router.delete("/:user_id", authenticateToken, controllers.unFollow);
}

module.exports = Follow;
