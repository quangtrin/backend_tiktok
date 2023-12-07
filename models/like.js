const Sequelize = require("sequelize");
const db = require("../util/database");
const User = require("./user");
const Video = require("./video");

const Like = db.define(
  "like",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    video_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Video,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    modelName: "like",
    tableName: "like",
    underscored: true,
  }
);

module.exports = Like;
