const Sequelize = require("sequelize");
const db = require("../util/database");
const User = require('./user');
const Video = require("./video")

const Comment = db.define(
  "comment",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    commenter_id: {
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
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "comment",
    tableName: "comment",
    underscored: true,
  }
);

module.exports = Comment;
