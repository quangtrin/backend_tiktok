const controllers = require('../controllers/follow');
const router = require('express').Router();
const {authenticateToken} = require("../middlewares/auth")
function Like(app){
    app.use("/api/follow", router);
    // CRUD Routes /users
    router.get('/followed', authenticateToken, controllers.getFollowedUserCurrent);  
    router.get("/following", authenticateToken, controllers.getFollowingUserCurrent)
    router.post("/:user_id", authenticateToken, controllers.follow)
    router.delete("/:user_id", authenticateToken, controllers.unFollow)
}

module.exports = Like;