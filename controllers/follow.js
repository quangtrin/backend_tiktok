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
        attributes: { exclude: ["token_password", "token_session"] },
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
        attributes: { exclude: ["token_password", "token_session"] },
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
        attributes: { exclude: ["token_password", "token_session"] },
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
        attributes: { exclude: ["token_password", "token_session"] },
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

exports.follow = async (req, res, next) => {
  const userId = req.user.id;
  const userFollowedId = req.params.user_id;
  try {
    await db.Follow.create({
      followed_user_id: userFollowedId,
      follower_user_id: userId,
    });
    const followers = await db.Follow.findAll({
      where: {
        followed_user_id: userId,
      },
    });
    const isFollower = followers.find((follower) => {
      return (
        follower.dataValues.follower_user_id.toString() ===
        userFollowedId.toString()
      );
    });

    if (isFollower) {
      await db.Friend.create({
        user1_id: userId,
        user2_id: userFollowedId,
      });
      await db.Chat.create({
        creator_id: userId,
        receiver_id: userFollowedId,
        is_induction: true,
      });
      res.status(201).json({
        message: "Follow and friend succesfully",
      });
      return;
    }

    res.status(200).json({
      message: "Follow succesfully",
    });
  } catch (error) {
    console.log("Follow fail");
    res.status(400).json({
      message: "Follow fail",
    });
  }
};

exports.unFollow = async (req, res, next) => {
  const userId = req.user.id;
  const userFollowedId = req.params.user_id;
  try {
    await db.Follow.destroy({
      where: {
        follower_user_id: userId,
        followed_user_id: userFollowedId,
      },
    });
    await db.Friend.destroy({
      where: {
        [Sequelize.Op.or]: [
          {
            user1_id: userId,
            user2_id: userFollowedId,
          },
          {
            user1_id: userFollowedId,
            user2_id: userId,
          },
        ],
      },
    });
    res.status(200).json({
      message: "Unfollow succesfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Follow fail",
    });
  }
};
