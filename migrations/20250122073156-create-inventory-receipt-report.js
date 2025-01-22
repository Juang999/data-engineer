'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InventoryReceiptReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entity: {
        type: Sequelize.STRING
      },
      receipt_date: {
        type: Sequelize.DATE
      },
      partnumber: {
        type: Sequelize.STRING
      },
      pt_desc1: {
        type: Sequelize.STRING
      },
      qty_receipt: {
        type: Sequelize.INTEGER
      },
      um: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      remarks: {
        type: Sequelize.STRING
      },
      receipt_code: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('InventoryReceiptReports');
  }
};