const db = require("../models");

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
  db.User.findByPk(userId)
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

//create user
exports.createUser = (req, res, next) => {
  const user_name = req.body.name;
  const email = req.body.email;
  const is_admin = req.body.isAdmin;
  const password = req.body.password;
  db.User.create({
    user_name,
    email,
    is_admin,
    token_password: password,
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
};

//Login user
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  db.User.findOne({
    attributes: ["user_name", "email"],
    where: {
      email: email,
      token_password: password,
    },
  })
    .then((result) => {
      console.log("Logged");
      res.status(201).json({
        data: result,
      });
    })
    .catch((err) => {
      if (err.name === "SequelizeUniqueConstraintError")
        res.status(400).json({
          message: "Not found",
        });
      console.log(err.name);
    });
};
