"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "following_user_id" });
      this.belongsTo(models.User, { foreignKey: "followed_user_id" });
    }
  }
  Follow.init(
    {
      following_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followed_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Follow",
      tableName: "follow",
      underscored: true,
    }
  );
  Follow.removeAttribute("id");
  return Follow;
};
