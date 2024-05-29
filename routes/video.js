const controllers = require("../controllers/video");
const router = require("express").Router();
const Multer = require("multer");
const { authenticateToken } = require("../middlewares/auth");
const path = require("path");

const multer = Multer({
    storage: Multer.memoryStorage(),
    preservePath: true,
    limits: {
      fieldSize: 5 * 1024 * 1024,
    },
  });

function Video(app) {
  app.use("/api/video", router);
  router.get("/", controllers.getVideos);
  router.get("/:videoId", controllers.getVideo);
  router.get("/creator/:creatorId", controllers.getVideoByCreatorId);
  router.post("/", controllers.createVideo);
  router.post("/upload", multer.single("video"), authenticateToken, controllers.uploadVideo)
  router.delete("/:videoId", authenticateToken, controllers.deleteVideo);
}

module.exports = Video;
