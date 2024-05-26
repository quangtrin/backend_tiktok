"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as: "creator_chat",
        foreignKey: "creator_id",
      });
      this.belongsTo(models.User, {
        as: "receiver_chat",
        foreignKey: "receiver_id",
      });
    }
  }
  Chat.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
      },
      is_image: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_induction: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chat",
      underscored: true,
    }
  );
  return Chat;
};
