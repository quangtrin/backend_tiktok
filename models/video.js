"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {as: "Creator", foreignKey: "creator_id" });
      this.hasMany(models.Like, { foreignKey: "video_id" });
      this.hasMany(models.Comment, { foreignKey: "video_id" });
    }
  }
  Video.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      song: {
        type: DataTypes.STRING,
        allowNull: true,
        underscored: true,
      },
    },
    {
      sequelize,
      modelName: "Video",
      tableName: "video",
      underscored: true,
    }
  );
  return Video;
};
