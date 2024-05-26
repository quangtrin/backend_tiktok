const express = require('express');
const cors = require("cors")
const bodyparser = require('body-parser');
const sequelize = require('./util/database')
require('dotenv').config();
const UserRoutes = require("./routes/user")
const VideoRoutes = require("./routes/video")
const LikeRoutes = require("./routes/like")
const FollowRoutes = require("./routes/follow")
const CommentRoutes = require("./routes/comment");
const NotificationRoutes = require("./routes/notification")
const FriendRoutes = require("./routes/friend")
const ChatRoutes = require("./routes/chat")
const { connectSocket } = require('./socket/socket');

const app = express();
app.use(cors())
const port = 8000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
})

//test route
app.get('/', (req, res, next) => {
    res.send('Hello World 2');
})
//CRUD routes
// app.use('/users', require('./routes/users'));
UserRoutes(app);
VideoRoutes(app)
LikeRoutes(app)
FollowRoutes(app)
CommentRoutes(app)
NotificationRoutes(app)
FriendRoutes(app)
ChatRoutes(app)
//error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message
    res.status(status).json({ message: message })
})
//sync database
sequelize
    .authenticate()
    .then(result => {
        console.log("Database connected",port);
        const server = app.listen(port)
        connectSocket(server)
    })
    .catch(err => console.log(err));

