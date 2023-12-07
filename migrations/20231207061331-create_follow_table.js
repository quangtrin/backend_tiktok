'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("follow", {
      following_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      followed_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      create_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      update_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('follow');
  }
};
