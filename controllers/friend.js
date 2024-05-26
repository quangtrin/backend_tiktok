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
