"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const data = [];

      for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
          if (i !== j)
            data.push({
              followed_user_id: j,
              follower_user_id: i,
              created_at: new Date(),
              updated_at: new Date(),
            });
        }
      }
      await queryInterface.bulkInsert("follow", data, transaction);
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("follow", null, transaction);
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
