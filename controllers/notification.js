const { where } = require("sequelize");
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

exports.createNotification = (req, res, next) => {
  const userId = req.user.id;
  const receiver_id = req.body.receiverId;
  const type = req.body.type;
  let content;
  switch (type) {
    case "follow":
      content = NotificationContent.follow;
      break;
    case "chat":
      content = req.body.content;
      break;
    default:
      break;
  }
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
