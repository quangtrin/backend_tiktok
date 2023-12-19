const controllers = require('../controllers/user');
const router = require('express').Router();

function User(app){
    app.use("/api/user", router);
    // CRUD Routes /users
    router.get('/', controllers.getUsers);
    router.get('/:userId', controllers.getUser);
    router.get("/followedUser/:userId", controllers.getFollowedUserByUserId);
    router.post('/', controllers.createUser);  
    router.post("/login", controllers.login)
}

module.exports = User;