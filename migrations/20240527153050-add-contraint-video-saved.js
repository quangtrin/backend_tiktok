'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint(
        "video_saved",
        {
          type: "foreign key",
          name: "fk_video_id_video_video_saved",
          fields: ["video_id"],
          references: {
            table: "video",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        },
        transaction
      );
      await queryInterface.addConstraint(
        "video_saved",
        {
          type: "foreign key",
          name: "fk_user_id_user_video_saved",
          fields: ["user_id"],
          references: {
            table: "user",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        },
        transaction
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        "video_saved",
        "fk_video_id_video_video_saved",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "video_saved",
        "fk_user_id_user_video_saved",
        { transaction }
      );
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
