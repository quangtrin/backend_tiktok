const db = require("../models");
const Sequelize = require("sequelize");

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
        as: "Creator"
      }
    ],
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
