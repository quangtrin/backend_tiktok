"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VideoSaved extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsTo(models.Video, { foreignKey: "video_id" });
    }
  }
  VideoSaved.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VideoSaved",
      tableName: "video_saved",
      underscored: true,
    }
  );
  return VideoSaved;
};
