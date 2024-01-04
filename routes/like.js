const controllers = require("../controllers/like");
const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth");

function Like(app) {
  app.use("/api/like", router);
  // CRUD Routes /users
  router.post("/", authenticateToken, controllers.createLike);
  router.delete("/", authenticateToken, controllers.Unlike);
}

module.exports = Like;
