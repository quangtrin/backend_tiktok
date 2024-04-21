"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      this.belongsTo(models.User, { as: "sender", foreignKey: "sender_id" });
      this.belongsTo(models.User, {
        as: "receiver",
        foreignKey: "receiver_id",
      });
      this.belongsTo(models.Video, { foreignKey: "video_id" });
      this.belongsTo(models.Comment, { foreignKey: "comment_id" });
    }
  }
  Notification.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      video_id: {
        type: DataTypes.INTEGER,
      },
      comment_id: {
        type: DataTypes.INTEGER,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      has_action: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "notification",
      underscored: true,
    }
  );
  return Notification;
};
