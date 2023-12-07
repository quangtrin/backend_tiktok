"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("user", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      token_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token_session: {
        type: Sequelize.STRING,
        allowNull: true,
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

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('user');
  },
};
