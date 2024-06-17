"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Follow, {
        as: "follower",
        foreignKey: "follower_user_id",
      });
      this.hasMany(models.Follow, {
        as: "followed",
        foreignKey: "followed_user_id",
      });
      this.hasMany(models.Video, { as: "Creator", foreignKey: "creator_id" });
      this.hasMany(models.Like, { foreignKey: "user_id" });
      this.hasMany(models.VideoSaved, { foreignKey: "user_id" });
      this.hasMany(models.Comment, { foreignKey: "commenter_id" });
      this.hasMany(models.Notification, {
        as: "Receiver",
        foreignKey: "receiver_id",
      });
      this.hasMany(models.Notification, {
        as: "Sender",
        foreignKey: "sender_id",
      });
      this.hasMany(models.Friend, { as: "friend1", foreignKey: "user1_id" });
      this.hasMany(models.Friend, { as: "friend2", foreignKey: "user2_id" });
      this.hasMany(models.Chat, {
        as: "creator_chat",
        foreignKey: "creator_id",
      });
      this.hasMany(models.Chat, {
        as: "receiver_chat",
        foreignKey: "receiver_id",
      });
      this.belongsToMany(models.User, {
        foreignKey: "follower_user_id",
        through: models.Follow,
        as: "followed_user",
      });
      this.belongsToMany(models.User, {
        foreignKey: "followed_user_id",
        through: models.Follow,
        as: "follower_user",
      });
      this.belongsToMany(models.User, {
        foreignKey: "receiver_id",
        through: models.Notification,
        as: "sender",
      });
      this.belongsToMany(models.User, {
        foreignKey: "sender_id",
        through: models.Notification,
        as: "receiver",
      });
      this.belongsToMany(models.User, {
        foreignKey: "user1_id",
        through: models.Friend,
        as: "user2",
      });
      this.belongsToMany(models.User, {
        foreignKey: "user2_id",
        through: models.Friend,
        as: "user1",
      });
      this.belongsToMany(models.User, {
        foreignKey: "creator_id",
        through: models.Chat,
        as: "receiver_chat_user",
      });
      this.belongsToMany(models.User, {
        foreignKey: "receiver_id",
        through: models.Chat,
        as: "creator_chat_user",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      name_id: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATE,
      },
      gender: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.TEXT,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(["blocked", "active"]),
        defaultValue: "active",
        allowNull: false,
      },
      token_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token_session: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
      underscored: true,
    }
  );
  return User;
};
