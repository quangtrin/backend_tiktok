const controllers = require("../controllers/videoSaved");
const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth");

function Like(app) {
  app.use("/api/video_saved", router);
  // CRUD Routes /users
  router.post("/", authenticateToken, controllers.saveVideo);
  router.delete("/", authenticateToken, controllers.unSaveVideo);
  router.get("/current", authenticateToken, controllers.getSavedVideosCurrent);
}

module.exports = Like;
