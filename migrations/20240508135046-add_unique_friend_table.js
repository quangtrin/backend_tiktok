"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint(
        "friend",
        {
          fields: ["user1_id", "user2_id"],
          type: "unique",
          name: "user1_id_user2_id_unique",
        },
        transaction
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        "friend",
        "user1_id_user2_id_unique",
        { transaction }
      );
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
