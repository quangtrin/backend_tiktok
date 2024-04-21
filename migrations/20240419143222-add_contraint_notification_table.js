'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try{
      await queryInterface.addConstraint(
        'notification',
        {
          type: 'foreign key',
          name: 'fk_sender_id_user_id',
          fields: ['sender_id'],
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
        'notification',
        {
          type: 'foreign key',
          name: 'fk_receiver_id_user_id',
          fields: ['receiver_id'],
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
        'notification',
        {
          type: 'foreign key',
          name: 'fk_video_id_video',
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
        'notification',
        {
          type: 'foreign key',
          name: 'fk_comment_id_comment',
          fields: ['comment_id'],
          references: {
            table: 'comment',
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
        "notification",
        "fk_receiver_id_user_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "notification",
        "fk_sender_id_user_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "notification",
        "fk_video_id_video",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "notification",
        "fk_comment_id_comment",
        { transaction }
      );
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
