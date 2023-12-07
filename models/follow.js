const Sequelize = require("sequelize");
const db = require("../util/database");
const User = require("./user");

const Follow = db.define(
  "follow",
  {
    following_user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    followed_user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    modelName: "follow",
    tableName: "follow",
    underscored: true,
  }
);

module.exports = Follow;
