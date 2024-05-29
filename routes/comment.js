const controllers = require('../controllers/comment');
const router = require('express').Router();
const {authenticateToken} = require("../middlewares/auth")
function Comment(app){
    app.use("/api/comment", router);
    router.get("/video/:videoId", controllers.getCommentByVideoId)
    router.post("/", authenticateToken, controllers.addComment)
    router.delete("/:commentId", authenticateToken, controllers.deleteComment)
}

module.exports = Comment;