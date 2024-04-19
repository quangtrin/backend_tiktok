const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Storage } = require("@google-cloud/storage");
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
  const projectId = process.env.PROJECT_ID;
  const keyFilename = process.env.KEYFILENAME;
  const bucketName = process.env.BUCKET_NAME;
  const storage = new Storage({ projectId, keyFilename });
  const bucket = storage.bucket(bucketName);

  const userId = req.user.id;
  const { userName, gender, description, birthday } = req.body;
  let url;
  try {
    if (req.file) {
      const fileOutputName = `${Date.now()}_${req.file.originalname}`;
      const blob = bucket.file(fileOutputName);
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", async (data) => {
        try {
          await blob.makePublic();
          url = `https://storage.googleapis.com/${bucketName}/${fileOutputName}`;
          await db.User.update(
            {
              user_name: userName,
              gender: gender,
              description:
                description === "null" || description === "undefined"
                  ? ""
                  : description,
              birthday:
                birthday === "null" || birthday === "undefined"
                  ? null
                  : new Date(birthday),
              avatar: url || "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
            },
            {
              where: {
                id: userId,
              },
            }
          ).then((result) => {
            res.status(200).json({ message: "Success" });
          });
        } catch (error) {
          console.log(error);
          res.status(500).json(error);
        }
      });

      blobStream.end(req.file.buffer);
    } else {
      await db.User.update(
        {
          user_name: userName,
          gender: gender,
          description:
            description === "null" || description === "undefined"
              ? ""
              : description,
          birthday:
             birthday === "null" || birthday === "undefined"
              ? null
              : new Date(birthday),
        },
        {
          where: {
            id: userId,
          },
        }
      ).then((result) => {
        res.status(200).json({ message: "Success" });
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
