const db = require("../models");
const Sequelize = require("sequelize");

// CRUD Controllers
exports.getFollowerUserCurrent = (req, res, next) => {
  const userId = req.user.id;
  db.User.findOne({
    include: [
      {
        model: db.User,
        as: "follower_user",
        attributes: { exclude: ["token_password", "token_session"] }
      },
    ],
    attributes: { exclude: ["token_password", "token_session"] },
    where: {
      id: userId,
    },
  })
    .then((result) => {
      res.status(200).json({ currentUser: result });
    })
    .catch((err) => console.log(err));
};

exports.getFollowingUserCurrent = (req, res, next) => {
  const userId = req.user.id;
  db.User.findOne({
    include: [
      {
        model: db.User,
        as: "followed_user",
        attributes: { exclude: ["token_password", "token_session"] }
      },
    ],
    attributes: { exclude: ["token_password", "token_session"] },
    where: {
      id: userId,
    },
  })
    .then((result) => {
      res.status(200).json({ currentUser: result });
    })
    .catch((err) => console.log(err));
};
exports.getFollowerUserByUserId = (req, res, next) => {
  const userId = req.params.userId;
  db.User.findOne({
    include: [
      {
        model: db.User,
        as: "follower_user",
        attributes: { exclude: ["token_password", "token_session"] }
      },
    ],
    attributes: { exclude: ["token_password", "token_session"] },
    where: {
      id: userId,
    },
  })
    .then((result) => {
      res.status(200).json({ followedUsers: result });
    })
    .catch((err) => console.log(err));
};
//get all following user
exports.getFollowingUserByUserId = (req, res, next) => {
  const userId = req.params.userId;
  db.User.findOne({
    include: [
      {
        model: db.User,
        as: "followed_user",
        attributes: { exclude: ["token_password", "token_session"] }
      },
    ],
    attributes: { exclude: ["token_password", "token_session"] },
    where: {
      id: userId,
    },
  })
    .then((result) => {
      res.status(200).json({ followerUsers: result });
    })
    .catch((err) => console.log(err));
};

exports.follow = (req, res, next) => {
  const userId = req.user.id;
  const userFollowedId = req.params.user_id;
  db.Follow.create({
    followed_user_id: userFollowedId,
    follower_user_id: userId,
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
  const userFollowedId = req.params.user_id;
  db.Follow.destroy({
    where: {
      follower_user_id: userId,
      followed_user_id: userFollowedId,
    },
  })
    .then((result) => {
      res.status(200).json({
        message: "Unfollow succesfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Follow fail",
      });
    });
};
