'use strict';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint(
        "user",
        {
          fields: ["email"],
          type: "unique",
          name: "user_email_unique",
        },
        transaction
      );


      await queryInterface.addConstraint(
        "like",
        {
          fields: [
            "user_id",
            "video_id",
          ],
          type: "unique",
          name: "like_user_id_video_id_unique",
        },
        transaction
      );

      await queryInterface.addConstraint(
        "follow",
        {
          fields: [
            "following_user_id",
            "followed_user_id",
          ],
          type: "unique",
          name: "follow_following_user_id_followed_user_id_unique",
        },
        transaction
      );

      await queryInterface.addConstraint(
        "comment",
        {
          fields: [
            "commenter_id",
            "video_id"
          ],
          type: "unique",
          name: "comment_commenter_id_video_id_unique",
        },
        transaction
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        "user",
        "user_email_unique",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "like",
        "like_user_id_video_id_unique",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "follow",
        "follow_following_user_id_followed_user_id_unique",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "comment",
        "comment_commenter_id_video_id_unique",
        { transaction }
      );
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
