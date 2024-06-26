const db = require("../models");
const Sequelize = require("sequelize");

// CRUD Controllers
exports.createLike = (req, res, next) => {
  const video_id = req.body.video_id;
  const user_id = req.user.id;
  db.Like.create({
    video_id,
    user_id,
  })
    .then((result) => {
      console.log("Liked");
      res.status(200).json({
        message: "Liked",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: err.name,
      });
    });
};

exports.Unlike = (req, res, next) => {
  const user_id = req.user.id;
  const video_id = req.body.video_id
  db.Like.destroy({
    where: {
      user_id,
      video_id
    },
  })
    .then((result) => {
      console.log("Unliked");
      res.status(200).json({
        message: "Unliked",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: err.name,
      });
    });
};
