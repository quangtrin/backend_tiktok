const db = require("../models");
const { Op, or, where, Sequelize } = require("sequelize");
exports.getListChatUserCurrent = (req, res, next) => {
  const userId = req.user.id;
  const query = `SELECT "receiver_user".id AS user_id,
  "receiver_user".user_name,
  "receiver_user".avatar,
  "Chat".* AS chat_created_at
  FROM "user" AS "receiver_user", (
      SELECT "chat".*,
      ROW_NUMBER() OVER (
        PARTITION BY receiver_id ORDER BY "chat".created_at DESC
      ) rn FROM "chat", "user"
      WHERE "user".id = "chat".creator_id AND "user".id = ${userId}
    ) AS "Chat" WHERE rn = 1 AND receiver_id = "receiver_user".id
  UNION
   SELECT "sender_user".id AS user_id,
   "sender_user".user_name,
   "sender_user".avatar, 
   "Chat".* AS chat_created_at FROM "user" AS "sender_user", (
      SELECT "chat".*,
      ROW_NUMBER() OVER (
        PARTITION BY creator_id ORDER BY "chat".created_at DESC
      ) rn FROM "chat", "user"
      WHERE "user".id = "chat".receiver_id AND "user".id = ${userId}
    ) AS "Chat" WHERE rn = 1 AND creator_id = "sender_user".id`;
  db.sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.getChatUserCurrentWithOtherUser = (req, res, next) => {
  const userId = req.user.id;
  const otherUserId = req.params.id;
  db.Chat.findAll({
    where: {
      [Op.or]: [
        { [Op.and]: [{ creator_id: userId }, { receiver_id: otherUserId }] },
        { [Op.and]: [{ creator_id: otherUserId }, { receiver_id: userId }] },
      ],
    },
    include: [
      {
        model: db.User,
        as: "creator_chat",
        attributes: { exclude: ["token_password", "token_session"] },
      },
    ],
    order: [["created_at", "ASC"]],
  })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.addChat = (req, res, next) => {
  const userId = req.user.id;
  const { receiverId, content } = req.body;
  db.Chat.create({
    creator_id: userId,
    receiver_id: receiverId,
    content,
  })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
};

exports.updateReadChat = (req, res, next) => {
  const userId = req.user.id;
  const { creatorId } = req.body;
  db.Chat.update(
    { read: true },
    {
      where: { creator_id: creatorId, receiver_id: userId },
    }
  )
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
};
