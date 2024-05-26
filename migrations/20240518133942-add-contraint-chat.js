'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint(
        "chat",
        {
          type: "foreign key",
          name: "fk_creator_id_user_id_chat",
          fields: ["creator_id"],
          references: {
            table: "user",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        },
        transaction
      );
      await queryInterface.addConstraint(
        "chat",
        {
          type: "foreign key",
          name: "fk_receiver_id_user_id_chat",
          fields: ["receiver_id"],
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
        "chat",
        "fk_creator_id_user_id_chat",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "chat",
        "fk_receiver_id_user_id_chat",
        { transaction }
      );
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
