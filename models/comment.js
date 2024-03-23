"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "commenter_id" });
      this.belongsTo(models.Video, { foreignKey: "video_id" });
      this.hasMany(models.Comment, { foreignKey: "comment_parent_id", as: "comment_child" })
      this.belongsTo(models.Comment, { foreignKey: "comment_parent_id", as: "comment_parent"})
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      commenter_id: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: User,
        //   key: "id",
        // },
        allowNull: false,
      },
      comment_parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      video_id: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: Video,
        //   key: "id",
        // },
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comment",
      underscored: true,
    }
  );
  return Comment;
};
