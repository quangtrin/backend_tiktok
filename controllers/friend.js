const db = require("../models");
const { Op } = require("sequelize");
exports.getFriendUserCurrent = (req, res, next) => {
  const userId = req.user.id;
  Promise.all([
    db.User.findAll({
      include: [
        {
          model: db.Friend,
          as: "friend2",
          attributes: [],
          where: {
            user1_id: userId,
          },
        },
      ],
      attributes: { exclude: ["token_password", "token_session"] },
    }),
    db.User.findAll({
      include: [
        {
          model: db.Friend,
          as: "friend1",
          attributes: [],
          where: {
            user2_id: userId,
          },
        },
      ],
      attributes: { exclude: ["token_password", "token_session"] },
    }),
  ])
    .then((result) => {
      res.status(200).json({ friends: result.flat() });
    })
    .catch((err) => console.log(err));
};

exports.addFriend = (req, res, next) => {
  const userId = req.user.id;
  const { friendId } = req.body;
  db.Follow.findOne({
    where: {
      follower_user_id: userId,
      followed_user_id: friendId,
    },
  }).then(async (result) => {
    if (!result)
      await db.Follow.create({
        follower_user_id: userId,
        followed_user_id: friendId,
      });
  });

  db.Follow.findOne({
    where: {
      followed_user_id: userId,
      follower_user_id: friendId,
    },
  }).then(async (result) => {
    if (!result)
      await db.Follow.create({
        followed_user_id: userId,
        follower_user_id: friendId,
      });
  });

  db.Friend.create({
    user1_id: userId,
    user2_id: friendId,
  })
    .then((result) => {
      res.status(200).json({ message: "Add friend successfully" });
    })
    .catch((err) => console.log(err));
};
