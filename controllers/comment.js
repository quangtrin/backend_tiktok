const { where } = require("sequelize");
const db = require("../models");

// CRUD Controllers
exports.addComment = (req, res, next) => {
  const userId = req.user.id;
  const { videoId, content, commentParentId } = req.body;
  db.Comment.create({
    commenter_id: userId,
    video_id: videoId,
    comment_parent_id: commentParentId || null,
    content,
  })
    .then(async (result) => {
      const newComment = await db.Comment.findOne({
        include: [
          {
            model: db.User,
          },
        ],
        where: {
          id: result.dataValues.id,
        },
      });
      res
        .status(200)
        .json({ message: "Commented", newComment: newComment.dataValues });
    })
    .catch((err) => console.log(err));
};

exports.getCommentByVideoId = (req, res, next) => {
  const { videoId } = req.params;
  db.Comment.findAll({
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
    where: { video_id: videoId },
    order: [
      ["created_at", "DESC"],
      [{ model: db.Comment, as: "comment_child" }, "created_at", "DESC"],
    ],
  })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
};
