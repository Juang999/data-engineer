'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DRCRMemoMergeReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      time_dimension: {
        type: Sequelize.DATE
      },
      entity: {
        type: Sequelize.STRING
      },
      merge_number: {
        type: Sequelize.STRING
      },
      merge_date: {
        type: Sequelize.DATEONLY
      },
      invoice_number: {
        type: Sequelize.STRING
      },
      effective_date: {
        type: Sequelize.DATEONLY
      },
      so_number: {
        type: Sequelize.STRING
      },
      so_date: {
        type: Sequelize.DATEONLY
      },
      customer: {
        type: Sequelize.STRING
      },
      shipment: {
        type: Sequelize.INTEGER
      },
      um: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      disc: {
        type: Sequelize.INTEGER
      },
      price_after_disc: {
        type: Sequelize.INTEGER
      },
      price_before_disc: {
        type: Sequelize.INTEGER
      },
      total_disc: {
        type: Sequelize.INTEGER
      },
      invoiced: {
        type: Sequelize.INTEGER
      },
      remarks: {
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
    await queryInterface.dropTable('DRCRMemoMergeReports');
  }
};