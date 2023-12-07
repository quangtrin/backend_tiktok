'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try{
      await queryInterface.addConstraint(
        'follow',
        {
          type: 'foreign key',
          name: 'fk_follow_user_following_user_id',
          fields: ['following_user_id'],
          references: {
            table: 'user',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        transaction
      )

      await queryInterface.addConstraint(
        'follow',
        {
          type: 'foreign key',
          fields: ['followed_user_id'],
          name: 'fk_follow_user_followed_user_id',
          references: {
            table: 'user',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        transaction
      )

      await queryInterface.addConstraint(
        'comment',
        {
          type: 'foreign key',
          fields: ['commenter_id'],
          name: 'fk_comment_user_commenter_id',
          references: {
            table: 'user',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        transaction
      )

      await queryInterface.addConstraint(
        'comment',
        {
          type: 'foreign key',
          name: 'fk_commnet_video_video_id',
          fields: ['video_id'],
          references: {
            table: 'video',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        transaction
      )

      await queryInterface.addConstraint(
        'video',
        {
          type: 'foreign key',
          name: 'fk_video_user_creator_id',
          fields: ['creator_id'],
          references: {
            table: 'user',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        transaction
      )

      await queryInterface.addConstraint(
        'like',
        {
          type: 'foreign key',
          name: 'fk_like_user_user_id',
          fields: ['user_id'],
          references: {
            table: 'user',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        transaction
      )

      await queryInterface.addConstraint(
        'like',
        {
          type: 'foreign key',
          name: 'fk_like_video_video_id',
          fields: ['video_id'],
          references: {
            table: 'video',
            field: 'id'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        transaction
      )
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        "follow",
        "fk_follow_user_following_user_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "follow",
        "fk_follow_user_followed_user_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "comment",
        "fk_comment_user_commenter_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "comment",
        "fk_commnet_video_video_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "video",
        "fk_video_user_creator_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "like",
        "fk_like_user_user_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "like",
        "fk_like_video_video_id",
        { transaction }
      );
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
