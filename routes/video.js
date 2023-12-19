const controllers = require('../controllers/video');
const router = require('express').Router();

function Video(app){
    app.use("/api/video", router);
    router.get('/', controllers.getVideos);
    router.get('/:videoId', controllers.getVideo);
    router.post("/", controllers.createVideo);
}

module.exports = Video;