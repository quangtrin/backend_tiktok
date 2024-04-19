"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      let user = [];

      for (let i = 0; i < 10; i++) {
        const password = "123456";
        const hash = await bcrypt.hash(password, 10)
        user.push({
          user_name: `quang ${i}`,
          email: `quang${i}@gmail.com`,
          token_password: hash,
          token_session: "default",
          name_id: Date.now().toString(),
          gender: Math.floor(Math.random() * 2) == 0 ? "Male" : "Female",
          is_admin: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      await queryInterface.bulkInsert("user", user, transaction);
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("user", null, transaction);
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
