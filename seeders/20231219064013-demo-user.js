"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
  
      let user = []
  
      for (let i = 0; i < 10; i++) {
        user.push({
          user_name: `quang ${i}`,
          email: `quang${i}@gmail.com`,
          token_password: "123456",
          token_session: "default",
          is_admin: false
        })
      }
      await queryInterface.bulkInsert("user", user, transaction);
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('user', null, transaction);
      return transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
};
