'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
      },
      is_image: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_induction: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chat');
  }
};