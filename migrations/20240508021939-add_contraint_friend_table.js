"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint(
        "friend",
        {
          type: "foreign key",
          name: "fk_user1_id_user_id",
          fields: ["user1_id"],
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
        "friend",
        {
          type: "foreign key",
          name: "fk_user2_id_user_id",
          fields: ["user2_id"],
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

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        "friend",
        "fk_user1_id_user_id",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "friend",
        "fk_user2_id_user_id",
        { transaction }
      );
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
