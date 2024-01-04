const db = require("../models");
const Sequelize = require("sequelize");

// CRUD Controllers
exports.getFollowedUserCurrent = (req, res, next) => {
  const userId = req.user.id;
  db.Follow.findAll({
    include: [
      {
        model: db.User,
        attributes: ["id", "user_name"],
        as: "followedUser",
      },
    ],
    where: {
      following_user_id: userId,
    },
  })
    .then((result) => {
      res.status(200).json({ followedUsers: result });
    })
    .catch((err) => console.log(err));
};

exports.getFollowingUserCurrent = (req, res, next) => {
  const userId = req.user.id;
  db.Follow.findAll({
    include: [
      {
        model: db.User,
        attributes: ["id", "user_name"],
        as: "followingUser",
      },
    ],
    where: {
      followed_user_id: userId,
    },
  })
    .then((result) => {
      res.status(200).json({ followingUsers: result });
    })
    .catch((err) => console.log(err));
};

exports.follow = (req, res, next) => {
  const userId = req.user.id;
  const userFollowId = req.params.user_id;
  db.Follow.create({
    following_user_id: userId,
    followed_user_id: userFollowId,
  })
    .then((result) => {
      res.status(200).json({
        message: "Follow succesfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Follow fail",
      });
    });
};

exports.unFollow = (req, res, next) => {
  const userId = req.user.id;
  const userFollowId = req.params.user_id;
  db.Follow.destroy({
    where: {
      followed_user_id: userFollowId,
      following_user_id: userId,
    },
  })
    .then((result) => {
      res.status(200).json({
        message: "Follow succesfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Follow fail",
      });
    });
};
