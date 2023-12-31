const controllers = require('../controllers/comment');
const router = require('express').Router();
const {authenticateToken} = require("../middlewares/auth")
function Comment(app){
    app.use("/api/comment", router);
    router.post("/", authenticateToken, controllers.addComment)
}

module.exports = Comment;