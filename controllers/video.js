const db = require("../models");
const { Storage } = require("@google-cloud/storage");
const { uploadFile, deleteFile } = require("../services/googleCloud");

// CRUD Controllers

//get all users
exports.getVideos = (req, res, next) => {
  db.Video.findAll({
    include: [
      {
        model: db.Like,
        include: [
          {
            model: db.User,
            attributes: { exclude: ["token_password", "token_session"] },
          },
        ],
      },
      {
        model: db.Comment,
        include: [
          {
            model: db.User,
            attributes: { exclude: ["token_password", "token_session"] },
          },
          {
            model: db.Comment,
            as: "comment_child",
            include: [{ model: db.User }],
          },
        ],
      },
      {
        model: db.User,
        as: "Creator",
        attributes: { exclude: ["token_password", "token_session"] },
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

exports.uploadVideo = async (req, res, next) => {
  const { description, song } = req.body;
  const user_id = req.user.id;
  try {
    if (req.file) {
      const saveVideoDB = (url) => {
        return db.Video.create({
          url,
          creator_id: user_id,
          description: description || "",
          song,
        }).then((result) => {
          res.status(200).json({ message: "Success" });
        });
      };

      try {
        await uploadFile(req.file, saveVideoDB);
      } catch (error) {
        res.status(500).send(error);
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteVideo = (req, res, next) => {
  const user_id = req.user.id;
  const videoId = req.params.videoId;
  db.Video.findByPk(videoId)
    .then(async (video) => {
      if (!video) {
        return res.status(404).json({ message: "Video not found!" });
      }
      if (user_id?.toString() === video.creator_id.toString()) {
        const fileName = video.url.split("/").pop();
        await deleteFile(fileName);
        video.destroy().then(() => {
          res.status(200).json({ message: "Video deleted!" });
        });
      } else {
        console.log("Unauthorized");
        return res.status(403).json({ message: "Unauthorized" });
      }
    })
    .catch((err) => console.log(err));
};

exports.getVideoByCreatorId = (req, res, next) => {
  const creatorId = req.params.creatorId;
  db.Video.findAll({
    include: [
      {
        model: db.Like,
        include: [
          {
            model: db.User,
            attributes: { exclude: ["token_password", "token_session"] },
          },
        ],
      },
      {
        model: db.Comment,
        include: [
          {
            model: db.User,
            attributes: { exclude: ["token_password", "token_session"] },
          },
          {
            model: db.Comment,
            as: "comment_child",
            include: [{ model: db.User }],
          },
        ],
      },
      {
        model: db.User,
        as: "Creator",
        attributes: { exclude: ["token_password", "token_session"] },
      },
    ],
    order: [[db.Comment, "updated_at", "DESC"]],
    where: {
      creator_id: creatorId,
    },
  })
    .then((result) => {
      res.status(200).json({ videos: result });
    })
    .catch((err) => console.log(err));
};
