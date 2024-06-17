const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadFile, deleteFile } = require("../services/googleCloud");
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
      name_id: Date.now(),
      token_session: "default",
    })
      .then((result) => {
        console.log("Created User");
        res.status(200).json({
          message: "User created successfully",
        });
      })
      .catch((err) => {
        console.log(err);
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
          const token = jwt.sign({ user }, process.env.PRIVATE_KEY);
          res.status(201).json({
            token,
            user: {
              ...user.dataValues,
              token_password: "********",
              token_session: "********",
            },
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
};

// get current user
exports.getCurrentUser = (req, res, next) => {
  const userId = req.user.id;
  db.User.findOne({
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

// update current user
exports.updateCurrentUser = async (req, res, next) => {
  const userId = req.user.id;
  const { userName, gender, description, birthday } = req.body;
  try {
    const user = await db.User.findOne({
      where: {
        id: userId,
      },
    });

    const saveUser = async (url) => {
      user.user_name = userName ?? user.user_name;
      user.gender = gender ?? user.gender;
      user.description = description ?? user.description;
      user.birthday = birthday ?? user.birthday;
      if (url) {
        const fileName = user.avatar.split("/").pop();
        await deleteFile(fileName);
        user.avatar = url ?? user.avatar;
      }
      await user.save().then((result) => {
        res.status(200).json({ user: result });
      });
    };

    if (req.file) {
      await uploadFile(req.file, saveUser);
    } else {
      saveUser();
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
