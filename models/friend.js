"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { as: "user1", foreignKey: "user1_id" });
      this.belongsTo(models.User, { as: "user2", foreignKey: "user2_id" });
    }
  }
  Friend.init(
    {
      user1_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user2_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Friend",
      tableName: "friend",
      underscored: true,
    }
  );
  return Friend;
};
