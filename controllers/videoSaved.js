const db = require("../models");

// CRUD Controllers
exports.saveVideo = (req, res, next) => {
  const video_id = req.body.videoId;
  const user_id = req.user.id;
  db.VideoSaved.create({
    video_id,
    user_id,
  })
    .then((result) => {
      console.log("Saved");
      res.status(200).json({
        message: "Saved",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: err.name,
      });
    });
};

exports.unSaveVideo = (req, res, next) => {
  const user_id = req.user.id;
  const video_id = req.body.videoId;
  db.VideoSaved.destroy({
    where: {
      user_id,
      video_id,
    },
  })
    .then((result) => {
      console.log("Unsaved");
      res.status(200).json({
        message: "Unsaved",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: err.name,
      });
    });
};

exports.getSavedVideosCurrent = (req, res, next) => {
  const user_id = req.user.id;
  db.VideoSaved.findAll({
    where: {
      user_id,
    },
    attributes: [],
    include: [
      {
        model: db.Video,
        include: [
          {
            model: db.User,
            as: "Creator",
            attributes: { exclude: ["token_password", "token_session"] },
          },
          {
            model: db.Like,
          },
          {
            model: db.Comment,
          },
        ],
      },
    ],
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: err.name,
      });
    });
};
