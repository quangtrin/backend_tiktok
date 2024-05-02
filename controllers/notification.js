const { where, Op } = require("sequelize");
const db = require("../models");
const { NotificationContent } = require("../util/notification");

exports.getNotificationUser = (req, res, next) => {
  const userId = req.user.id;
  db.Notification.findAll({
    include: [
      {
        model: db.User,
        attributes: {
          exclude: ["token_password", "token_session"],
        },
        as: "sender",
      },
    ],
    where: {
      receiver_id: userId,
    },
    order: [["created_at", "DESC"]],
  })
    .then((result) => {
      res.status(200).json({ notification: result });
    })
    .catch((err) => console.log(err));
};

exports.createNotificationFollow = (req, res, next) => {
  const userId = req.user.id;
  const receiver_id = req.body.receiverId;
  const type = req.body.type;
  const content = NotificationContent.follow;

  db.Notification.create({
    sender_id: userId,
    receiver_id,
    type,
    content,
  })
    .then((result) => {
      res.status(200).json({ newNotification: result });
    })
    .catch((err) => res.status(400).json({ err }));
};

exports.createNotificationComment = async (req, res, next) => {
  const userId = req.user.id;
  const commentParentId = req.body.commentParentId;
  const type = req.body.type;
  const content = NotificationContent.comment;
  const comment_id = req.body.commentId;
  const video_id = req.body.videoId;

  const queryGetCommenter = await db.Comment.findAll({
    attributes: ["commenter_id"],
    where: {
      [Op.or]: [
        { comment_parent_id: commentParentId, },
        { id: commentParentId },
      ],
      [Op.not]: [
        {commenter_id: userId}
      ]
    },
  });

  const dataArr = queryGetCommenter.map(
    (comment) => comment.dataValues.commenter_id
  );

  const listReceiverId = [...new Set(dataArr)];

  db.Notification.bulkCreate(
    listReceiverId.map((receiverId) => ({
      sender_id: userId,
      receiver_id: receiverId,
      type,
      content,
      comment_id,
      video_id,
    }))
  )
    .then((result) => {
      res.status(200).json({ newNotification: result });
    })
    .catch((err) => res.status(400).json({ err }));
};

exports.updateNotification = (req, res, next) => {
  const userId = req.user.id;
  const sender_id = req.body.sender_id;
  const type = req.body.type;
  const content = req.body.content ?? "";
  const read = req.body.read;
  const has_action = req.body.hasAction;
  db.Notification.update(
    {
      receiver_id: userId,
      sender_id,
      type,
      content,
      read,
      has_action,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  )
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => res.status(400).json({ err }));
};
