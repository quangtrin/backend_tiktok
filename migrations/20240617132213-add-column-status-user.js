"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("user", "status", {
      type: Sequelize.ENUM(["blocked", "active"]),
      defaultValue: "active",
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("user", "status");
  },
};
