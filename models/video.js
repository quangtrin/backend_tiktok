const Sequelize = require("sequelize");
const db = require("../util/database");
const User = require("./user");

const Video = db.define(
  "video",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    creator_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    view_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    song: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "video",
    tableName: "video",
    underscored: true,
  }
);

module.exports = Video;
