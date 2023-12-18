const express = require('express');
const cors = require("cors")
const bodyparser = require('body-parser');
const sequelize = require('./util/database')
const User = require('./models/user')
const { Storage } = require("@google-cloud/storage")
const Multer = require("multer")
const UserRoutes = require("./routes/users")

const app = express();
const post = 8000;

let projectId = ''
let keyfilename = ''

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5*1014*1024 // no larger 5mb
    }
});
// const storage = new Storage({
//     projectId,
//     keyFilename
// })
// const bucket = storage.bucket('') // to be defined
// app.post('/upload', multer.single(''), (req, res) => {
//     console.log("Made it /upload")
//     try{
//         if(req.file){
//             console.log("File found, trying to upload...");
//             const blob = bucket.file(req.file.originalname);
//             const blockStream = blob.createWriteStream();

//             blockStream.on("finish", () => {
//                 res.status(200).send("Success")
//             });
//             blockStream.end(req.file.buffer);
//         }
//     }catch(error){
//         res.status(500).send(error)
//     }
// })
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
        console.log("Database connected",post);
        app.listen(post)
    })
    .catch(err => console.log(err));

