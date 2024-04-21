"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Follow, { as: "follower", foreignKey: "follower_user_id" });
      this.hasMany(models.Follow, { as: "followed", foreignKey: "followed_user_id" });
      this.hasMany(models.Video, {as: "Creator", foreignKey: "creator_id" });
      this.hasMany(models.Like, { foreignKey: "user_id" });
      this.hasMany(models.Comment, { foreignKey: "commenter_id" });
      this.belongsToMany(models.User, { foreignKey: "follower_user_id", through: models.Follow, as: "followed_user"})
      this.belongsToMany(models.User, { foreignKey: "followed_user_id", through: models.Follow, as: "follower_user"})
      this.belongsToMany(models.User, { foreignKey: "receiver_id", through: models.Notification, as: "sender"})
      this.belongsToMany(models.User, { foreignKey: "sender_id", through: models.Notification, as: "receiver"})
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
        allowNull: false
      },
      birthday: {
        type: DataTypes.DATE
      },
      gender: {
        type: DataTypes.STRING
      },
      avatar: {
        type: DataTypes.TEXT
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
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
