'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint(
        "chat",
        {
          fields: ["created_at"],
          type: "unique",
          name: "created_at_unique",
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
        "created_at_unique",
        { transaction }
      );
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
