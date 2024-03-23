const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { Sequelize } from "../models";
const SaltRounds = 10;
// CRUD Controllers

//get all users
exports.getUsers = (req, res, next) => {
  db.User.findAll()
    .then((users) => {
      res.status(200).json({ users: users });
    })
    .catch((err) => console.log(err));
};
//get user by id
exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  db.User.findByPk(userId, {
    attributes: {
      exclude: ["token_password", "token_session"],
    },
    // include: [
    //   {
    //     model: db.Follow,
    //     as: "follower",
    //     attributes: [
    //       [
    //         Sequelize.fn("COUNT", Sequelize.col("follower.follower_user_id")),
    //         "followerCount",
    //       ],
    //     ],
    //   },
    //   {
    //     model: db.Follow,
    //     as: "followed",
    //     attributes: [
    //       [
    //         Sequelize.fn("COUNT", Sequelize.col("followed.followed_user_id")),
    //         "followedCount",
    //       ],
    //     ],
    //   },
    // ],
    // group: ["User.id", "follower.follower_user_id", "followed.followed_user_id"],
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json({ user: user });
    })
    .catch((err) => console.log(err));
};

//get all followed user
exports.getFollowedUserByUserId = (req, res, next) => {
  const userId = req.params.userId;
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
//get all following user
exports.getFollowingUserByUserId = (req, res, next) => {
  const userId = req.params.userId;
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

//create user
exports.createUser = (req, res, next) => {
  const user_name = req.body.name;
  const email = req.body.email;
  const is_admin = req.body.isAdmin;
  const password = req.body.password;
  bcrypt.hash(password, SaltRounds).then(function (hash) {
    db.User.create({
      user_name,
      email,
      is_admin,
      token_password: hash,
      token_session: "default",
    })
      .then((result) => {
        console.log("Created User");
        res.status(201).json({
          message: "User created successfully",
        });
      })
      .catch((err) => {
        if (err.name === "SequelizeUniqueConstraintError")
          res.status(400).json({
            message: "Email existed",
          });
      });
  });
};

//Login user
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await db.User.findOne({
      where: {
        email: email,
      },
    });
    bcrypt
      .compare(password, user.dataValues.token_password)
      .then(function (result) {
        if (result) {
          console.log("Logged");
          const token = jwt.sign({ user }, process.env.PRIVATE_KEY);
          res.status(201).json({
            token,
            userId: user.id,
          });
        } else {
          res.status(202).json({
            message: "Not found",
          });
        }
      });
  } catch (error) {
    res.status(400).json({
      message: error.name,
    });
  }

  // .then((result) => {
  //   bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
  //     // result == true
  // });
  //   console.log("Logged");
  //   res.status(201).json({
  //     data: result,
  //   });
  // })
  // .catch((err) => {
  //   if (err.name === "SequelizeUniqueConstraintError")
  //     res.status(400).json({
  //       message: "Not found",
  //     });
  //   console.log(err.name);
  // });
};
