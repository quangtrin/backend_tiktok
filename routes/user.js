const controllers = require("../controllers/user");
const router = require("express").Router();
const { authenticateToken, authenticateTokenAdmin } = require("../middlewares/auth");
const Multer = require("multer");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});

function User(app) {
  app.use("/api/user", router);
  // CRUD Routes /users
  router.get("/", authenticateTokenAdmin, controllers.getUsers);
  router.get("/index/:userId", controllers.getUser);
  router.post("/", controllers.createUser);
  router.post("/login", controllers.login);
  router.get("/current", authenticateToken, controllers.getCurrentUser);
  router.post("/current", multer.single("avatar"), authenticateToken, controllers.updateCurrentUser)
  router.put("/:userId", authenticateTokenAdmin, controllers.updateUser);
}

module.exports = User;
