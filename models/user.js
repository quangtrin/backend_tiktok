const Sequelize = require("sequelize");
const db = require("../util/database");

const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    token_password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    token_session: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    modelName: "user",
    tableName: "user",
    underscored: true,
  }
);

module.exports = User;
