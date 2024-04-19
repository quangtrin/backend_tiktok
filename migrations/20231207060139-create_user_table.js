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
      description: {
        type: Sequelize.TEXT,
      },
      name_id: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      birthday: {
        type: Sequelize.DATE
      },
      avatar: {
        type: Sequelize.TEXT,
        defaultValue: "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
      },
      gender: {
        type: Sequelize.STRING
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
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('user');
  },
};
