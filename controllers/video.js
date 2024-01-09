const db = require("../models");
const Sequelize = require("sequelize");
const { Storage } = require("@google-cloud/storage");

// CRUD Controllers

//get all users
exports.getVideos = (req, res, next) => {
  db.Video.findAll({
    include: [
      {
        model: db.Like,
        include: [{ model: db.User }],
      },
      {
        model: db.Comment,
        include: [{ model: db.User }],
      },
      {
        model: db.User,
        as: "Creator",
      },
    ],
    order: [[db.Comment, "updated_at", "DESC"]],
  })
    .then((result) => {
      res.status(200).json({ videos: result });
    })
    .catch((err) => console.log(err));
};
//get user by id
exports.getVideo = (req, res, next) => {
  const videoId = req.params.videoId;
  db.Video.findByPk(videoId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Video not found!" });
      }
      res.status(200).json({ video: result });
    })
    .catch((err) => console.log(err));
};

exports.createVideo = (req, res, next) => {
  const url = req.body.url;
  const creator_id = req.body.creator_id;
  const description = req.body.description;
  const song = req.body.song;
  db.Video.create({
    url,
    creator_id,
    description,
    song,
  })
    .then((result) => {
      console.log("Created video");
      res.status(201).json({
        message: "Video created successfully",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.uploadVideo = (req, res, next) => {
  const projectId = process.env.PROJECT_ID;
  const keyFilename = process.env.KEYFILENAME;
  const bucketName = process.env.BUCKET_NAME;
  const storage = new Storage({ projectId, keyFilename });
  const bucket = storage.bucket(bucketName);
  const { description, song } = req.body;
  const user_id = req.user.id;
  try {
    if (req.file) {
      const fileOutputName = `${Date.now()}_${req.file.originalname}`;
      const blob = bucket.file(fileOutputName);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", async (data) => {
        try {
          await blob.makePublic();
          const url = `https://storage.googleapis.com/${bucketName}/${fileOutputName}`;
          db.Video.create({
            url,
            creator_id: user_id,
            description: description || "",
            song,
          }).then((result) => {
            res.status(200).json({ message: "Success" });
          });
        } catch (error) {res.status(500).json(error)}
      });
      blobStream.end(req.file.buffer);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
