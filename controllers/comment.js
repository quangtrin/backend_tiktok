const db = require("../models");
const Sequelize = require("sequelize");

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
    .then( async (result) => {
      const newComment = await db.Comment.findOne({
        include: [{
          model: db.User
        }],
        where: {
          id: result.dataValues.id
        }
      })
      res.status(200).json({ message: "Commented", newComment: newComment.dataValues });
    })
    .catch((err) => console.log(err));
};
